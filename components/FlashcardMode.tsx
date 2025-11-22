import React, { useState, useEffect, useCallback } from 'react';
import { generateFlashcard } from '../services/geminiService';
import { FlashcardData } from '../types';
import { RefreshCw, RotateCw, ArrowRight, Loader2 } from 'lucide-react';

const FlashcardMode: React.FC = () => {
  const [card, setCard] = useState<FlashcardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);
    try {
      const data = await generateFlashcard();
      setCard(data);
    } catch (err) {
      setError("Failed to load flashcard. Please check your connection or API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewCard();
  }, [fetchNewCard]);

  const handleFlip = () => {
    if (!loading && card) setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Flashcard Review</h2>
        <p className="text-slate-500">Test your knowledge of the Top 200 drugs</p>
      </div>

      <div className="relative h-[400px] w-full mb-8 group perspective-1000">
        {loading ? (
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Generating flashcard...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full bg-red-50 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchNewCard}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : card ? (
          <div 
            className={`flip-card w-full h-full cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flip-card-inner relative w-full h-full">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8">
                <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                  {card.type}
                </span>
                <h3 className="text-4xl font-bold text-slate-800 text-center leading-tight mb-4 break-words w-full">
                  {card.term}
                </h3>
                <p className="text-slate-400 text-sm mt-8 flex items-center gap-2">
                  <RotateCw className="w-4 h-4" /> Tap to flip
                </p>
              </div>

              {/* Back */}
              <div className="flip-card-back absolute w-full h-full bg-slate-800 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
                <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-blue-300 uppercase bg-slate-700 px-3 py-1 rounded-full">
                  Answer
                </span>
                
                <div className="space-y-6 w-full">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                      {card.type === 'Brand' ? 'Generic Name' : 'Brand Name'}
                    </p>
                    <h3 className="text-2xl font-bold text-white">{card.answer}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-left bg-slate-700/50 p-4 rounded-xl">
                    <div>
                      <p className="text-blue-300 text-xs uppercase tracking-wide mb-1">Class</p>
                      <p className="text-white font-medium">{card.drugClass}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-xs uppercase tracking-wide mb-1">Indication</p>
                      <p className="text-white font-medium">{card.indication}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-center">
        <button
          onClick={fetchNewCard}
          disabled={loading}
          className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full shadow-lg shadow-blue-600/20 font-semibold transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? 'Loading...' : (
            <>
              Next Card
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FlashcardMode;