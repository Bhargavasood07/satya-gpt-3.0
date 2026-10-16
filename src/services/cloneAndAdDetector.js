/**
 * Advanced Website Clone, 18+ Minor Safety Ad Blocker & Phishing Malvertising Detector
 * SATYA-GPT v6.2 — Next-Gen Cyber Crime Defense Grid
 */

// ── 1. REGISTRY OF LEGITIMATE OFFICIAL BRANDS & DOMAINS ──────────────────────
export const KNOWN_BRANDS = [
  // Banking & Financial Institutions
  {
    name: 'State Bank of India (SBI)',
    brandKey: 'sbi',
    officialDomains: ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com'],
    keywords: ['sbi', 'onlinesbi', 'state bank of india', 'sbi-bank', 'statebank'],
    category: 'Banking / Financial',
  },
  {
    name: 'HDFC Bank',
    brandKey: 'hdfc',
    officialDomains: ['hdfcbank.com', 'hdfc.com'],
    keywords: ['hdfc', 'hdfcbank', 'hdfc-kyc', 'hdfcnetbanking'],
    category: 'Banking / Financial',
  },
  {
    name: 'ICICI Bank',
    brandKey: 'icici',
    officialDomains: ['icicibank.com', 'icicidirect.com'],
    keywords: ['icici', 'icicibank', 'icici-kyc'],
    category: 'Banking / Financial',
  },
  {
    name: 'Axis Bank',
    brandKey: 'axis',
    officialDomains: ['axisbank.com'],
    keywords: ['axisbank', 'axis-kyc', 'axis-bank'],
    category: 'Banking / Financial',
  },
  {
    name: 'Punjab National Bank (PNB)',
    brandKey: 'pnb',
    officialDomains: ['pnbindia.in', 'netpnb.com'],
    keywords: ['pnb', 'pnbindia', 'punjab national bank'],
    category: 'Banking / Financial',
  },
  {
    name: 'Paytm Payments Bank',
    brandKey: 'paytm',
    officialDomains: ['paytm.com', 'paytmbank.com'],
    keywords: ['paytm', 'paytm-kyc', 'paytm-wallet', 'paytmpayments'],
    category: 'Digital Payments / UPI',
  },
  {
    name: 'PhonePe',
    brandKey: 'phonepe',
    officialDomains: ['phonepe.com'],
    keywords: ['phonepe', 'phone-pe', 'phonepe-cashback'],
    category: 'Digital Payments / UPI',
  },
  {
    name: 'Google Pay',
    brandKey: 'gpay',
    officialDomains: ['pay.google.com', 'google.com'],
    keywords: ['gpay', 'googlepay', 'google-pay-reward'],
    category: 'Digital Payments / UPI',
  },
  {
    name: 'Reserve Bank of India (RBI)',
    brandKey: 'rbi',
    officialDomains: ['rbi.org.in'],
    keywords: ['rbi', 'reserve bank', 'rbi-compensation', 'rbi-lottery'],
    category: 'Financial Regulator',
  },

  // Government & Public Utility Portals
  {
    name: 'Income Tax Department (e-Filing / ITR)',
    brandKey: 'incometax',
    officialDomains: ['incometax.gov.in', 'incometaxindia.gov.in'],
    keywords: ['incometax', 'income-tax', 'itr-refund', 'tax-refund', 'e-filing'],
    category: 'Government Portal',
  },
  {
    name: 'UIDAI (Aadhaar Official Portal)',
    brandKey: 'uidai',
    officialDomains: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
    keywords: ['uidai', 'aadhaar', 'aadhar', 'aadhaar-update', 'link-aadhaar'],
    category: 'Government Portal',
  },
  {
    name: 'National Cyber Crime Reporting Portal',
    brandKey: 'cybercrime',
    officialDomains: ['cybercrime.gov.in'],
    keywords: ['cybercrime', '1930 helpline', 'cyber-complaint'],
    category: 'Law Enforcement',
  },
  {
    name: 'IRCTC (Indian Railways)',
    brandKey: 'irctc',
    officialDomains: ['irctc.co.in'],
    keywords: ['irctc', 'indianrailways', 'irctc-ticket', 'rail-yatri'],
    category: 'Government Transport',
  },
  {
    name: 'Parivahan Sewa / e-Challan',
    brandKey: 'echallan',
    officialDomains: ['parivahan.gov.in', 'echallan.parivahan.gov.in'],
    keywords: ['echallan', 'e-challan', 'parivahan', 'traffic-challan', 'challan-pay'],
    category: 'Government Utility',
  },

  // E-Commerce & Tech Portals
  {
    name: 'Amazon India',
    brandKey: 'amazon',
    officialDomains: ['amazon.in', 'amazon.com'],
    keywords: ['amazon', 'amazn', 'arnazon', 'amazon-gift', 'amazon-prime-free'],
    category: 'E-Commerce',
  },
  {
    name: 'Flipkart',
    brandKey: 'flipkart',
    officialDomains: ['flipkart.com'],
    keywords: ['flipkart', 'flipkaart', 'flipkart-sale', 'flipkart-spin'],
    category: 'E-Commerce',
  },
  {
    name: 'Netflix',
    brandKey: 'netflix',
    officialDomains: ['netflix.com'],
    keywords: ['netflix', 'netflx', 'netflix-free', 'netflix-login'],
    category: 'Streaming Media',
  },
  {
    name: 'WhatsApp / Meta',
    brandKey: 'whatsapp',
    officialDomains: ['whatsapp.com', 'web.whatsapp.com'],
    keywords: ['whatsapp', 'whstapp', 'whatsapp-gold', 'whatsapp-update'],
    category: 'Communication',
  },
  {
    name: 'Microsoft 365 / Outlook',
    brandKey: 'microsoft',
    officialDomains: ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
    keywords: ['microsoft', 'outlook', 'office365', 'microsoft-security'],
    category: 'Technology / Cloud',
  },
  {
    name: 'Apple iCloud / Apple ID',
    brandKey: 'apple',
    officialDomains: ['apple.com', 'icloud.com'],
    keywords: ['appleid', 'icloud-find', 'apple-support'],
    category: 'Technology',
  },
  {
    name: 'State Electricity Boards (Bijli Board)',
    brandKey: 'electricity',
    officialDomains: ['uppcl.org', 'tcs.com', 'tatapower.com', 'bsesdelhi.com', 'mahadiscom.in'],
    keywords: ['electricity-bill', 'power-cut', 'bijli-bill', 'light-cut', 'uppcl-bill'],
    category: 'Utility Provider',
  },
];

// Suspicious Top-Level Domains (TLDs) frequently abused by clone copycats
const HIGH_RISK_TLDS = [
  '.tk', '.xyz', '.top', '.work', '.click', '.buzz', '.space',
  '.club', '.fit', '.icu', '.cf', '.ga', '.ml', '.gq', '.cc',
  '.rest', '.cam', '.live', '.loan', '.vip', '.monster', '.support',
];

// ── 2. WEBSITE COPY / CLONE / TYPOSQUATTING DETECTOR ────────────────────────
export function detectWebsiteClone(urlOrText) {
  if (!urlOrText || typeof urlOrText !== 'string') {
    return { isClone: false };
  }

  const raw = urlOrText.trim();
  const lower = raw.toLowerCase();

  // Try extracting hostname
  let hostname = '';
  try {
    const urlObj = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    hostname = urlObj.hostname.toLowerCase();
  } catch {
    // If not a formal URL, extract potential domain string
    const match = raw.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/);
    hostname = match ? match[1].toLowerCase() : lower;
  }

  // Remove leading www.
  const cleanHost = hostname.replace(/^www\./, '');

  for (const brand of KNOWN_BRANDS) {
    // Check if hostname is an authorized official domain
    const isOfficial = brand.officialDomains.some(
      (off) => cleanHost === off || cleanHost.endsWith(`.${off}`)
    );

    if (isOfficial) {
      // Verified official domain of the brand!
      return {
        isClone: false,
        isVerifiedOfficial: true,
        brand: brand.name,
        officialDomain: brand.officialDomains[0],
        category: brand.category,
      };
    }

    // Check if unauthorized hostname or URL text contains brand keywords
    const matchesBrand = brand.keywords.some((kw) => lower.includes(kw));

    if (matchesBrand) {
      // Look for clone patterns:
      // A) Subdomain spoofing: e.g. "sbi.co.in.fake-site.com"
      // B) Hyphenated typosquatting: e.g. "sbi-kyc-verify.tk", "amazon-gift-claim.xyz"
      // C) Abnormal TLD: e.g. "sbi.tk", "flipkart.club"
      // D) Path / query spoofing mimicking official login
      const hasAbnormalTld = HIGH_RISK_TLDS.some((tld) => cleanHost.endsWith(tld));
      const hasHyphenScam = cleanHost.includes('-') && (
        cleanHost.includes('kyc') || cleanHost.includes('verify') ||
        cleanHost.includes('login') || cleanHost.includes('update') ||
        cleanHost.includes('support') || cleanHost.includes('portal') ||
        cleanHost.includes('claim') || cleanHost.includes('refund')
      );
      const isSubdomainSpoof = brand.officialDomains.some((off) => cleanHost.includes(off));

      return {
        isClone: true,
        brand: brand.name,
        brandCategory: brand.category,
        officialDomain: brand.officialDomains[0],
        spoofedDomain: cleanHost,
        cloneType: isSubdomainSpoof
          ? 'Subdomain Hijack / Brand Spoofing'
          : hasHyphenScam
          ? 'Hyphenated Phishing Clone (Fake Login)'
          : hasAbnormalTld
          ? 'Abnormal TLD Typosquatting Clone'
          : 'Brand Impersonation Copycat Website',
        riskScore: 99,
        reason: `KAVACH Clone Shield: This is an UNVERIFIED COPYCAT of ${brand.name}. Real official portal is https://${brand.officialDomains[0]}`,
        indicators: [
          `Unauthorized use of ${brand.name} brand identity`,
          `Destination host (${cleanHost}) NOT in official domain registry`,
          isSubdomainSpoof ? 'Subdomain spoofing deceptive layout detected' : 'Typosquatting bait pattern detected',
          'Potential credential harvesting / OTP drain clone',
        ],
      };
    }
  }

  // Generic clone detection for unknown brands using suspicious phishing keywords + high risk TLD
  const hasGenericPhishWord = /bank-login|netbanking-secure|kyc-update-portal|free-recharge-offer|cashback-reward/i.test(lower);
  const hasHighRiskTld = HIGH_RISK_TLDS.some((tld) => cleanHost.endsWith(tld));

  if (hasGenericPhishWord && hasHighRiskTld) {
    return {
      isClone: true,
      brand: 'Generic Financial / Service Portal',
      brandCategory: 'Deceptive Portal',
      officialDomain: 'Unknown / Unverified',
      spoofedDomain: cleanHost,
      cloneType: 'Deceptive Phishing Clone',
      riskScore: 95,
      reason: 'KAVACH Clone Shield: Scanned link mimics an authentic secure portal on an unverified, high-risk domain.',
      indicators: [
        'High-Risk TLD associated with disposable scam sites',
        'Phishing credential-stealing terminology in domain',
      ],
    };
  }

  return { isClone: false };
}

// ── 3. 18+ AGE RESTRICTED & BELOW-18 MINOR PROTECTION AD DETECTOR ────────────
export function detectAgeRestrictedAd(urlOrText, isChildMode = false) {
  if (!urlOrText || typeof urlOrText !== 'string') {
    return { isAgeRestricted: false };
  }

  const raw = urlOrText.trim();
  const lower = raw.toLowerCase();

  // Pattern 1: Illegal Betting, Gambling, Casino, and Online Betting Apps
  const BETTING_PATTERNS = [
    /1xbet|stake\.com|dafabet|parimatch|bet365|lotus365|mahadev.*book|fairplay/i,
    /teen.*patti|aviator.*game|color.*prediction|real.*cash.*rummy|win.*real.*money/i,
    /bet.*on.*cricket|casino.*online|roulette|slot.*machine|satta.*matka|kalyan.*matka/i,
    /instant.*withdrawal.*game|deposit.*₹\d+.*get.*₹\d+|jackpot.*spin.*cash/i,
  ];

  // Pattern 2: Adult, Dating, Webcam & Explicit 18+ Content
  const ADULT_PATTERNS = [
    /\b18\+\b|adult.*content|dating.*hookup|cam.*models|live.*girls|erotic/i,
    /escort.*service|xxx|porn|nude|sex.*chat|mature.*dating|sensual.*video/i,
    /hot.*desi.*girls|video.*call.*dating|private.*cam/i,
  ];

  // Pattern 3: Predatory Ads Specifically Baiting Minors (Below 18)
  const MINOR_PREDATORY_PATTERNS = [
    /free.*robux|robux.*generator|fire.*coins.*free|free.*diamonds.*fire/i,
    /claim.*vbucks|brawl.*stars.*gems|subway.*surfers.*unlimited.*coins/i,
    /free.*bgmi.*uc|pubg.*free.*uc|kids.*earn.*money.*online/i,
  ];

  const isBetting = BETTING_PATTERNS.some((p) => p.test(lower));
  const isAdult = ADULT_PATTERNS.some((p) => p.test(lower));
  const isMinorPredatory = MINOR_PREDATORY_PATTERNS.some((p) => p.test(lower));

  if (isBetting || isAdult || isMinorPredatory) {
    const category = isAdult
      ? '18+ Adult / Explicit Content Ad'
      : isBetting
      ? 'Illegal Betting & Gambling Ad'
      : 'Minor Predatory Gaming Currency Trap';

    const childSafetyViolation = isChildMode || isAdult || isBetting || isMinorPredatory;

    return {
      isAgeRestricted: true,
      category,
      isMinorThreat: true,
      isChildSafetyViolation: childSafetyViolation,
      riskScore: 97,
      targetAudienceAlert: 'STRICTLY PROHIBITED FOR USERS BELOW 18 (MINORS)',
      protectionAction: 'Blocked under Child Online Protection & Anti-Predatory Guidelines',
      reason: `KAVACH Minor Guard: Detected ${category}. Designed to lure youth/children into illegal gambling or adult content.`,
      indicators: [
        '18+ Age Restricted Vector Detected',
        'High Financial Risk / Addictive Gambling or Adult Scheme',
        'Violates Protection of Children from Online Exploitation Standards',
        'Blocked by KAVACH Edge Security Shield',
      ],
    };
  }

  return { isAgeRestricted: false };
}

