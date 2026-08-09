import React from 'react';
import { ShieldAlert, RefreshCw, Cpu } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SATYA-GPT Auto-Healing Error Boundary caught error:', error, errorInfo);
  }

  handleRestore = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-[#131B2E] border border-rose-500/50 p-6 rounded-2xl shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert size={32} />
            </div>
            
            <h2 className="text-base font-bold uppercase tracking-wider text-rose-400">
              SATYA-GPT Auto-Healing Shield Activated
            </h2>
            
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              An unhandled UI state event was intercepted. SATYA-GPT auto-healing guard isolated the session to protect your data.
            </p>

            <button
              onClick={this.handleRestore}
              className="w-full py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <RefreshCw size={16} className="animate-spin" />
              <span>Auto-Repair & Restore System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
