import React, { useState } from 'react';
import { getDrugDetails } from '../services/geminiService';
import { DrugDetails } from '../types';
import { Search, Pill, Stethoscope, AlertTriangle, FileText, Loader2 } from 'lucide-react';

const StudySheetMode: React.FC = () => {
  const [query, setQuery] = useState('');
  const [details, setDetails] = useState<DrugDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setDetails(null);

    try {
      const result = await getDrugDetails(query);
      setDetails(result);
    } catch (err) {
      setError("Could not find details for that drug. Please check the spelling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Study Sheet</h2>
        <p className="text-slate-500">Quick lookup for any Top 200 drug</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter drug name (e.g., 'Lipitor' or 'Atorvastatin')"
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg transition-all"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center mb-8">
          {error}
        </div>
      )}

      {details && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-3xl font-bold text-slate-800">{details.brandName}</h3>
                <p className="text-xl text-blue-600 font-medium mt-1">{details.genericName}</p>
              </div>
              {details.schedule !== 'OTC' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-700 border border-red-200 whitespace-nowrap w-fit">
                  {details.schedule}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">
                  <Pill className="w-4 h-4" /> Drug Class
                </div>
                <p className="text-slate-800 font-medium text-lg">{details.drugClass}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">
                  <Stethoscope className="w-4 h-4" /> Indication
                </div>
                <p className="text-slate-800 text-lg">{details.indication}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                 <div className="flex items-center gap-2 text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Common Side Effects
                </div>
                <ul className="space-y-2">
                  {details.sideEffects.map((effect, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-blue-400 shrink-0" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">
                  <FileText className="w-4 h-4" /> Study Notes
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Remember that {details.brandName} is a {details.drugClass} typically used for {details.indication.toLowerCase()}. 
                  Always verify patient allergies before dispensing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySheetMode;