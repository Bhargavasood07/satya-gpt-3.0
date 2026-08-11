import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, Download, Sparkles, ShieldCheck, User, Check, Play } from 'lucide-react';

const RAW_SCAM_QUIZZES = [
  {
    id: 1,
    title: 'Electricity Bill Disconnection SMS Scam',
    category: 'SMS Phishing',
    smsText: 'Dear Customer, your Electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately call Officer Sharma at 9876543210 or pay at http://bses-bill-update.xyz',
    options: [
      { text: 'Ignore the link and check official BSES website or app', isCorrect: true, feedback: '✅ Correct! Official utility providers never demand payment via unofficial 10-digit mobile numbers or .xyz domain links.' },
      { text: 'Pay immediately on the link to prevent power cuts', isCorrect: false, feedback: '❌ Incorrect! Power companies never send raw .xyz links or personal phone numbers via SMS.' },
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
      { text: 'Share your bank account password instead', isCorrect: false, feedback: '❌ Dangerous! Never share passwords or PINs with anyone.' },
      { text: 'Refuse to enter UPI PIN and report buyer as scammer', isCorrect: true, feedback: '✅ Spot On! UPI PIN is ONLY required when SENDING money, never when receiving!' }
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
  },
  {
    id: 4,
    title: 'Traffic Speed e-Challan APK Download Scam',
    category: 'Android Malware',
    smsText: 'E-Challan Alert: Your vehicle MH-02-AB-1234 has a pending speed violation fine of ₹1,000. Download the official Traffic Police app to view photo proof: http://echallan-parivahan.apk',
    options: [
      { text: 'Check pending challans on official echallan.parivahan.gov.in portal', isCorrect: true, feedback: '✅ Correct! Never install .apk files sent via SMS. Always use official government .gov.in portals.' },
      { text: 'Download and install the .apk file on your phone', isCorrect: false, feedback: '❌ Malicious Malware! Installing untrusted .apk files installs trojans that steal banking OTPs and read SMS messages.' },
      { text: 'Forward the message to your friends', isCorrect: false, feedback: '❌ Forwarding malware link puts your friends at risk.' }
    ]
  },
  {
    id: 5,
    title: 'Part-Time "YouTube Video Like" Work-From-Home Scam',
    category: 'Work-From-Home Fraud',
    smsText: 'Earn ₹5,000 daily by simply liking YouTube videos! No experience needed. Join Telegram group @EarnEasyTask to get paid ₹150 per like immediately.',
    options: [
      { text: 'Join Telegram group and pay initial registration fee', isCorrect: false, feedback: '❌ Task Scam Trap! Scammers pay ₹200 initially to build trust, then trap victims into investing lakhs in fake crypto tasks.' },
      { text: 'Quit your current job for this easy money', isCorrect: false, feedback: '❌ Highly dangerous! These are organized international fraud rings.' },
      { text: 'Block the sender and report as Work-From-Home fraud', isCorrect: true, feedback: '✅ Correct! Real companies do not offer thousands per day for liking videos or require Telegram task groups.' }
    ]
  },
  {
    id: 6,
    title: 'Fake Google Search Bank Customer Care Helpline',
    category: 'SEO Vishing Fraud',
    smsText: 'Your bank app transfer failed. You search Google for "HDFC customer care number" and call the top mobile number result: 9811223344. The representative asks for your Card CVV & OTP to reverse transaction.',
    options: [
      { text: 'Give CVV and OTP since he claims to be bank customer care', isCorrect: false, feedback: '❌ Fraud Alert! Scammers post fake mobile numbers on Google search results. Bank employees NEVER ask for OTP or CVV.' },
      { text: 'Hang up immediately and use the official number printed on back of bank card', isCorrect: true, feedback: '✅ Spot On! Always use the customer care number printed on the back of your physical debit/credit card.' },
      { text: 'Share your netbanking password instead', isCorrect: false, feedback: '❌ Never share netbanking credentials under any circumstance.' }
    ]
  },
  {
    id: 7,
    title: 'Credit Card Reward Points Expiry Link',
    category: 'Banking Smishing',
    smsText: 'Dear HDFC Cardholder, your 9,850 Reward Points worth ₹4,925 will expire TODAY. Click to redeem cash directly into your bank account: http://hdfc-rewards-redeem.com',
    options: [
      { text: 'Redeem points only via official bank netbanking / mobile app', isCorrect: true, feedback: '✅ Correct! Legitimate reward points are redeemed safely inside official mobile banking apps.' },
      { text: 'Click link and enter debit card credentials to claim cash', isCorrect: false, feedback: '❌ Phishing Link! Banks do not send reward point redemption links requesting card numbers & CVV.' },
      { text: 'Send card details via SMS to claim bonus', isCorrect: false, feedback: '❌ Dangerous! Never send card details over SMS.' }
    ]
  },
  {
    id: 8,
    title: 'SIM Card KYC Suspension Threat',
    category: 'Telecom Fraud',
    smsText: 'Jio Notice: Your SIM card KYC has been SUSPENDED by Telecom Authority. Your outgoing calls will be blocked in 2 hours. Call SIM Executive at 7788990011 to update KYC via AnyDesk app.',
    options: [
      { text: 'Call executive and download AnyDesk app as instructed', isCorrect: false, feedback: '❌ Remote Access Fraud! Downloading AnyDesk allows scammers to view your phone screen and steal banking OTPs.' },
      { text: 'Transfer ₹100 fee to executive via UPI', isCorrect: false, feedback: '❌ Never pay unauthorized individuals over personal UPI.' },
      { text: 'Ignore SMS and visit official SIM retailer store or official app', isCorrect: true, feedback: '✅ Perfect! Telecom providers never ask users to download screen-sharing apps like AnyDesk or TeamViewer.' }
    ]
  },
  {
    id: 9,
    title: 'Fake Courier Customs Tax / Address Update SMS',
    category: 'Delivery Scam',
    smsText: 'India Post Alert: Your parcel could not be delivered due to incorrect house address. Update address & pay ₹25 redelivery fee within 24h at http://indiapost-update.top',
    options: [
      { text: 'Track parcel directly on official indiapost.gov.in using tracking number', isCorrect: true, feedback: '✅ Excellent! Always verify courier tracking numbers on official .gov.in or official courier portals.' },
      { text: 'Click link and pay ₹25 using credit card', isCorrect: false, feedback: '❌ Card Stealer Scam! Paying ₹25 on fake sites captures your credit card number, CVV, and OTP for unauthorized international charges.' },
      { text: 'Reply to SMS with home address and card details', isCorrect: false, feedback: '❌ Never share sensitive info over SMS.' }
    ]
  },
  {
    id: 10,
    title: 'Guaranteed Stock Market / Crypto Trading WhatsApp Group',
    category: 'Investment Fraud',
    smsText: 'You are added to a WhatsApp group "VIP Institutional Stock Tips". The admin guarantees 300% profit per week using an exclusive VIP Trading App.',
    options: [
      { text: 'Deposit ₹50,000 into VIP trading app for 300% returns', isCorrect: false, feedback: '❌ Pig Butchering Investment Fraud! Fake trading apps show dummy high profits on screen but block all withdrawals.' },
      { text: 'Take a personal loan to invest bigger amount', isCorrect: false, feedback: '❌ Never borrow money to invest in unverified online trading groups.' },
      { text: 'Exit group, report as scam, and invest only via SEBI-registered brokers', isCorrect: true, feedback: '✅ Spot On! Guaranteed high returns do not exist. Always trade via official SEBI-registered stockbrokers.' }
    ]
  }
];

// Fisher-Yates Shuffle algorithm for dynamic option randomization
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const KavachAcademyView = memo(() => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [candidateName, setCandidateName] = useState('Bhargava Sood');
  const [answeredState, setAnsweredState] = useState({});
  const [quizAttemptId, setQuizAttemptId] = useState(0);

  // Dynamically shuffle options for all 10 quizzes on attempt change
  const activeQuizzes = useMemo(() => {
    return RAW_SCAM_QUIZZES.map((quiz) => ({
      ...quiz,
      options: shuffleArray(quiz.options),
    }));
  }, [quizAttemptId]);

  const currentQuiz = activeQuizzes[currentQuizIndex];
  const progressPercent = Math.round(((currentQuizIndex + 1) / activeQuizzes.length) * 100);

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    const isCorrect = currentQuiz.options[index].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnsweredState((prev) => ({
      ...prev,
      [currentQuizIndex]: { selectedOption: index, isCorrect }
    }));
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuizIndex < activeQuizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleJumpToScenario = (idx) => {
    setCurrentQuizIndex(idx);
    setSelectedOption(answeredState[idx]?.selectedOption ?? null);
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
    setAnsweredState({});
    setQuizAttemptId((prev) => prev + 1); // Trigger new option shuffle
  };

  const handleDownloadCertificate = () => {
    const certWindow = window.open('', '_blank');
    const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const certId = 'CERT-SATYA-2026-' + Math.floor(100000 + Math.random() * 900000);

    certWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SATYA-GPT Official Cyber Security Certificate - ${candidateName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@400;600;700;800&family=Great+Vibes&display=swap');
            
            @page {
              size: A4 landscape;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 25px;
              background-color: #0b0f19;
              color: #f8fafc;
              font-family: 'Montserrat', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 90vh;
              -webkit-print-color-adjust: exact;
            }

            .cert-card {
              width: 920px;
              padding: 40px;
              background: linear-gradient(135deg, #0b0f19 0%, #131b2e 50%, #0b0f19 100%);
              border: 10px double #d97706;
              border-radius: 16px;
              box-shadow: 0 0 50px rgba(0, 229, 255, 0.25);
              position: relative;
              box-sizing: border-box;
              text-align: center;
            }

            .inner-border {
              border: 2px solid #00e5ff;
              outline: 2px dashed rgba(0, 229, 255, 0.4);
              outline-offset: -12px;
              padding: 30px;
            }

            .cert-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
              margin-bottom: 10px;
            }

            .cert-title {
              font-family: 'Cinzel', serif;
              font-size: 26px;
              color: #00e5ff;
              letter-spacing: 2px;
              margin: 0;
              text-transform: uppercase;
              text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
            }

            .cert-subtitle {
              font-size: 11px;
              color: #f59e0b;
              letter-spacing: 3px;
              text-transform: uppercase;
              font-weight: 700;
              margin-top: 5px;
            }

            .cert-body-label {
              font-size: 13px;
              color: #94a3b8;
              margin-top: 25px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }

            .candidate-name {
              font-size: 34px;
              font-weight: 800;
              color: #fbbf24;
              margin: 15px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
              border-bottom: 2px solid #d97706;
              display: inline-block;
              padding-bottom: 5px;
              text-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
            }

            .cert-text {
              font-size: 13.5px;
              color: #e2e8f0;
              line-height: 1.6;
              max-width: 720px;
              margin: 0 auto;
            }

            .badge-box {
              display: inline-block;
              padding: 8px 22px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid #10b981;
              color: #34d399;
              font-weight: 700;
              font-size: 12px;
              border-radius: 20px;
              margin-top: 20px;
              letter-spacing: 1px;
            }

            .footer-signatures {
              margin-top: 35px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding: 0 25px;
            }

            .sig-block {
              text-align: center;
            }

            .sig-line {
              width: 220px;
              border-top: 1.5px solid #00e5ff;
              margin-top: 4px;
            }

            .sig-name {
              font-size: 12.5px;
              font-weight: 800;
              color: #f8fafc;
              margin-top: 5px;
              letter-spacing: 1px;
            }

            .sig-title {
              font-size: 10px;
              color: #94a3b8;
              margin-top: 2px;
            }

            .cert-meta {
              text-align: left;
              font-size: 11px;
              color: #94a3b8;
              line-height: 1.8;
            }

            .cert-meta strong {
              color: #00e5ff;
            }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="inner-border">
              <div class="cert-header">
                <div>
                  <h1 class="cert-title">SATYA-GPT NATIONAL CYBER SAFETY ACADEMY</h1>
                  <div class="cert-subtitle">Aligned with CERT-In & MeitY National Cyber Safety Framework</div>
                </div>
              </div>

              <div class="cert-body-label">Official Certificate of Merit & Cyber Defense</div>
              <div class="candidate-name">${candidateName || 'Bhargava Sood'}</div>

              <div class="cert-text">
                has successfully completed the <strong>National Scam Awareness & Cyber Threat Prevention Masterclass</strong>, 
                demonstrating exceptional mastery in real-world phishing detection, UPI scam defense, and AI deepfake verification 
                with a final evaluation score of <strong>${score} / ${activeQuizzes.length}</strong>.
              </div>

              <div class="badge-box">VERIFIED CYBER DEFENSE CHAMPION</div>

              <div class="footer-signatures">
                <div class="cert-meta">
                  <div>Date of Issuance: <strong>${todayDate}</strong></div>
                  <div>Certificate Serial ID: <strong>${certId}</strong></div>
                  <div>Verification Status: <strong>VERIFIED GENUINE</strong></div>
                </div>

                <div class="sig-block">
                  <svg width="220" height="65" viewBox="0 0 220 65" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto -4px auto;">
                    <circle cx="26" cy="30" r="20" stroke="#00E5FF" stroke-width="2.5" fill="none" />
                    <path d="M 20 18 L 20 42 M 20 18 C 30 18 34 24 20 30 C 34 30 36 42 20 42" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                    <text x="46" y="35" font-family="'Great Vibes', 'Brush Script MT', cursive" font-size="32" font-weight="bold" fill="#00E5FF" letter-spacing="1">hargava Sood</text>
                    <path d="M 10 38 L 210 24" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
                  </svg>

                  <div class="sig-line"></div>
                  <div class="sig-name">BHARGAVA SOOD</div>
                  <div class="sig-title">Founder & Chief Architect, SATYA-GPT</div>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
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
            <p className="text-[11px] text-[var(--text-muted)] font-mono">Master 10 real-world scam scenarios & earn official Cyber Safety Certificates</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs font-bold text-purple-400">
          <Award size={16} />
          <span>SCORE: {score} / {activeQuizzes.length}</span>
        </div>
      </div>

      {/* Main Quiz View */}
      {!isCompleted ? (
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-5 space-y-4 shadow-2xl">
          {/* Progress Tracker Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-400">SCENARIO {currentQuizIndex + 1} OF {activeQuizzes.length}</span>
              <span className="text-[var(--text-muted)]">{progressPercent}% COMPLETED</span>
            </div>
            <div className="w-full h-2 bg-[#0B0F19] border border-[#27395C] rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Scenario Navigation Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 overflow-x-auto">
              {activeQuizzes.map((quiz, idx) => {
                const state = answeredState[idx];
                let chipBg = 'bg-[#0B0F19] border-[#27395C] text-[var(--text-muted)]';
                if (state) {
                  chipBg = state.isCorrect
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-rose-500/20 border-rose-500 text-rose-400';
                }
                if (idx === currentQuizIndex) {
                  chipBg = 'bg-purple-500/20 border-purple-400 text-purple-300 ring-1 ring-purple-400';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleJumpToScenario(idx)}
                    className={`w-7 h-7 rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all ${chipBg}`}
                    title={`Jump to Scenario ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1E2D4A]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">{currentQuiz.title}</h3>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                {currentQuiz.category}
              </span>
            </div>
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs font-mono space-y-2">
              <div className="font-bold text-slate-200">{currentQuiz.options[selectedOption].feedback}</div>
              <button
                onClick={handleNext}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-2"
              >
                <span>{currentQuizIndex < activeQuizzes.length - 1 ? 'Next Scenario' : 'Complete Masterclass'}</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Completion Certificate View */
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-6 text-center space-y-5 shadow-2xl font-mono">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <Award size={36} />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Congratulations! You Passed!</h3>
            <p className="text-xs text-[var(--text-muted)]">Score: {score} / {activeQuizzes.length} — Verified Cyber Defense Champion</p>
          </div>

          {/* Candidate Name Input */}
          <div className="max-w-md mx-auto space-y-1 text-left">
            <label className="block text-[10px] text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
              <User size={13} className="text-[var(--accent)]" />
              <span>Full Name for Certificate:</span>
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value.slice(0, 50))}
              placeholder="e.g. Bhargava Sood"
              className="w-full bg-[#0B0F19] border border-[#27395C] rounded-xl p-3 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none font-bold"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadCertificate}
              className="px-5 py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Download size={16} />
              <span>Download Signed Official Certificate (PDF)</span>
            </button>

            <button
              onClick={handleRestart}
              className="px-5 py-3 bg-[#0B0F19] border border-[#27395C] hover:border-slate-400 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw size={16} />
              <span>Restart Masterclass</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

KavachAcademyView.displayName = 'KavachAcademyView';
export default KavachAcademyView;
