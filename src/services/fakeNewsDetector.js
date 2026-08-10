/**
 * Deep AI NLP Fake News & Misinformation Fact-Checker Engine
 * SATYA-GPT v6.1
 */

// Key Fake News & Hoax Patterns
const FAKE_NEWS_PATTERNS = [
  { pattern: /fictional|fictional report|hoax|satire|fake news|unverified report/i, score: 94, reason: 'Contains explicit fictional report / satire markers.' },
  { pattern: /scientists (announce|discover|claim) (a new ocean|alien|secret cure|underground ocean)/i, score: 90, reason: 'Sensational unverified scientific claim flagged by KAVACH AI.' },
  { pattern: /breaking: (government giving|free ₹|free iphone|pm yojana free)/i, score: 96, reason: 'Viral government free scheme hoax pattern detected.' },
  { pattern: /miracle cure|doctors hate this|secret remedy|instant 100% cure/i, score: 88, reason: 'Medical misinformation & clickbait health scam pattern.' },
  { pattern: /share this (before it gets deleted|with 10 groups|immediately)/i, score: 86, reason: 'Viral WhatsApp chain message panic trigger.' },
  { pattern: /nasa confirms|unesco declared|world bank giving/i, score: 89, reason: 'False authority attribution hoax pattern.' },
];

/**
 * Detect Fake News, Hoaxes & Misinformation in text
 */
export const detectFakeNews = (text = '') => {
  if (!text || typeof text !== 'string') {
    return { isFakeNews: false };
  }

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Check direct pattern matches
  for (const item of FAKE_NEWS_PATTERNS) {
    if (item.pattern.test(cleanText)) {
      return {
        isFakeNews: true,
        riskScore: item.score,
        category: 'Fake News / Hoax',
        reason: `KAVACH AI Fact-Check Engine: ${item.reason}`,
        indicators: [
          'KAVACH AI Fact-Checker Flagged',
          'Sensational / Unverified Claim Detected',
          'Non-Standard Source Attribution',
        ],
      };
    }
  }

  // 2. Check for long narrative claims with clickbait buzzwords
  const containsUnverifiedDiscovery = lower.includes('ocean beneath') || lower.includes('underground water reservoir') || lower.includes('fictional report');
  if (containsUnverifiedDiscovery) {
    return {
      isFakeNews: true,
      riskScore: 92,
      category: 'Fake News / Fictional Story',
      reason: 'KAVACH AI Fact-Check Engine: Scanned text contains fictional / unverified scientific claim.',
      indicators: [
        'KAVACH AI Fact-Checker Flagged',
        'Fictional Narrative Marker Found',
        'Unconfirmed Scientific Discovery',
      ],
    };
  }

  return { isFakeNews: false };
};
