import React, { useState, useCallback, memo } from 'react';
import { Search, Globe, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { searchWeb, generateSearchSummary } from '../../services/webSearchService';
import { askKavachAi } from '../../services/nemotronChatService';
import { motion } from 'framer-motion';

const WebSearchPanel = memo(() => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState({});

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError('');
    setResults([]);
    setSummary('');
    setAiAnalysis({});

    try {
      const searchRes = await searchWeb(query);
      if (searchRes && searchRes.length > 0) {
        setResults(searchRes);
        const sum = await generateSearchSummary(query, searchRes);
        setSummary(sum);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleAskAi = useCallback(async (result, index) => {
    setAiAnalysis(prev => ({ ...prev, [index]: 'loading' }));
    try {
      const prompt = `Based on this search result:\nTitle: ${result.title}\nSnippet: ${result.snippet}\n\nPlease provide a brief analysis or expand on this information related to the search query "${query}".`;
      const res = await askKavachAi([{ role: 'user', content: prompt }], 'meta-llama-3');
      setAiAnalysis(prev => ({ ...prev, [index]: res?.content || 'No insights generated.' }));
    } catch (err) {
      console.error(err);
      setAiAnalysis(prev => ({ ...prev, [index]: 'Failed to generate insights.' }));
    }
  }, [query]);

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] text-slate-200">
      <div className="p-4 bg-[#131B2E] border-b border-[#27395C] sticky top-0 z-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Web..."
              className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg py-2 pl-9 pr-4 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="px-4 py-2 bg-[var(--accent)] text-slate-950 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isSearching && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-800 rounded w-full mb-1"></div>
                <div className="h-3 bg-slate-800 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isSearching && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Globe className="w-12 h-12 mb-4 opacity-50" />
            <p>Search the web for real-time information</p>
          </div>
        )}

        {summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[var(--accent-muted)] to-[#131B2E] border border-[var(--accent)]/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-[var(--accent)] font-bold text-sm uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> AI Summary
            </div>
            <p className="text-sm leading-relaxed text-slate-100">{summary}</p>
          </motion.div>
        )}

        {results.map((result, idx) => (
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }} className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 flex flex-col gap-2">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent)] hover:underline text-lg line-clamp-1">
              {result.title}
            </a>
            <p className="text-xs text-[var(--text-muted)] truncate">{result.url}</p>
            <p className="text-sm text-slate-300">{result.snippet}</p>
            
            <div className="mt-2 pt-2 border-t border-[#27395C]">
              {!aiAnalysis[idx] ? (
                <button 
                  onClick={() => handleAskAi(result, idx)}
                  className="text-xs flex items-center gap-1 text-slate-400 hover:text-[var(--accent)] transition-colors"
                >
                  <MessageSquare className="w-3 h-3" /> Ask AI about this
                </button>
              ) : aiAnalysis[idx] === 'loading' ? (
                <div className="text-xs text-[var(--accent)] flex items-center gap-1 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                </div>
              ) : (
                <div className="bg-[#0B0F19] rounded p-3 text-xs text-slate-300 border border-slate-700/50">
                  <span className="font-bold text-[var(--accent)] mr-2">AI:</span>
                  {aiAnalysis[idx]}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

WebSearchPanel.displayName = 'WebSearchPanel';
export default WebSearchPanel;
