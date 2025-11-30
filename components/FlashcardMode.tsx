import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateFlashcard } from '../services/geminiService';
import { FlashcardData } from '../types';
import { RefreshCw, RotateCw, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface FlashcardModeProps {
  getNextDrug: () => string | null;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ getNextDrug }) => {
  const [currentCard, setCurrentCard] = useState<FlashcardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Store the promise for the next card
  const nextCardPromise = useRef<Promise<FlashcardData> | null>(null);

  const fetchCardForDrug = async (drug: string): Promise<FlashcardData> => {
    return await generateFlashcard(drug);
  };

  const loadInitialCards = useCallback(async () => {
    setLoading(true);
    setIsFinished(false);
    
    // Get first drug
    const drug1 = getNextDrug();
    if (!drug1) {
      setIsFinished(true);
      setLoading(false);
      return;
    }

    // Get second drug for background fetching
    const drug2 = getNextDrug();
    if (drug2) {
      nextCardPromise.current = fetchCardForDrug(drug2);
    } else {
      nextCardPromise.current = null;
    }

    try {
      const card1 = await fetchCardForDrug(drug1);
      setCurrentCard(card1);
    } catch (err) {
      setError("Failed to generate card. Check connection.");
    } finally {
      setLoading(false);
    }
  }, [getNextDrug]);

  useEffect(() => {
    loadInitialCards();
    return () => { nextCardPromise.current = null; };
  }, [loadInitialCards]);

  const handleNext = async () => {
    if (!nextCardPromise.current) {
      // Check if we still have drugs in the deck
      const drug = getNextDrug();
      if (!drug) {
        setIsFinished(true);
        setCurrentCard(null);
        return;
      }
      // If we didn't have a promise but have a drug, fetch it now (fallback)
      setLoading(true);
      try {
        const card = await fetchCardForDrug(drug);
        setCurrentCard(card);
        setIsFlipped(false);
      } catch (err) {
        setError("Error loading card");
      } finally {
        setLoading(false);
      }
      return;
    }

    // "Instant" transition logic
    setLoading(true); // Short loading state for swap
    setIsFlipped(false);
    
    try {
      // 1. Await the pre-fetched card
      const nextCard = await nextCardPromise.current;
      setCurrentCard(nextCard);

      // 2. Queue up the NEXT one immediately
      const nextDrug = getNextDrug();
      if (nextDrug) {
        nextCardPromise.current = fetchCardForDrug(nextDrug);
      } else {
        nextCardPromise.current = null;
      }
    } catch (err) {
      setError("Failed to load next card.");
      nextCardPromise.current = null; // Reset to force retry logic if needed
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    if (!loading && currentCard) setIsFlipped(!isFlipped);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">You did it!</h2>
        <p className="text-slate-600 mb-8">You've cycled through all available drugs in this session.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Flashcard Review</h2>
        <p className="text-slate-500">Tap card to reveal answer</p>
      </div>

      <div className="relative h-[400px] w-full mb-8 group perspective-1000">
        {loading && !currentCard ? (
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading deck...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="underline text-red-700">Reload</button>
          </div>
        ) : currentCard ? (
          <div 
            className={`flip-card w-full h-full cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flip-card-inner relative w-full h-full">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8">
                <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                  {currentCard.type}
                </span>
                <h3 className="text-4xl font-bold text-slate-800 text-center leading-tight mb-4 break-words w-full">
                  {currentCard.term}
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
                      {currentCard.type === 'Brand' ? 'Generic Name' : 'Brand Name'}
                    </p>
                    <h3 className="text-2xl font-bold text-white">{currentCard.answer}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-left bg-slate-700/50 p-4 rounded-xl">
                    <div>
                      <p className="text-blue-300 text-xs uppercase tracking-wide mb-1">Class</p>
                      <p className="text-white font-medium">{currentCard.drugClass}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-xs uppercase tracking-wide mb-1">Indication</p>
                      <p className="text-white font-medium">{currentCard.indication}</p>
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
          onClick={handleNext}
          disabled={loading}
          className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full shadow-lg shadow-blue-600/20 font-semibold transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? 'Fetching...' : (
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