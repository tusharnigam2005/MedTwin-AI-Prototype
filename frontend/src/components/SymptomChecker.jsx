import React, { useState, useRef, useEffect } from 'react';
import { symptomsAPI } from '../services/api';
import { Search, Activity, AlertCircle, X } from 'lucide-react';

const SymptomChecker = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const [followupData, setFollowupData] = useState(null);
  const [answers, setAnswers] = useState({});

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e, overrideQuery = null) => {
    if (e) e.preventDefault();
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim() || searchQuery.length < 3) return;

    setLoading(true);
    setError('');
    setResult(null);
    setFollowupData(null);
    setIsOpen(true);

    try {
      const response = await symptomsAPI.recommendTest(searchQuery);
      if (response.data.needs_followup) {
        setFollowupData(response.data);
        setAnswers({});
      } else {
        setResult(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitFollowup = () => {
    if (!followupData) return;
    const contextParts = followupData.questions.map((q, i) => answers[i] ? `${q} ${answers[i]}` : '');
    const context = contextParts.filter(p => p).join('. ');
    const combinedQuery = `${followupData.original_query}. ${context}`;
    handleSearch(null, combinedQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setResult(null);
    setFollowupData(null);
    setAnswers({});
    setError('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Activity className="h-4 w-4 text-sky-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          placeholder="Know Your Lab Report How are you feeling today?"
          className="block w-full pl-9 pr-10 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 hover:bg-white focus:bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs shadow-sm transition-all text-slate-900 font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-8 pr-2 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-1 top-1 bottom-1 p-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Popover Results Window */}
      {isOpen && (loading || error || result || followupData) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-2xl ring-1 ring-slate-900/5 rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">

          {loading && (
            <div className="p-6 flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
              <p className="text-slate-500 text-sm font-medium">Analyzing symptoms via Semantic AI...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 flex items-start gap-3 border-b border-red-100">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {followupData && !loading && (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-100">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">More Information Needed</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">Please provide a bit more detail so we can accurately triage your symptoms.</p>
              
              <div className="space-y-4">
                {followupData.questions.map((q, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">{q}</label>
                    <input
                      type="text"
                      value={answers[idx] || ''}
                      onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                      placeholder="Type your answer..."
                      className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50 hover:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
              
              <button
                onClick={submitFollowup}
                className="w-full mt-5 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Submit Answers
              </button>
            </div>
          )}

          {result && !loading && (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center border border-sky-100">
                  <Activity className="w-4 h-4 text-sky-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">AI Triage Results</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recommended Test</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{result.recommended_test}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Urgency Level</span>
                    <div className={`text-xs font-bold px-2 py-1 inline-flex rounded-md border ${result.urgency.includes('High') ? 'bg-rose-50 text-rose-700 border-rose-200' : result.urgency.includes('Moderate') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {result.urgency}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confidence</span>
                    <div className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 inline-flex">
                      {result.match_distance !== undefined ? (result.match_distance === 0 ? '100% (Red Flag)' : `${((1 - result.match_distance / 2) * 100).toFixed(1)}%`) : 'High'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Matched Clinical Profile</span>
                  <p className={`text-xs mt-1 italic ${result.match_distance === 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>"{result.matched_symptoms}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
