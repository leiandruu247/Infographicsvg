import { useState } from 'react';
import { downloadSvg, downloadPng, downloadZipBundle } from '../services/fileExporter';

export default function PreviewDownload({ previewUrl, svgString, pngBase64, elements, onCreateAnother }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSvg = () => {
    downloadSvg(svgString);
  };

  const handleDownloadPng = () => {
    downloadPng(pngBase64);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadZipBundle(svgString, elements);
    } catch (error) {
      alert('Failed to create ZIP file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Infographic is Ready!</h1>
          <p className="text-gray-600">Preview and download your generated SVG infographic</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          {/* Preview */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={previewUrl}
                alt="Generated infographic preview"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Download Options */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Download Options</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* SVG Download */}
              <button
                onClick={handleDownloadSvg}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex flex-col items-center space-y-2"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div>
                  <div className="font-semibold">Download SVG</div>
                  <div className="text-xs opacity-90">Editable vector format</div>
                </div>
              </button>

              {/* PNG Download */}
              <button
                onClick={handleDownloadPng}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex flex-col items-center space-y-2"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-semibold">Download PNG</div>
                  <div className="text-xs opacity-90">High-quality image</div>
                </div>
              </button>

              {/* ZIP Download */}
              <button
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex flex-col items-center space-y-2 disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-semibold">
                    {isDownloading ? 'Creating...' : 'Download ZIP'}
                  </div>
                  <div className="text-xs opacity-90">SVG + all elements</div>
                </div>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <strong>ZIP Bundle includes:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>SVG file with all elements composed</li>
                    <li>Individual PNG files for each element in an /elements/ folder</li>
                    <li>All elements have transparent backgrounds for easy editing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Another Button */}
        <div className="text-center">
          <button
            onClick={onCreateAnother}
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 rounded-lg border border-gray-300 transition-colors shadow-sm"
          >
            Create Another Infographic
          </button>
        </div>
      </div>
    </div>
  );
}
