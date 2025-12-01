import { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import PromptInput from './components/PromptInput';
import ProcessingStatus from './components/ProcessingStatus';
import PreviewDownload from './components/PreviewDownload';
import { getApiKey } from './utils/localStorage';
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

  // Handle API key validation
  const handleApiKeyValidated = (validatedKey) => {
    setApiKey(validatedKey);
    setCurrentState(STATES.PROMPT_INPUT);
  };

  // Handle generation start
  const handleGenerate = async ({ prompt, width, height }) => {
    setCurrentState(STATES.PROCESSING);
    setError(null);

    try {
      // Step 1: Generate complete infographic
      setProcessingStatus({
        phase: 'generating',
        message: 'Generating complete infographic...'
      });

      const infographic = await retryApiCall(() =>
        generateInfographic(apiKey, prompt, width, height)
      );

      // Step 2: Analyze and regenerate elements
      const elementsResult = await analyzeAndRegenerateElements(
        apiKey,
        infographic.imageData,
        width,
        height,
        (status) => setProcessingStatus(status)
      );

      // Step 3: Assemble SVG
      setProcessingStatus({
        phase: 'assembling',
        message: 'Assembling final SVG...'
      });

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
        <ApiKeyInput onApiKeyValidated={handleApiKeyValidated} />
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
