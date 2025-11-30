import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import StudySheetMode from './components/StudySheetMode';
import { AppMode } from './types';
import { TOP_200_DRUGS, shuffleDeck } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  
  // Use a ref for the deck so we can pop synchronously without waiting for re-renders
  const deckRef = useRef<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Initialize/Reset deck
  const resetDeck = useCallback(() => {
    deckRef.current = shuffleDeck(TOP_200_DRUGS);
    setProgress(0);
  }, []);

  useEffect(() => {
    resetDeck();
  }, [resetDeck]);

  const getNextDrug = useCallback((): string | null => {
    if (deckRef.current.length === 0) return null;
    const drug = deckRef.current.pop();
    // Update progress state for UI (calculate based on remaining)
    setProgress(TOP_200_DRUGS.length - deckRef.current.length);
    return drug || null;
  }, []);

  const renderContent = () => {
    switch (mode) {
      case AppMode.FLASHCARD:
        return <FlashcardMode getNextDrug={getNextDrug} />;
      case AppMode.QUIZ:
        return <QuizMode getNextDrug={getNextDrug} />;
      case AppMode.STUDY_SHEET:
        return <StudySheetMode />;
      case AppMode.HOME:
      default:
        return <Home setMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header currentMode={mode} setMode={setMode} />
      
      {(mode === AppMode.FLASHCARD || mode === AppMode.QUIZ) && (
        <div className="bg-slate-100 border-b border-slate-200 py-1 text-xs text-center text-slate-500">
          Session Progress: <span className="font-semibold text-slate-700">{progress} / {TOP_200_DRUGS.length}</span> drugs
          <button 
            onClick={() => {
              if(confirm("Reset progress?")) {
                resetDeck();
                setMode(AppMode.HOME); // Force remount of components
                setTimeout(() => setMode(mode), 10);
              }
            }} 
            className="ml-4 text-blue-600 hover:underline"
          >
            Reset
          </button>
        </div>
      )}

      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} PharmTechTutor. Powered by Gemini API.</p>
          <p className="mt-1 text-xs">For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;