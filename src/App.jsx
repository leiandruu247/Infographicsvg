import { useState } from 'react';
import ApiKeySetup from './components/ApiKeySetup';
import PromptInput from './components/PromptInput';
import ProcessingStatus from './components/ProcessingStatus';
import PreviewDownload from './components/PreviewDownload';
import { getApiKey, getElementProvider, getElementApiKey } from './utils/localStorage';
import { generateInfographic, retryApiCall } from './services/geminiApi';
import { analyzeAndRegenerateElements } from './services/imageAnalyzer';
import { assembleSvg, createSvgPreview } from './services/svgAssembler';

// Application states
const STATES = {
  API_KEY_INPUT: 'api_key_input',
  PROMPT_INPUT: 'prompt_input',
  PROCESSING: 'processing',
  PREVIEW: 'preview'
};

function App() {
  const [currentState, setCurrentState] = useState(
    getApiKey() ? STATES.PROMPT_INPUT : STATES.API_KEY_INPUT
  );
  const [apiKey, setApiKey] = useState(getApiKey());
  const [processingStatus, setProcessingStatus] = useState({
    phase: 'generating',
    message: 'Starting...'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle setup completion
  const handleSetupComplete = () => {
    setApiKey(getApiKey());
    setCurrentState(STATES.PROMPT_INPUT);
  };

  // Convert aspect ratio to dimensions
  const getAspectRatioDimensions = (aspectRatio) => {
    const ratioMap = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1376, height: 768 },
      '9:16': { width: 768, height: 1376 },
      '4:3': { width: 1024, height: 768 },
      '3:4': { width: 768, height: 1024 },
      '21:9': { width: 1680, height: 720 },
      '2:3': { width: 682, height: 1024 },
      '3:2': { width: 1024, height: 682 },
      '4:5': { width: 819, height: 1024 },
      '5:4': { width: 1024, height: 819 }
    };
    return ratioMap[aspectRatio] || { width: 1376, height: 768 };
  };

  // Handle generation start
  const handleGenerate = async ({ prompt, aspectRatio }) => {
    setCurrentState(STATES.PROCESSING);
    setError(null);

    try {
      // Step 1: Generate complete infographic
      setProcessingStatus({
        phase: 'generating',
        message: 'Generating complete infographic...'
      });

      const infographic = await retryApiCall(() =>
        generateInfographic(apiKey, prompt, aspectRatio)
      );

      // Step 2: Analyze and regenerate elements
      const elementProvider = getElementProvider();
      const elementApiKey = getElementApiKey(elementProvider);

      const elementsResult = await analyzeAndRegenerateElements(
        apiKey,
        infographic.imageData,
        aspectRatio,
        elementProvider,
        elementApiKey,
        (status) => setProcessingStatus(status)
      );

      // Step 3: Assemble SVG
      setProcessingStatus({
        phase: 'assembling',
        message: 'Assembling final SVG...'
      });

      // Get dimensions for SVG assembly
      const { width, height } = getAspectRatioDimensions(aspectRatio);
      const svgString = assembleSvg(elementsResult.elements, width, height);

      // Step 4: Create preview
      const previewUrl = await createSvgPreview(svgString, width, height);

      // Extract base64 from preview URL
      const pngBase64 = previewUrl.startsWith('data:image/png;base64,')
        ? previewUrl.split(',')[1]
        : null;

      setResult({
        svgString,
        previewUrl,
        pngBase64,
        elements: elementsResult.elements,
        width,
        height
      });

      setCurrentState(STATES.PREVIEW);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'Failed to generate infographic');
      setCurrentState(STATES.PROMPT_INPUT);
      alert(`Error: ${err.message || 'Failed to generate infographic'}`);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setCurrentState(STATES.PROMPT_INPUT);
  };

  // Handle create another
  const handleCreateAnother = () => {
    setResult(null);
    setError(null);
    setCurrentState(STATES.PROMPT_INPUT);
  };

  // Render appropriate component based on state
  return (
    <div className="App">
      {currentState === STATES.API_KEY_INPUT && (
        <ApiKeySetup onSetupComplete={handleSetupComplete} />
      )}

      {currentState === STATES.PROMPT_INPUT && (
        <PromptInput
          onGenerate={handleGenerate}
          isGenerating={false}
        />
      )}

      {currentState === STATES.PROCESSING && (
        <ProcessingStatus
          status={processingStatus}
          onCancel={handleCancel}
        />
      )}

      {currentState === STATES.PREVIEW && result && (
        <PreviewDownload
          previewUrl={result.previewUrl}
          svgString={result.svgString}
          pngBase64={result.pngBase64}
          elements={result.elements}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </div>
  );
}

export default App;
