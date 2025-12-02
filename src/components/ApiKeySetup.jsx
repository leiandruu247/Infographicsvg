import { useState } from 'react';
import { saveApiKey, getApiKey, saveElementApiKey, saveElementProvider, getElementProvider, getElementApiKey } from '../utils/localStorage';
import { validateApiKey } from '../services/geminiApi';
import { IMAGE_PROVIDERS, getProviderName, getProviderDescription } from '../services/imageGenerationService';

export default function ApiKeySetup({ onSetupComplete }) {
  const [geminiKey, setGeminiKey] = useState(getApiKey() || '');
  const [elementProvider, setElementProvider] = useState(getElementProvider());
  const [elementKey, setElementKey] = useState(getElementApiKey(getElementProvider()) || '');

  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showElementKey, setShowElementKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = Gemini, 2 = Element Provider

  const handleGeminiValidate = async () => {
    if (!geminiKey.trim()) {
      setError('Please enter a Gemini API key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = await validateApiKey(geminiKey.trim());

      if (result.valid) {
        saveApiKey(geminiKey.trim());
        setStep(2);
        setError('');
      } else {
        setError(result.error || 'Invalid Gemini API key');
      }
    } catch (err) {
      setError('Failed to validate Gemini API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleElementProviderChange = (provider) => {
    setElementProvider(provider);
    setElementKey(getElementApiKey(provider) || '');
  };

  const handleComplete = () => {
    if (!elementKey.trim() && elementProvider !== IMAGE_PROVIDERS.GEMINI) {
      setError('Please enter an API key for the selected provider');
      return;
    }

    // If using Gemini for elements, use the same API key
    const finalElementKey = elementProvider === IMAGE_PROVIDERS.GEMINI
      ? geminiKey.trim()
      : elementKey.trim();

    saveElementProvider(elementProvider);
    saveElementApiKey(elementProvider, finalElementKey);
    setSuccess(true);

    setTimeout(() => {
      onSetupComplete();
    }, 500);
  };

  const handleSkipElementKey = () => {
    // Use Gemini for elements by default
    saveElementProvider(IMAGE_PROVIDERS.GEMINI);
    saveElementApiKey(IMAGE_PROVIDERS.GEMINI, geminiKey.trim());
    onSetupComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SVG Composer</h1>
          <p className="text-gray-600">AI-powered infographic generator with multi-model support</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
        </div>

        {/* Step 1: Gemini API Key */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 1: Gemini API Key</h2>
              <p className="text-sm text-gray-600">
                Gemini will be used to generate the initial infographic and analyze its elements.
              </p>
            </div>

            <div>
              <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="gemini-key"
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={isValidating}
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isValidating}
                >
                  {showGeminiKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGeminiValidate}
              disabled={isValidating || !geminiKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Next →'}
            </button>
          </div>
        )}

        {/* Step 2: Element Provider */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Step 2: Element Generation Provider</h2>
              <p className="text-sm text-gray-600">
                Choose which AI model to use for regenerating individual elements with transparent backgrounds.
              </p>
            </div>

            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                Image Provider
              </label>
              <select
                id="provider"
                value={elementProvider}
                onChange={(e) => handleElementProviderChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {Object.values(IMAGE_PROVIDERS).map((provider) => (
                  <option key={provider} value={provider}>
                    {getProviderName(provider)} - {getProviderDescription(provider)}
                  </option>
                ))}
              </select>
            </div>

            {elementProvider !== IMAGE_PROVIDERS.GEMINI && (
              <div>
                <label htmlFor="element-key" className="block text-sm font-medium text-gray-700 mb-2">
                  {getProviderName(elementProvider)} API Key
                </label>
                <div className="relative">
                  <input
                    id="element-key"
                    type={showElementKey ? 'text' : 'password'}
                    value={elementKey}
                    onChange={(e) => setElementKey(e.target.value)}
                    placeholder={`Enter your ${getProviderName(elementProvider)} API key`}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowElementKey(!showElementKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showElementKey ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                Setup complete! Redirecting...
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              {elementProvider === IMAGE_PROVIDERS.GEMINI && (
                <button
                  onClick={handleSkipElementKey}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Complete Setup (Use Gemini)
                </button>
              )}
              {elementProvider !== IMAGE_PROVIDERS.GEMINI && (
                <button
                  onClick={handleComplete}
                  disabled={!elementKey.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your API keys are stored locally in your browser and never sent to any server except the respective AI providers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
