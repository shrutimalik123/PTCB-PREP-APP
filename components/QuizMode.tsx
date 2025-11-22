import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const QuizMode: React.FC = () => {
  const [questionData, setQuestionData] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setIsCorrect(null);
    
    try {
      const data = await generateQuizQuestion();
      setQuestionData(data);
    } catch (err) {
      setError("Unable to generate quiz question.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent changing answer

    setSelectedOption(option);
    const correct = option === questionData?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

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

      {loading ? (
        <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500">Preparing question...</p>
        </div>
      ) : error ? (
         <div className="w-full bg-red-50 rounded-xl p-6 text-center border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={fetchQuestion} className="text-red-700 font-bold underline">Retry</button>
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
                  onClick={fetchQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-lg shadow-slate-200"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
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