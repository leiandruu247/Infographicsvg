import { useState, useEffect } from 'react';
import { getElementProvider, getElementApiKey, saveElementProvider, saveElementApiKey } from '../utils/localStorage';
import { IMAGE_PROVIDERS, getProviderName, getProviderDescription } from '../services/imageGenerationService';

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square)', description: 'Perfect for social media posts' },
  { value: '16:9', label: '16:9 (Landscape)', description: 'Widescreen, presentations' },
  { value: '9:16', label: '9:16 (Portrait)', description: 'Mobile stories, vertical content' },
  { value: '4:3', label: '4:3 (Standard)', description: 'Classic screen ratio' },
  { value: '3:4', label: '3:4 (Portrait)', description: 'Vertical print layouts' },
  { value: '21:9', label: '21:9 (Ultra-wide)', description: 'Cinematic, banners' },
  { value: '2:3', label: '2:3 (Portrait)', description: 'Photo prints' },
  { value: '3:2', label: '3:2 (Landscape)', description: '35mm photo format' },
  { value: '4:5', label: '4:5 (Portrait)', description: 'Instagram vertical' },
  { value: '5:4', label: '5:4 (Landscape)', description: 'Computer displays' }
];

export default function PromptInput({ onGenerate, isGenerating }) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Element generation provider settings
  const [elementProvider, setElementProvider] = useState(getElementProvider());
  const [elementApiKey, setElementApiKey] = useState('');
  const [showElementKey, setShowElementKey] = useState(false);
  const [providerSaveMessage, setProviderSaveMessage] = useState('');

  useEffect(() => {
    // Load API key for selected provider
    const savedKey = getElementApiKey(elementProvider);
    setElementApiKey(savedKey || '');
  }, [elementProvider]);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      return;
    }

    // If using a non-Gemini provider and no API key, show error
    if (elementProvider !== IMAGE_PROVIDERS.GEMINI && !elementApiKey.trim()) {
      setProviderSaveMessage('Please enter an API key or switch to Gemini');
      return;
    }

    // Save provider settings
    if (elementApiKey.trim()) {
      saveElementApiKey(elementProvider, elementApiKey.trim());
    }
    saveElementProvider(elementProvider);

    onGenerate({
      prompt: prompt.trim(),
      aspectRatio: aspectRatio
    });
  };

  const handleProviderChange = (provider) => {
    setElementProvider(provider);
    setProviderSaveMessage('');
  };

  const handleSaveProviderSettings = () => {
    if (elementProvider !== IMAGE_PROVIDERS.GEMINI && !elementApiKey.trim()) {
      setProviderSaveMessage('Please enter an API key');
      return;
    }

    saveElementProvider(elementProvider);
    if (elementApiKey.trim()) {
      saveElementApiKey(elementProvider, elementApiKey.trim());
    }
    setProviderSaveMessage('Settings saved!');
    setTimeout(() => setProviderSaveMessage(''), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const selectedRatio = ASPECT_RATIOS.find(r => r.value === aspectRatio);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Infographic</h1>
          <p className="text-gray-600">Describe the infographic you want to generate</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Infographic Description
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Example: Create a modern infographic about the benefits of renewable energy, including solar, wind, and hydro power. Use icons, charts, and statistics. Make it colorful and professional."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Press Ctrl/Cmd + Enter to submit
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div>
                  <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 mb-2">
                    Aspect Ratio
                  </label>
                  <select
                    id="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    disabled={isGenerating}
                  >
                    {ASPECT_RATIOS.map((ratio) => (
                      <option key={ratio.value} value={ratio.value}>
                        {ratio.label} - {ratio.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedRatio?.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Element Generation Model</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Choose which AI model to use for generating transparent elements. Gemini works but may have transparency issues.
                    Other models are optimized for transparent backgrounds.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="elementProvider" className="block text-sm font-medium text-gray-700 mb-2">
                        Model Provider
                      </label>
                      <select
                        id="elementProvider"
                        value={elementProvider}
                        onChange={(e) => handleProviderChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        disabled={isGenerating}
                      >
                        {Object.values(IMAGE_PROVIDERS).map((provider) => (
                          <option key={provider} value={provider}>
                            {getProviderName(provider)}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {getProviderDescription(elementProvider)}
                      </p>
                    </div>

                    {elementProvider !== IMAGE_PROVIDERS.GEMINI && (
                      <div>
                        <label htmlFor="elementApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                          {getProviderName(elementProvider)} API Key
                        </label>
                        <div className="relative">
                          <input
                            id="elementApiKey"
                            type={showElementKey ? 'text' : 'password'}
                            value={elementApiKey}
                            onChange={(e) => {
                              setElementApiKey(e.target.value);
                              setProviderSaveMessage('');
                            }}
                            placeholder={`Enter your ${getProviderName(elementProvider)} API key`}
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            disabled={isGenerating}
                          />
                          <button
                            type="button"
                            onClick={() => setShowElementKey(!showElementKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={isGenerating}
                          >
                            {showElementKey ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {elementProvider === IMAGE_PROVIDERS.RECRAFT && 'Get API key from recraft.ai'}
                            {elementProvider === IMAGE_PROVIDERS.FIREFLY && 'Get API key from firefly.adobe.com'}
                            {elementProvider === IMAGE_PROVIDERS.IDEOGRAM && 'Get API key from ideogram.ai'}
                          </p>
                          <button
                            type="button"
                            onClick={handleSaveProviderSettings}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            disabled={isGenerating}
                          >
                            Save Settings
                          </button>
                        </div>
                      </div>
                    )}

                    {elementProvider === IMAGE_PROVIDERS.GEMINI && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-gray-700">
                          Using Gemini for element generation. This uses your existing Gemini API key.
                          Note: Transparency support may be limited.
                        </p>
                      </div>
                    )}

                    {providerSaveMessage && (
                      <div className={`text-xs p-2 rounded ${
                        providerSaveMessage.includes('saved') || providerSaveMessage.includes('Settings')
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {providerSaveMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Infographic'}
          </button>
        </div>
      </div>
    </div>
  );
}
