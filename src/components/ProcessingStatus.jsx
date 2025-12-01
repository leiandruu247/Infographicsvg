export default function ProcessingStatus({ status, onCancel }) {
  const phases = [
    { key: 'generating', label: 'Generating infographic' },
    { key: 'analyzing', label: 'Analyzing elements' },
    { key: 'regenerating', label: 'Regenerating elements' },
    { key: 'assembling', label: 'Assembling SVG' }
  ];

  const getCurrentPhaseIndex = () => {
    const index = phases.findIndex(p => p.key === status.phase);
    return index === -1 ? 0 : index;
  };

  const currentPhaseIndex = getCurrentPhaseIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Infographic</h2>
          <p className="text-gray-600">This may take a few minutes...</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {phases.map((phase, index) => {
            const isActive = index === currentPhaseIndex;
            const isCompleted = index < currentPhaseIndex;

            return (
              <div key={phase.key} className="flex items-center space-x-4">
                {/* Step Indicator */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-gray-800' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {phase.label}
                  </div>

                  {/* Progress Bar for Active Step */}
                  {isActive && (
                    <div className="mt-2">
                      {status.phase === 'regenerating' && status.total > 0 ? (
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{status.message}</span>
                            <span>{status.current} / {status.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(status.current / status.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs text-gray-600 mb-1">{status.message}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
