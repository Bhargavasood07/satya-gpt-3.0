import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Award, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, Download, Sparkles, ShieldCheck, User, Check, Play } from 'lucide-react';

const RAW_SCAM_QUIZZES = [
  {
    id: 1,
    title: 'Electricity Bill Disconnection SMS Scam',
    titleHi: 'बिजली बिल कटने का फर्जी SMS स्कैम',
    category: 'SMS Phishing',
    categoryHi: 'SMS फिशिंग',
    smsText: 'Dear Customer, your Electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately call Officer Sharma at 9876543210 or pay at http://bses-bill-update.xyz',
    smsTextHi: 'प्रिय ग्राहक, आज रात 9:30 बजे आपकी बिजली काट दी जाएगी क्योंकि पिछले महीने का बिल अपडेट नहीं हुआ है। तुरंत अधिकारी शर्मा को 9876543210 पर कॉल करें या http://bses-bill-update.xyz पर भुगतान करें।',
    options: [
      { 
        text: 'Ignore the link and check official BSES website or app', 
        textHi: 'लिंक को नजरअंदाज करें और आधिकारिक बिजली बोर्ड ऐप या वेबसाइट पर जांचें',
        isCorrect: true, 
        feedback: '✅ Correct! Official utility providers never demand payment via unofficial 10-digit mobile numbers or .xyz domain links.',
        feedbackHi: '✅ बिल्कुल सही! बिजली कंपनियां कभी भी 10 अंकों के व्यक्तिगत मोबाइल नंबर या संदिग्ध लिंक से भुगतान नहीं मांगतीं।'
      },
      { 
        text: 'Pay immediately on the link to prevent power cuts', 
        textHi: 'बिजली कटने से बचने के लिए तुरंत लिंक पर पैसे भरें',
        isCorrect: false, 
        feedback: '❌ Incorrect! Power companies never send raw .xyz links or personal phone numbers via SMS.',
        feedbackHi: '❌ गलत! यह फर्जी लिंक आपके खाते से पैसे चुराने के लिए बनाया गया है।'
      },
      { 
        text: 'Call Officer Sharma to verify details over phone', 
        textHi: 'अधिकारी शर्मा को फोन करके बात करें',
        isCorrect: false, 
        feedback: '❌ Incorrect! Scammers setup fake numbers to pressure victims over phone calls.',
        feedbackHi: '❌ गलत! जालसाज फोन पर दबाव बनाकर UPI पिन या OTP मांगते हैं।'
      }
    ]
  },
  {
    id: 2,
    title: 'Fake UPI QR Code "Money Received" Fraud',
    titleHi: 'फर्जी QR कोड से "पैसे मिलने" का झांसा',
    category: 'UPI Fraud',
    categoryHi: 'UPI फ्रॉड',
    smsText: 'A buyer sends you a QR code on WhatsApp claiming: "Scan this QR code and enter your UPI PIN to receive ₹10,000 for your old sofa listing."',
    smsTextHi: 'OLX या फेसबुक पर सामान खरीदने वाला कहता है: "मैंने आपको ₹10,000 भेज दिए हैं। पैसे अपने खाते में पाने के लिए इस QR कोड को स्कैन करके अपना UPI PIN दर्ज करें।"',
    options: [
      { 
        text: 'Scan the QR code and enter UPI PIN to claim money', 
        textHi: 'पैसे पाने के लिए QR कोड स्कैन करके UPI PIN दर्ज करें',
        isCorrect: false, 
        feedback: '❌ Critical Error! You NEVER enter your UPI PIN to RECEIVE money. Entering PIN always DEBITS money from your account!',
        feedbackHi: '❌ सबसे बड़ी गलती! पैसे प्राप्त करने के लिए कभी भी UPI PIN दर्ज नहीं किया जाता। पिन डालने से हमेशा आपके खाते से पैसे कटते हैं!'
      },
      { 
        text: 'Share your bank account password instead', 
        textHi: 'बैंक खाते का पासवर्ड भेजें',
        isCorrect: false, 
        feedback: '❌ Dangerous! Never share passwords or PINs with anyone.',
        feedbackHi: '❌ खतरनाक! अपना पासवर्ड किसी को न दें।'
      },
      { 
        text: 'Refuse to enter UPI PIN and report buyer as scammer', 
        textHi: 'UPI PIN डालने से मना करें और उसे फ्रॉड रिपोर्ट करें',
        isCorrect: true, 
        feedback: '✅ Spot On! UPI PIN is ONLY required when SENDING money, never when receiving!',
        feedbackHi: '✅ बिल्कुल सही! पैसे प्राप्त करने के लिए UPI पिन की कभी आवश्यकता नहीं होती!'
      }
    ]
  },
  {
    id: 3,
    title: 'AI Voice Impersonation "Relative in Distress" Call',
    titleHi: 'AI आवाज क्लोनिंग "मुसीबत में रिश्तेदार" कॉल',
    category: 'AI Deepfake',
    categoryHi: 'AI डीपफेक',
    smsText: 'You receive a phone call that sounds EXACTLY like your son crying: "Papa, police arrested me in a false case, pay ₹25,000 to advocate bail account right now!"',
    smsTextHi: 'फोन पर ठीक आपके बेटे जैसी रोने की आवाज आती है: "पापा, पुलिस ने मुझे पकड़ लिया है, तुरंत वकील के खाते में ₹25,000 जमानत के लिए ट्रांसफर कर दो!"',
    options: [
      { 
        text: 'Immediately transfer ₹25,000 in panic', 
        textHi: 'घबराकर तुरंत ₹25,000 भेज दें',
        isCorrect: false, 
        feedback: '❌ Incorrect! AI Voice Cloning can replicate anyone’s voice using just a 3-second audio sample from social media.',
        feedbackHi: '❌ गलत! AI तकनीक से किसी की भी आवाज की नकल 3 सेकंड के ऑडियो से बनाई जा सकती है।'
      },
      { 
        text: 'Hang up and call your son directly on his personal mobile number', 
        textHi: 'फोन काटें और अपने बेटे के असली नंबर पर सीधे फोन मिलाएं',
        isCorrect: true, 
        feedback: '✅ Brilliant! Always verify distress calls by calling the relative on their known phone number or contacting family.',
        feedbackHi: '✅ उत्कृष्ट! ऐसे फोन आने पर हमेशा परिवार या उस व्यक्ति के निजी नंबर पर सीधे बात करके सच जानें।'
      },
      { 
        text: 'Ask the advocate to send his Aadhar card copy on WhatsApp', 
        textHi: 'वकील से व्हाट्सएप पर आधार कार्ड मंगाएं',
        isCorrect: false, 
        feedback: '❌ Scammers use stolen or fabricated Aadhar cards to build trust.',
        feedbackHi: '❌ फ्रॉड करने वाले फर्जी आधार कार्ड भेजकर भरोसा जीतते हैं।'
      }
    ]
  },
  {
    id: 4,
    title: 'Traffic Speed e-Challan APK Download Scam',
    titleHi: 'ट्रैफिक चालान के नाम पर फर्जी APK ऐप',
    category: 'Android Malware',
    categoryHi: 'Android वायरस',
    smsText: 'E-Challan Alert: Your vehicle MH-02-AB-1234 has a pending speed violation fine of ₹1,000. Download the official Traffic Police app to view photo proof: http://echallan-parivahan.apk',
    smsTextHi: 'ई-चालान अलर्ट: आपके वाहन का ₹1,000 का ओवर-स्पीडिंग चालान लंबित है। फोटो सबूत देखने के लिए ट्रैफिक पुलिस ऐप डाउनलोड करें: http://echallan-parivahan.apk',
    options: [
      { 
        text: 'Check pending challans on official echallan.parivahan.gov.in portal', 
        textHi: 'सरकारी echallan.parivahan.gov.in वेबसाइट पर चालान जांचें',
        isCorrect: true, 
        feedback: '✅ Correct! Never install .apk files sent via SMS. Always use official government .gov.in portals.',
        feedbackHi: '✅ सही! SMS में आई .apk फाइल कभी इंस्टॉल न करें। हमेशा सरकारी .gov.in पोर्टल देखें।'
      },
      { 
        text: 'Download and install the .apk file on your phone', 
        textHi: 'लिंक से .apk फाइल डाउनलोड करके फोन में इंस्टॉल करें',
        isCorrect: false, 
        feedback: '❌ Malicious Malware! Installing untrusted .apk files installs trojans that steal banking OTPs and read SMS messages.',
        feedbackHi: '❌ खतरनाक मैलवेयर! यह ऐप आपके फोन के बैंक SMS और OTP चुरा लेता है।'
      },
      { 
        text: 'Forward the message to your friends', 
        textHi: 'यह मैसेज अपने दोस्तों को भेजें',
        isCorrect: false, 
        feedback: '❌ Forwarding malware link puts your friends at risk.',
        feedbackHi: '❌ इससे आपके दोस्त भी खतरे में आ जाएंगे।'
      }
    ]
  },
  {
    id: 5,
    title: 'Part-Time "YouTube Video Like" Work-From-Home Scam',
    titleHi: 'यूट्यूब वीडियो लाइक कर पैसे कमाने का झांसा',
    category: 'Work-From-Home Fraud',
    categoryHi: 'घर बैठे कमाई फ्रॉड',
    smsText: 'Earn ₹5,000 daily by simply liking YouTube videos! No experience needed. Join Telegram group @EarnEasyTask to get paid ₹150 per like immediately.',
    smsTextHi: 'यूट्यूब वीडियो लाइक करके रोजाना ₹5,000 कमाएं! किसी अनुभव की आवश्यकता नहीं। तुरंत ₹150 प्रति लाइक पाने के लिए टेलीग्राम ग्रुप @EarnEasyTask से जुड़ें।',
    options: [
      { 
        text: 'Join Telegram group and pay initial registration fee', 
        textHi: 'टेलीग्राम ग्रुप से जुड़ें और शुरुआत में रजिस्ट्रेशन फीस भरें',
        isCorrect: false, 
        feedback: '❌ Task Scam Trap! Scammers pay ₹200 initially to build trust, then trap victims into investing lakhs in fake crypto tasks.',
        feedbackHi: '❌ टास्क स्कैम! शुरुआत में ₹200 देकर भरोसा जीतते हैं, फिर लाखों रुपये की ठगी करते हैं।'
      },
      { 
        text: 'Quit your current job for this easy money', 
        textHi: 'नौकरी छोड़कर यही काम शुरू करें',
        isCorrect: false, 
        feedback: '❌ Highly dangerous! These are organized international fraud rings.',
        feedbackHi: '❌ यह संगठित साइबर गिरोह का जाल है।'
      },
      { 
        text: 'Block the sender and report as Work-From-Home fraud', 
        textHi: 'सेंडर को तुरंत ब्लॉक करें और साइबर क्राइम पोर्टल पर रिपोर्ट करें',
        isCorrect: true, 
        feedback: '✅ Correct! Real companies do not offer thousands per day for liking videos or require Telegram task groups.',
        feedbackHi: '✅ बिल्कुल सही! कोई भी असली कंपनी वीडियो लाइक करने के हजारों रुपये नहीं देती।'
      }
    ]
  },
  {
    id: 6,
    title: 'Fake Google Search Bank Customer Care Helpline',
    titleHi: 'गूगल सर्च पर फर्जी बैंक कस्टमर केयर नंबर',
    category: 'SEO Vishing Fraud',
    categoryHi: 'सर्च इंजन फ्रॉड',
    smsText: 'Your bank app transfer failed. You search Google for "HDFC customer care number" and call the top mobile number result: 9811223344. The representative asks for your Card CVV & OTP to reverse transaction.',
    smsTextHi: 'बैंक से पैसे कट गए। आपने गूगल पर "बैंक कस्टमर केयर नंबर" खोजकर फोन किया। व्यक्ति ने कहा: "पैसे वापस करने के लिए अपने ATM कार्ड का 16 अंक, CVV और आया हुआ OTP बताएं।"',
    options: [
      { 
        text: 'Give CVV and OTP since he claims to be bank customer care', 
        textHi: 'उसे तुरंत CVV और OTP बता दें',
        isCorrect: false, 
        feedback: '❌ Fraud Alert! Scammers post fake mobile numbers on Google search results. Bank employees NEVER ask for OTP or CVV.',
        feedbackHi: '❌ फ्रॉड अलर्ट! बैंक अधिकारी कभी भी फोन पर OTP या CVV नहीं मांगते।'
      },
      { 
        text: 'Hang up immediately and use the official number printed on back of bank card', 
        textHi: 'फोन काटें और अपने ATM कार्ड के पीछे छपे आधिकारिक टोल-फ्री नंबर पर कॉल करें',
        isCorrect: true, 
        feedback: '✅ Spot On! Always use the customer care number printed on the back of your physical debit/credit card.',
        feedbackHi: '✅ बिल्कुल सही! हमेशा अपने भौतिक डेबिट कार्ड के पीछे छपे नंबर पर ही संपर्क करें।'
      },
      { 
        text: 'Share your netbanking password instead', 
        textHi: 'इंटरनेट बैंकिंग का पासवर्ड साझा करें',
        isCorrect: false, 
        feedback: '❌ Never share netbanking credentials under any circumstance.',
        feedbackHi: '❌ पासवर्ड कभी किसी को न बताएं।'
      }
    ]
  },
  {
    id: 7,
    title: 'Credit Card Reward Points Expiry Link',
    titleHi: 'क्रेडिट कार्ड रिवॉर्ड पॉइंट एक्सपायरी लिंक',
    category: 'Banking Smishing',
    categoryHi: 'बैंकिंग फिशिंग',
    smsText: 'Dear HDFC Cardholder, your 9,850 Reward Points worth ₹4,925 will expire TODAY. Click to redeem cash directly into your bank account: http://hdfc-rewards-redeem.com',
    smsTextHi: 'प्रिय कार्डधारक, आपके ₹4,925 के रिवॉर्ड पॉइंट आज समाप्त हो रहे हैं। इन्हें सीधे अपने बैंक खाते में नकद पाने के लिए यहां क्लिक करें: http://hdfc-rewards-redeem.com',
    options: [
      { 
        text: 'Redeem points only via official bank netbanking / mobile app', 
        textHi: 'केवल बैंक के आधिकारिक मोबाइल ऐप में जाकर पॉइंट रिडीम करें',
        isCorrect: true, 
        feedback: '✅ Correct! Legitimate reward points are redeemed safely inside official mobile banking apps.',
        feedbackHi: '✅ सही! रिवॉर्ड पॉइंट सुरक्षित तरीके से केवल बैंक के आधिकारिक ऐप में रिडीम होते हैं।'
      },
      { 
        text: 'Click link and enter debit card credentials to claim cash', 
        textHi: 'लिंक खोलकर कार्ड नंबर और CVV भरें',
        isCorrect: false, 
        feedback: '❌ Phishing Link! Banks do not send reward point redemption links requesting card numbers & CVV.',
        feedbackHi: '❌ यह फर्जी लिंक आपके कार्ड से पैसे उड़ाने के लिए बनाया गया है।'
      },
      { 
        text: 'Send card details via SMS to claim bonus', 
        textHi: 'SMS पर कार्ड की जानकारी भेजें',
        isCorrect: false, 
        feedback: '❌ Dangerous! Never send card details over SMS.',
        feedbackHi: '❌ कार्ड की जानकारी कभी SMS पर न दें।'
      }
    ]
  },
  {
    id: 8,
    title: 'SIM Card KYC Suspension Threat',
    titleHi: 'SIM कार्ड बंद होने की फर्जी चेतावनी',
    category: 'Telecom Fraud',
    categoryHi: 'टेलीकॉम फ्रॉड',
    smsText: 'Jio Notice: Your SIM card KYC has been SUSPENDED by Telecom Authority. Your outgoing calls will be blocked in 2 hours. Call SIM Executive at 7788990011 to update KYC via AnyDesk app.',
    smsTextHi: 'दूरसंचार विभाग नोटिस: आपका सिम कार्ड KYC अधूरा है। 2 घंटे में आउटगोइंग कॉल बंद हो जाएंगी। AnyDesk ऐप से तुरंत KYC करने के लिए 7788990011 पर कॉल करें।',
    options: [
      { 
        text: 'Call executive and download AnyDesk app as instructed', 
        textHi: 'कॉल करें और बताए अनुसार AnyDesk ऐप डाउनलोड करें',
        isCorrect: false, 
        feedback: '❌ Remote Access Fraud! Downloading AnyDesk allows scammers to view your phone screen and steal banking OTPs.',
        feedbackHi: '❌ स्क्रीन शेयरिंग फ्रॉड! AnyDesk से जालसाज आपके फोन की स्क्रीन देख सकते हैं और बैंक OTP चुरा सकते हैं।'
      },
      { 
        text: 'Transfer ₹100 fee to executive via UPI', 
        textHi: 'एग्जीक्यूटिव को UPI से ₹100 ट्रांसफर करें',
        isCorrect: false, 
        feedback: '❌ Never pay unauthorized individuals over personal UPI.',
        feedbackHi: '❌ अनजान व्यक्ति को कभी पैसे न भेजें।'
      },
      { 
        text: 'Ignore SMS and visit official SIM retailer store or official app', 
        textHi: 'SMS नजरअंदाज करें और सिम कंपनी के आधिकारिक स्टोर या ऐप में जाएं',
        isCorrect: true, 
        feedback: '✅ Perfect! Telecom providers never ask users to download screen-sharing apps like AnyDesk or TeamViewer.',
        feedbackHi: '✅ बिल्कुल सही! टेलीकॉम कंपनियां कभी स्क्रीन शेयरिंग ऐप डाउनलोड करने को नहीं कहतीं।'
      }
    ]
  },
  {
    id: 9,
    title: 'Fake Courier Customs Tax / Address Update SMS',
    titleHi: 'डाक विभाग पार्सल पता अपडेट SMS',
    category: 'Delivery Scam',
    categoryHi: 'डिलीवरी फ्रॉड',
    smsText: 'India Post Alert: Your parcel could not be delivered due to incorrect house address. Update address & pay ₹25 redelivery fee within 24h at http://indiapost-update.top',
    smsTextHi: 'इंडिया पोस्ट अलर्ट: पता गलत होने के कारण आपका पार्सल डिलीवर नहीं हो सका। पता अपडेट करने और ₹25 पुनः शुल्क देने के लिए 24 घंटे में खोलें: http://indiapost-update.top',
    options: [
      { 
        text: 'Track parcel directly on official indiapost.gov.in using tracking number', 
        textHi: 'पार्सल का ट्रैकिंग नंबर सीधे indiapost.gov.in पर चेक करें',
        isCorrect: true, 
        feedback: '✅ Excellent! Always verify courier tracking numbers on official .gov.in or official courier portals.',
        feedbackHi: '✅ अति उत्तम! हमेशा आधिकारिक .gov.in पोर्टल पर ही पार्सल ट्रैक करें।'
      },
      { 
        text: 'Click link and pay ₹25 using credit card', 
        textHi: 'लिंक पर जाकर कार्ड से ₹25 का भुगतान करें',
        isCorrect: false, 
        feedback: '❌ Card Stealer Scam! Paying ₹25 on fake sites captures your credit card number, CVV, and OTP for unauthorized international charges.',
        feedbackHi: '❌ ₹25 के बहाने यह साइट आपके कार्ड का डेटा चुराकर लाखों का फ्रॉड कर सकती है।'
      },
      { 
        text: 'Reply to SMS with home address and card details', 
        textHi: 'SMS में घर का पता और कार्ड नंबर रिप्लाई करें',
        isCorrect: false, 
        feedback: '❌ Never share sensitive info over SMS.',
        feedbackHi: '❌ निजी जानकारी कभी SMS पर न भेजें।'
      }
    ]
  },
  {
    id: 10,
    title: 'Guaranteed Stock Market / Crypto Trading WhatsApp Group',
    titleHi: 'व्हाट्सएप ग्रुप में 300% मुनाफे का झांसा',
    category: 'Investment Fraud',
    categoryHi: 'इन्वेस्टमेंट फ्रॉड',
    smsText: 'You are added to a WhatsApp group "VIP Institutional Stock Tips". The admin guarantees 300% profit per week using an exclusive VIP Trading App.',
    smsTextHi: 'आपको किसी ने "VIP स्टॉक टिप्स" व्हाट्सएप ग्रुप में जोड़ा। एडमिन दावा करता है कि उनके विशेष VIP ट्रेडिंग ऐप से हर हफ्ते 300% गारंटीड मुनाफा होगा।',
    options: [
      { 
        text: 'Deposit ₹50,000 into VIP trading app for 300% returns', 
        textHi: '300% मुनाफे के लिए VIP ऐप में ₹50,000 जमा करें',
        isCorrect: false, 
        feedback: '❌ Pig Butchering Investment Fraud! Fake trading apps show dummy high profits on screen but block all withdrawals.',
        feedbackHi: '❌ ट्रेडिंग फ्रॉड! फर्जी ऐप में स्क्रीन पर मुनाफा दिखता है लेकिन पैसे कभी वापस नहीं निकलते।'
      },
      { 
        text: 'Take a personal loan to invest bigger amount', 
        textHi: 'बड़ा निवेश करने के लिए बैंक से लोन लें',
        isCorrect: false, 
        feedback: '❌ Never borrow money to invest in unverified online trading groups.',
        feedbackHi: '❌ अनजान ग्रुप के चक्कर में कभी कर्ज न लें।'
      },
      { 
        text: 'Exit group, report as scam, and invest only via SEBI-registered brokers', 
        textHi: 'ग्रुप से तुरंत बाहर निकलें और केवल SEBI-पंजीकृत ब्रोकर के जरिए ही निवेश करें',
        isCorrect: true, 
        feedback: '✅ Spot On! Guaranteed high returns do not exist. Always trade via official SEBI-registered stockbrokers.',
        feedbackHi: '✅ बिल्कुल सही! किसी भी शेयर बाजार निवेश में गारंटीड मुनाफा नहीं होता। केवल SEBI पंजीकृत माध्यम चुनें।'
      }
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
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

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
              box-shadow: 0 0 50px rgba(217, 119, 6, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.8);
              position: relative;
              text-align: center;
              box-sizing: border-box;
            }

            .cert-header {
              font-family: 'Cinzel', serif;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 4px;
              color: #fbbf24;
              text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
              margin-bottom: 6px;
            }

            .cert-sub {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 2.5px;
              color: #94a3b8;
              margin-bottom: 25px;
            }

            .present-text {
              font-size: 14px;
              font-style: italic;
              color: #cbd5e1;
              margin-bottom: 12px;
            }

            .candidate-name {
              font-family: 'Cinzel', serif;
              font-size: 36px;
              font-weight: 700;
              color: #00E5FF;
              border-bottom: 2px solid #00E5FF;
              display: inline-block;
              padding: 0 30px 6px 30px;
              margin-bottom: 20px;
              letter-spacing: 1.5px;
              text-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
            }

            .cert-text {
              font-size: 13px;
              line-height: 1.8;
              color: #cbd5e1;
              max-width: 740px;
              margin: 0 auto 25px auto;
            }

            .badge-box {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(16, 185, 129, 0.15);
              border: 1.5px solid #10b981;
              color: #34d399;
              padding: 6px 20px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 1px;
              margin-bottom: 30px;
            }

            .footer-signatures {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding: 0 30px;
              margin-top: 10px;
            }

            .cert-meta {
              text-align: left;
              font-size: 11px;
              color: #64748b;
              line-height: 1.6;
              font-family: monospace;
            }

            .sig-block {
              text-align: center;
              min-width: 200px;
            }

            .sig-line {
              width: 180px;
              height: 1.5px;
              background-color: #475569;
              margin: 6px auto;
            }

            .sig-name {
              font-size: 13px;
              font-weight: 800;
              color: #f8fafc;
              letter-spacing: 1px;
            }

            .sig-title {
              font-size: 10px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="cert-inner">
              <div class="cert-header">CERTIFICATE OF RECOGNITION</div>
              <div class="cert-sub">SATYA-GPT NATIONAL CYBER DEFENSE INITIATIVE</div>

              <div class="present-text">This official certificate is proudly awarded to</div>
              <div class="candidate-name">${candidateName}</div>

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
                    <text x="46" y="35" font-family="'Great Vibes', 'Brush Script MT', cursive" font-size="32" font-weight="bold" fill="#00E5FF" letter-spacing="1">Bhargava Sood</text>
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
              {isHindi ? 'कवच साइबर सुरक्षा अकादमी — 60 सेकंड फ्रॉड सिमुलेशन' : 'Kavach Cyber Shield Academy — 60s Scam Simulation'}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              {isHindi ? '10 आम फ्रॉड मामलों का अभ्यास करें और आधिकारिक साइबर सुरक्षा प्रमाणपत्र प्राप्त करें' : 'Master 10 real-world scam scenarios & earn official Cyber Safety Certificates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs font-bold text-purple-400">
          <Award size={16} />
          <span>{isHindi ? `स्कोर: ${score} / ${activeQuizzes.length}` : `SCORE: ${score} / ${activeQuizzes.length}`}</span>
        </div>
      </div>

      {/* Main Quiz View */}
      {!isCompleted ? (
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-5 space-y-4 shadow-2xl">
          {/* Progress Tracker Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-400">
                {isHindi ? `परिदृश्य ${currentQuizIndex + 1} / ${activeQuizzes.length}` : `SCENARIO ${currentQuizIndex + 1} OF ${activeQuizzes.length}`}
              </span>
              <span className="text-[var(--text-muted)]">
                {isHindi ? `${progressPercent}% पूरा हुआ` : `${progressPercent}% COMPLETED`}
              </span>
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
              <h3 className="text-sm font-bold text-slate-100">
                {isHindi ? (currentQuiz.titleHi || currentQuiz.title) : currentQuiz.title}
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                {isHindi ? (currentQuiz.categoryHi || currentQuiz.category) : currentQuiz.category}
              </span>
            </div>
            <div className="p-3.5 bg-[#0B0F19] border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed font-mono">
              <span className="font-bold text-amber-400 block mb-1">
                {isHindi ? '📩 संदिग्ध संदेश / स्थिति:' : '📩 Suspicious Message / Situation:'}
              </span>
              "{isHindi ? (currentQuiz.smsTextHi || currentQuiz.smsText) : currentQuiz.smsText}"
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-[11px] text-[var(--text-muted)] font-bold uppercase">
              {isHindi ? 'सही कदम क्या होना चाहिए?' : 'What is the correct action?'}
            </label>
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
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#131B2E] border border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{isHindi ? (option.textHi || option.text) : option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation */}
          {selectedOption !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs font-mono space-y-2">
              <div className="font-bold text-slate-200">
                {isHindi ? (currentQuiz.options[selectedOption].feedbackHi || currentQuiz.options[selectedOption].feedback) : currentQuiz.options[selectedOption].feedback}
              </div>
              <button
                onClick={handleNext}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-2 cursor-pointer"
              >
                <span>
                  {isHindi 
                    ? (currentQuizIndex < activeQuizzes.length - 1 ? 'अगला परिदृश्य देखें' : 'मास्टरक्लास पूरा करें') 
                    : (currentQuizIndex < activeQuizzes.length - 1 ? 'Next Scenario' : 'Complete Masterclass')}
                </span>
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
            <h3 className="text-lg font-bold text-slate-100">
              {isHindi ? 'बधाई हो! आपने परीक्षा सफलतापूर्वक उत्तीर्ण की!' : 'Congratulations! You Passed!'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {isHindi ? `स्कोर: ${score} / ${activeQuizzes.length} — सत्यापित साइबर सुरक्षा चैंपियन` : `Score: ${score} / ${activeQuizzes.length} — Verified Cyber Defense Champion`}
            </p>
          </div>

          {/* Candidate Name Input */}
          <div className="max-w-md mx-auto space-y-1 text-left">
            <label className="block text-[10px] text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
              <User size={13} className="text-[var(--accent)]" />
              <span>{isHindi ? 'सर्टिफिकेट पर नाम:' : 'Full Name for Certificate:'}</span>
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
              className="px-5 py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <Download size={16} />
              <span>{isHindi ? 'हस्ताक्षरित आधिकारिक सर्टिफिकेट डाउनलोड करें (PDF)' : 'Download Signed Official Certificate (PDF)'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="px-5 py-3 bg-[#0B0F19] border border-[#27395C] hover:border-slate-400 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>{isHindi ? 'मास्टरक्लास पुनः शुरू करें' : 'Restart Masterclass'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

KavachAcademyView.displayName = 'KavachAcademyView';
export default KavachAcademyView;