// ── 4. PHISHING ADS / MALVERTISING REDIRECTION DETECTOR ──────────────────────
export function detectPhishingAdTrap(urlOrText) {
  if (!urlOrText || typeof urlOrText !== 'string') {
    return { isPhishingAd: false };
  }

  const raw = urlOrText.trim();
  const lower = raw.toLowerCase();

  // A) Malvertising redirect trackers & sponsored ad query parameters
  const isAdClickTracker = /adclick|googleadservices|clickserve|doubleclick|sponsored.*ad|ad_id=|gclid=|fbclid=|affiliate_id=|redirect_ad/i.test(lower);

  // B) Fake Customer Care & Search Engine Ad Helplines
  const isFakeCustomerCare = /customer.*care.*number|toll.*free.*helpline|bank.*helpline.*number|refund.*support.*call|call.*now.*to.*activate/i.test(lower);

  // C) Deceptive Urgency Bait Ads
  const isUrgencyBait = /electricity.*disconnect.*tonight|power.*will.*be.*cut|sim.*card.*blocked|pan.*card.*suspended.*immediately|account.*frozen.*today/i.test(lower);

  // D) Fake Winner / Lottery / Spin Wheel Ad Banners
  const isSpinWinner = /spin.*the.*wheel|you.*won.*iphone|congratulations.*winner|claim.*lottery.*prize|kbc.*lottery.*winner|scratch.*card.*win/i.test(lower);

  // E) Fake Virus / Phone Cleaner Ad Traps
  const isFakeCleaner = /infected.*with.*virus|phone.*is.*damaged|battery.*damaged|install.*cleaner.*now|update.*whatsapp.*gold|clean.*ram.*speed/i.test(lower);

  if (isAdClickTracker || isFakeCustomerCare || isUrgencyBait || isSpinWinner || isFakeCleaner) {
    const lureType = isFakeCustomerCare
      ? 'Fake Search Ad Customer Care Trap'
      : isUrgencyBait
      ? 'Deceptive Urgency Panic Bait (Power/SIM Cut)'
      : isSpinWinner
      ? 'Lottery / iPhone Winner Clickbait Ad'
      : isFakeCleaner
      ? 'Fake Antivirus / Phone Cleaner APK Dropper'
      : 'Malvertising Sponsored Ad Redirect Chain';

    return {
      isPhishingAd: true,
      adType: 'Malvertising Phishing Ad Vector',
      lureType,
      riskScore: 94,
      reason: `KAVACH Ad Defense: Malicious sponsored ad detected (${lureType}). Redirects unsuspecting users to a phishing clone website.`,
      indicators: [
        'Sponsored Ad / Malvertising Redirection Mechanism',
        `Deceptive Hook: ${lureType}`,
        'High probability of APK payload download or fake payment gateway',
        'Flags deceptive Google/Social Media Ad exploitation',
      ],
    };
  }

  return { isPhishingAd: false };
}

