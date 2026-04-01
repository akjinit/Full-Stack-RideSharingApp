import React from 'react';

const AiRecommendationsPanel = ({ 
    aiPanelOpen, 
    setAiPanelOpen, 
    recommendations, 
    isAiLoading, 
    onSelectPlace 
}) => {
    return (
        <div className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${aiPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="p-5 flex flex-col h-[65vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">✨ AI Inspire Me</h3>
                    <button 
                        onClick={() => setAiPanelOpen(false)}
                        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <i className="ri-close-fill text-xl text-gray-700"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-6">
                    {isAiLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium animate-pulse">Discovering hidden gems nearby...</p>
                        </div>
                    ) : recommendations && recommendations.length > 0 ? (
                        <div className="space-y-4 pt-2">
                            {recommendations.map((place, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => {
                                        onSelectPlace(place.name);
                                        setAiPanelOpen(false);
                                    }}
                                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <i className="ri-map-pin-star-fill text-xl"></i>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-gray-800 mb-1">{place.name}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">{place.description}</p>
                                        </div>
                                        <div className="flex items-center text-indigo-500 group-hover:translate-x-1 transition-transform">
                                            <i className="ri-arrow-right-line text-xl"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
                                <i className="ri-planet-line text-4xl"></i>
                            </div>
                            <p className="text-gray-500 font-medium">Click the button below to discover amazing places to visit!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiRecommendationsPanel;
