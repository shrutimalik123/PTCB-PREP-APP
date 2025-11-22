import React from 'react';
import { AppMode } from '../types';
import { BookOpen, BrainCircuit, Library, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.FLASHCARD, label: 'Flashcards', icon: <BookOpen className="w-5 h-5" /> },
    { mode: AppMode.QUIZ, label: 'Quiz', icon: <BrainCircuit className="w-5 h-5" /> },
    { mode: AppMode.STUDY_SHEET, label: 'Study Sheet', icon: <Library className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setMode(AppMode.HOME)}
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
            PharmTech<span className="text-blue-600">Tutor</span>
          </h1>
        </div>

        <nav className="flex gap-1 sm:gap-2">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                ${currentMode === item.mode 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;