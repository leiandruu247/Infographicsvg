import { useState } from 'react';

export default function PromptInput({ onGenerate, isGenerating }) {
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(1376);
  const [height, setHeight] = useState(768);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      return;
    }

    onGenerate({
      prompt: prompt.trim(),
      width: parseInt(width) || 1376,
      height: parseInt(height) || 768
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                      Width (px)
                    </label>
                    <input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      min="256"
                      max="4096"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={isGenerating}
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                      Height (px)
                    </label>
                    <input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="256"
                      max="4096"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={isGenerating}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Default: 1376x768 (16:9 ratio). Recommended range: 256-4096px
                </p>
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