// ── 5. UNIFIED COMPREHENSIVE SCANNER ─────────────────────────────────────────
export function analyzeCloneAndAdThreat(payload, isChildMode = false) {
  const cloneResult = detectWebsiteClone(payload);
  const ageResult = detectAgeRestrictedAd(payload, isChildMode);
  const adResult = detectPhishingAdTrap(payload);

  const isThreat = cloneResult.isClone || ageResult.isAgeRestricted || adResult.isPhishingAd;

  let primaryThreatType = 'CLEAN';
  let verdictLabel = 'REAL';
  let primaryReason = 'Verified clean across security heuristics.';
  let combinedIndicators = [];
  let maxRiskScore = 0;

  if (cloneResult.isClone) {
    primaryThreatType = 'CLONE_WEBSITE';
    verdictLabel = 'WEBSITE CLONE (COPYCAT)';
    primaryReason = cloneResult.reason;
    combinedIndicators.push(...(cloneResult.indicators || []));
    maxRiskScore = Math.max(maxRiskScore, cloneResult.riskScore);
  }

  if (ageResult.isAgeRestricted) {
    primaryThreatType = '18_PLUS_AD_MINOR_VIOLATION';
    verdictLabel = '18+ AD / CHILD SAFETY BLOCK';
    primaryReason = ageResult.reason;
    combinedIndicators.push(...(ageResult.indicators || []));
    maxRiskScore = Math.max(maxRiskScore, ageResult.riskScore);
  }

  if (adResult.isPhishingAd) {
    if (!cloneResult.isClone && !ageResult.isAgeRestricted) {
      primaryThreatType = 'PHISHING_AD_MALVERTISING';
      verdictLabel = 'PHISHING AD (MALVERTISING)';
      primaryReason = adResult.reason;
    }
    combinedIndicators.push(...(adResult.indicators || []));
    maxRiskScore = Math.max(maxRiskScore, adResult.riskScore);
  }

  return {
    hasThreat: isThreat,
    primaryThreatType,
    verdictLabel,
    riskScore: isThreat ? maxRiskScore : 2,
    reason: primaryReason,
    indicators: combinedIndicators,
    cloneAnalysis: cloneResult,
    ageAnalysis: ageResult,
    adAnalysis: adResult,
  };
}
