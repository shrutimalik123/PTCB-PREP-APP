import React from 'react';
import { AppMode } from '../types';
import { BookOpen, BrainCircuit, Library } from 'lucide-react';

interface HomeProps {
  setMode: (mode: AppMode) => void;
}

const Home: React.FC<HomeProps> = ({ setMode }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Top 200 Drugs</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Your intelligent AI companion for Pharmacy Technician Certification Board (PTCB) exam preparation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div 
          onClick={() => setMode(AppMode.FLASHCARD)}
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-blue-50 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <BookOpen className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Flashcards</h3>
          <p className="text-slate-500 relative z-10">
            Active recall practice with Brand, Generic, Class, and Indication flip cards.
          </p>
        </div>

        <div 
          onClick={() => setMode(AppMode.QUIZ)}
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-purple-50 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <BrainCircuit className="w-12 h-12 text-purple-600 mb-6 relative z-10" />
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Quiz Mode</h3>
          <p className="text-slate-500 relative z-10">
            Test your knowledge with AI-generated multiple choice questions.
          </p>
        </div>

        <div 
          onClick={() => setMode(AppMode.STUDY_SHEET)}
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-teal-50 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <Library className="w-12 h-12 text-teal-600 mb-6 relative z-10" />
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Study Sheet</h3>
          <p className="text-slate-500 relative z-10">
            Instant detailed lookup for any drug including side effects and schedule.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;