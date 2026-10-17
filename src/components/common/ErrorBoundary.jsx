import React from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SATYA-GPT Auto-Healing Error Boundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRestore = () => {
    // Clear potentially corrupted transient session state
    try {
      sessionStorage.removeItem('satya_scan_temp');
      sessionStorage.removeItem('active_modal');
    } catch {}

    this.setState({ hasError: false, error: null, errorInfo: null });

    if (this.props.onReset) {
      this.props.onReset();
    } else if (!this.props.inline) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // 1. Localized Inline Error Boundary (Used inside Scanner Tabs / Modals)
      if (this.props.inline) {
        return (
          <div className="p-4 bg-rose-950/20 border border-rose-500/40 rounded-xl space-y-3 font-mono text-center">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-300 uppercase">
                {this.props.title || 'Component Isolated by Security Guard'}
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {this.state.error?.message || 'A hardware or state event was intercepted.'}
              </p>
            </div>
            <button
              onClick={this.handleRestore}
              className="px-4 py-2 bg-[var(--surface-raised)] hover:bg-[var(--surface-overlay)] text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm mx-auto"
            >
              <RefreshCw size={13} />
              <span>Retry Component</span>
            </button>
          </div>
        );
      }

      // 2. Global Root Error Boundary (Self-Healing Full Screen)
      return (
        <div className="min-h-screen bg-[#080E1C] text-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-mono selection:bg-cyan-500 selection:text-slate-950">
          <div className="max-w-md w-full bg-[#0D1527] border-2 border-rose-500/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(244,63,94,0.25)] text-center space-y-4 relative overflow-hidden cyber-bracket">
            <div className="cyber-scan-glow" />

            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-lg">
              <ShieldAlert size={36} />
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-rose-400">
                SATYA-GPT Auto-Healing Shield Activated
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                An unhandled state event was intercepted and isolated. The platform auto-healing guard protected your session and data integrity.
              </p>
            </div>

            {/* Error detail in dev */}
            {this.state.error && (
              <div className="text-left bg-[#060913] p-2.5 rounded-lg border border-[#27395C] text-[10px] text-slate-400 font-mono overflow-x-auto max-h-24">
                <span className="text-rose-400 font-bold block mb-0.5">Intercepted Signature:</span>
                <span className="break-all">{this.state.error?.message || String(this.state.error)}</span>
              </div>
            )}

            <button
              onClick={this.handleRestore}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <RefreshCw size={15} className="animate-spin" />
              <span>Auto-Repair & Restore System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
