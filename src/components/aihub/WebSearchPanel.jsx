import React, { useState, useCallback, memo } from 'react';
import { Search, Globe, MessageSquare, Loader2, AlertCircle, ExternalLink, Sparkles, Check } from 'lucide-react';
import { searchWeb } from '../../services/webSearchService';
import { askKavachAi } from '../../services/nemotronChatService';
import { motion } from 'framer-motion';

const WebSearchPanel = memo(() => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState({});

  const quickSearchChips = [
    'Google',
    'YouTube',
    'SBI Cybercrime 1930',
    'VirusTotal Scanner',
    'GitHub Code',
  ];

  const handleSearch = useCallback(async (e, overrideQuery) => {
    e?.preventDefault();
    const q = overrideQuery || query;
    if (!q || !q.trim()) return;

    if (overrideQuery) setQuery(overrideQuery);
    
    setIsSearching(true);
    setError('');
    setResults([]);
    setSummary('');
    setAiAnalysis({});

    try {
      const response = await searchWeb(q.trim());
      if (response && response.success && Array.isArray(response.results) && response.results.length > 0) {
        setResults(response.results);
        setSummary(response.summary || '');
      } else {
        setError('No results found for your search. Try another keyword!');
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
      const prompt = `Explain and analyze this web search result in plain language:\nTitle: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.url}`;
      const res = await askKavachAi(prompt, [], 'kavach-pro', false, { personaId: 'cyber-expert' });
      setAiAnalysis(prev => ({ ...prev, [index]: res?.text || 'Analysis completed.' }));
    } catch (err) {
      console.error(err);
      setAiAnalysis(prev => ({ ...prev, [index]: 'Failed to generate insights.' }));
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] text-slate-200 font-mono">
      {/* Header Search Bar */}
      <div className="p-3.5 sm:p-4 bg-[#131B2E] border-b border-[#27395C] sticky top-0 z-10 space-y-2.5">
        <form onSubmit={(e) => handleSearch(e)} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Google, websites, news, or topics..."
              className="w-full bg-[#0B0F19] border border-[#27395C] rounded-xl py-2.5 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="px-4 py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md shrink-0"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            <span>Search</span>
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <Sparkles size={12} className="text-amber-400 shrink-0 ml-0.5" />
          <span className="text-[10px] text-[var(--text-muted)] font-bold shrink-0">Popular:</span>
          {quickSearchChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSearch(null, chip)}
              className="px-2.5 py-0.5 rounded-lg bg-[#0B0F19] border border-[#27395C] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] whitespace-nowrap transition-all text-[10px] font-mono shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results View Container */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
        {isSearching && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl animate-pulse space-y-2">
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                <div className="h-3 bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-800 rounded w-4/5"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/30 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!isSearching && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)] text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#131B2E] border border-[#27395C] flex items-center justify-center text-[var(--accent)]">
              <Globe className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-xs font-bold text-[var(--text-primary)]">Real-Time Internet Web Search</p>
            <p className="text-[11px] text-[var(--text-muted)] max-w-xs">Type any website name, news topic, or query above to get live web links & AI summaries</p>
          </div>
        )}

        {summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#131B2E] via-[#16223B] to-[#131B2E] border border-[var(--accent)]/50 rounded-xl p-4 shadow-lg space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> AI Search Synthesis
            </div>
            <p className="text-xs leading-relaxed text-slate-200">{summary}</p>
          </motion.div>
        )}

        {results.map((result, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-[#131B2E] border border-[#27395C] hover:border-[var(--accent)]/60 rounded-xl p-4 flex flex-col gap-2 shadow-md transition-all">
            <div className="flex items-start justify-between gap-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sm sm:text-base text-[var(--accent)] hover:underline flex items-center gap-1.5 leading-snug"
              >
                <span>{result.title}</span>
                <ExternalLink size={14} className="shrink-0 text-[var(--accent)]" />
              </a>

              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#0B0F19] text-emerald-400 border border-emerald-500/30 shrink-0">
                {result.source || 'VERIFIED LINK'}
              </span>
            </div>

            <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--text-muted)] truncate hover:underline font-mono">
              {result.url}
            </a>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans mt-0.5">{result.snippet}</p>
            
            <div className="mt-1.5 pt-2 border-t border-[#1E2D4A] flex items-center justify-between">
              {!aiAnalysis[idx] ? (
                <button 
                  onClick={() => handleAskAi(result, idx)}
                  className="text-[11px] flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Ask KAVACH AI About This Result</span>
                </button>
              ) : aiAnalysis[idx] === 'loading' ? (
                <div className="text-[11px] text-[var(--accent)] flex items-center gap-1.5 animate-pulse font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>KAVACH AI Analyzing Result...</span>
                </div>
              ) : (
                <div className="bg-[#0B0F19] rounded-lg p-3 text-xs text-slate-200 border border-[#27395C] w-full font-sans">
                  <span className="font-bold text-[var(--accent)] mr-2 font-mono">KAVACH AI Insight:</span>
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
