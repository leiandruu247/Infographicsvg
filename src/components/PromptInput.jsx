import { useState } from 'react';

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

  const handleSubmit = () => {
    if (!prompt.trim()) {
      return;
    }

    onGenerate({
      prompt: prompt.trim(),
      aspectRatio: aspectRatio
    });
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
