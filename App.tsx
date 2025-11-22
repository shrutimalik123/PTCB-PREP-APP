import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import StudySheetMode from './components/StudySheetMode';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.FLASHCARD:
        return <FlashcardMode />;
      case AppMode.QUIZ:
        return <QuizMode />;
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
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} PharmTechTutor. Powered by Gemini API.</p>
          <p className="mt-1 text-xs">For educational purposes only. Not for clinical use.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;