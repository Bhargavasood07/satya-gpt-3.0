import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, Download, Sparkles, ShieldCheck } from 'lucide-react';

const SCAM_QUIZZES = [
  {
    id: 1,
    title: 'Electricity Bill Disconnection SMS Scam',
    category: 'SMS Phishing',
    smsText: 'Dear Customer, your Electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately call Officer Sharma at 9876543210 or pay at http://bses-bill-update.xyz',
    options: [
      { text: 'Pay immediately on the link to prevent power cuts', isCorrect: false, feedback: '❌ Incorrect! Power companies never send raw .xyz links or personal phone numbers via SMS.' },
      { text: 'Ignore the link and check official BSES website or app', isCorrect: true, feedback: '✅ Correct! Official utility providers never demand payment via unofficial 10-digit mobile numbers or .xyz domain links.' },
      { text: 'Call Officer Sharma to verify details over phone', isCorrect: false, feedback: '❌ Incorrect! Scammers setup fake numbers to pressure victims over phone calls.' }
    ]
  },
  {
    id: 2,
    title: 'Fake UPI QR Code "Money Received" Fraud',
    category: 'UPI Fraud',
    smsText: 'A buyer sends you a QR code on WhatsApp claiming: "Scan this QR code and enter your UPI PIN to receive ₹10,000 for your old sofa listing."',
    options: [
      { text: 'Scan the QR code and enter UPI PIN to claim money', isCorrect: false, feedback: '❌ Critical Error! You NEVER enter your UPI PIN to RECEIVE money. Entering PIN always DEBITS money from your account!' },
      { text: 'Refuse to enter UPI PIN and report buyer as scammer', isCorrect: true, feedback: '✅ Spot On! UPI PIN is ONLY required when SENDING money, never when receiving!' },
      { text: 'Share your bank account password instead', isCorrect: false, feedback: '❌ Dangerous! Never share passwords or PINs with anyone.' }
    ]
  },
  {
    id: 3,
    title: 'AI Voice Impersonation "Relative in Distress" Call',
    category: 'AI Deepfake',
    smsText: 'You receive a phone call that sounds EXACTLY like your son crying: "Papa, police arrested me in a false case, pay ₹25,000 to advocate bail account right now!"',
    options: [
      { text: 'Immediately transfer ₹25,000 in panic', isCorrect: false, feedback: '❌ Incorrect! AI Voice Cloning can replicate anyone’s voice using just a 3-second audio sample from social media.' },
      { text: 'Hang up and call your son directly on his personal mobile number', isCorrect: true, feedback: '✅ Brilliant! Always verify distress calls by calling the relative on their known phone number or contacting family.' },
      { text: 'Ask the advocate to send his Aadhar card copy on WhatsApp', isCorrect: false, feedback: '❌ Scammers use stolen or fabricated Aadhar cards to build trust.' }
    ]
  }
];

const KavachAcademyView = memo(() => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuiz = SCAM_QUIZZES[currentQuizIndex];

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return; // Prevent re-select
    setSelectedOption(index);

    if (currentQuiz.options[index].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuizIndex < SCAM_QUIZZES.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
  };

  const handleDownloadCertificate = () => {
    const certWindow = window.open('', '_blank');
    certWindow.document.write(`
      <html>
        <head>
          <title>SATYA-GPT Cyber Safety Certificate</title>
          <style>
            body { font-family: 'Arial', sans-serif; text-align: center; padding: 50px; background: #0b0f19; color: #fff; }
            .cert { border: 8px solid #00e5ff; padding: 40px; border-radius: 20px; background: #131b2e; }
            h1 { color: #00e5ff; font-size: 32px; }
            h2 { color: #f59e0b; font-size: 24px; margin-top: 20px; }
            p { font-size: 16px; color: #94a3b8; }
            .badge { display: inline-block; padding: 10px 20px; background: #10b981; color: #000; font-weight: bold; border-radius: 30px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div className="cert">
            <h1>🏛️ SATYA-GPT NATIONAL CYBER SAFETY ACADEMY</h1>
            <p>This is to certify that</p>
            <h2>VALUED CITIZEN / CYBER GUARD</h2>
            <p>has successfully completed the <strong>National Scam Awareness & Cyber Threat Prevention Masterclass</strong> with a score of ${score}/${SCAM_QUIZZES.length}.</p>
            <div className="badge">VERIFIED CYBER SAFETY CHAMPION</div>
            <p style="margin-top: 30px; font-size: 12px;">Issued on ${new Date().toLocaleDateString()} • CERT-In & MeitY Framework Aligned</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    certWindow.document.close();
  };

  return (
    <div className="space-y-5 font-mono text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131B2E] border border-[#27395C] p-4 rounded-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
              Kavach Cyber Shield Academy — 60s Scam Simulation
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">Master real-world scam spotter quizzes & earn official Cyber Safety Certificates</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs font-bold text-purple-400">
          <Award size={16} />
          <span>SCORE: {score} / {SCAM_QUIZZES.length}</span>
        </div>
      </div>

      {/* Main Quiz View */}
      {!isCompleted ? (
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 text-xs">
            <span className="font-bold text-purple-400">SCENARIO {currentQuizIndex + 1} OF {SCAM_QUIZZES.length}</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
              {currentQuiz.category}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-100">{currentQuiz.title}</h3>
            <div className="p-3.5 bg-[#0B0F19] border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed font-mono">
              <span className="font-bold text-amber-400 block mb-1">📩 Suspicious Message / Situation:</span>
              "{currentQuiz.smsText}"
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-[11px] text-[var(--text-muted)] font-bold uppercase">What is the correct action?</label>
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-[#0B0F19] border-[#27395C] text-slate-200 hover:border-purple-400';

              if (selectedOption !== null) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#131B2E] border border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation */}
          {selectedOption !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs font-mono space-y-2">
              <div className="font-bold text-slate-200">{currentQuiz.options[selectedOption].feedback}</div>
              <button
                onClick={handleNext}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-2"
              >
                <span>{currentQuizIndex < SCAM_QUIZZES.length - 1 ? 'Next Scenario' : 'Complete Masterclass'}</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Completion Certificate View */
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-6 text-center space-y-4 shadow-2xl font-mono">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <Award size={36} />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Congratulations! You Passed!</h3>
            <p className="text-xs text-[var(--text-muted)]">Score: {score} / {SCAM_QUIZZES.length} — Verified Cyber Safety Champion</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadCertificate}
              className="px-5 py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Download size={15} />
              <span>Download Official Certificate (PDF)</span>
            </button>

            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-[#0B0F19] border border-[#27395C] hover:border-slate-400 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw size={15} />
              <span>Restart Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

KavachAcademyView.displayName = 'KavachAcademyView';
export default KavachAcademyView;
