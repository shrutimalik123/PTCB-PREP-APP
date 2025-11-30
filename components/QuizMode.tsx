import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Loader2, Trophy } from 'lucide-react';

interface QuizModeProps {
  getNextDrug: () => string | null;
}

const QuizMode: React.FC<QuizModeProps> = ({ getNextDrug }) => {
  const [questionData, setQuestionData] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const nextQuestionPromise = useRef<Promise<QuizQuestion> | null>(null);

  const fetchQuestionForDrug = async (drug: string): Promise<QuizQuestion> => {
    return await generateQuizQuestion(drug);
  };

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const drug1 = getNextDrug();
    if (!drug1) {
      setIsFinished(true);
      setLoading(false);
      return;
    }

    const drug2 = getNextDrug();
    if (drug2) {
      nextQuestionPromise.current = fetchQuestionForDrug(drug2);
    } else {
      nextQuestionPromise.current = null;
    }

    try {
      const q1 = await fetchQuestionForDrug(drug1);
      setQuestionData(q1);
    } catch (e) {
      setError("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  }, [getNextDrug]);

  useEffect(() => {
    loadInitial();
    return () => { nextQuestionPromise.current = null; };
  }, [loadInitial]);

  const handleNext = async () => {
    setSelectedOption(null);
    setIsCorrect(null);

    if (!nextQuestionPromise.current) {
      const drug = getNextDrug();
      if (!drug) {
        setIsFinished(true);
        return;
      }
      setLoading(true);
      try {
        const q = await fetchQuestionForDrug(drug);
        setQuestionData(q);
      } catch (e) { setError("Error loading question"); }
      finally { setLoading(false); }
      return;
    }

    setLoading(true);
    try {
      const nextQ = await nextQuestionPromise.current;
      setQuestionData(nextQ);

      const nextDrug = getNextDrug();
      if (nextDrug) {
        nextQuestionPromise.current = fetchQuestionForDrug(nextDrug);
      } else {
        nextQuestionPromise.current = null;
      }
    } catch (e) {
      setError("Failed to load next question");
      nextQuestionPromise.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const correct = option === questionData?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center">
        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Quiz Complete!</h2>
        <p className="text-slate-600 mb-8">You have practiced all available drugs.</p>
        <div className="inline-block bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <p className="text-sm text-slate-500 uppercase font-bold">Final Streak</p>
          <p className="text-4xl font-bold text-blue-600">{streak}</p>
        </div>
        <div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Practice Quiz</h2>
          <p className="text-slate-500">Select the correct option</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          🔥 Streak: {streak}
        </div>
      </div>

      {loading && !questionData ? (
        <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500">Preparing next question...</p>
        </div>
      ) : error ? (
         <div className="w-full bg-red-50 rounded-xl p-6 text-center border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={handleNext} className="text-red-700 font-bold underline">Skip</button>
         </div>
      ) : questionData ? (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
              {questionData.question}
            </h3>
          </div>

          <div className="grid gap-3">
            {questionData.options.map((option, index) => {
              let buttonStyle = "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700";
              
              if (selectedOption) {
                if (option === questionData.correctAnswer) {
                  buttonStyle = "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500";
                } else if (option === selectedOption && option !== questionData.correctAnswer) {
                  buttonStyle = "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500";
                } else {
                  buttonStyle = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!selectedOption}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {selectedOption && option === questionData.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {selectedOption && option === selectedOption && option !== questionData.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`rounded-xl p-6 border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                  {isCorrect ? 'Correct!' : 'Explanation'}
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {questionData.explanation}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-lg shadow-slate-200"
                >
                  {loading ? 'Loading...' : <>Next Question <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default QuizMode;