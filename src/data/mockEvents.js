// Realistic cybersecurity & SatyaGPT event templates
const PHISHING_URLS = [
  'http://sbi-kyc-update-verify99.tk/login',
  'http://free-robux-fire-coins-generator.xyz/claim',
  'http://secure-banklogin.com/verify?id=83721',
  'https://paypa1-security.net/update-account',
  'http://amaz0n-prime.xyz/order-confirm',
  'https://g00gle-drive.ru/share/doc',
  'http://microsoft-365-login.tk/auth',
  'http://netflix-billing.info/payment',
  'http://adult-content-redirect-scam.tk/watch',
  'https://whatsapp-free-recharge-offer.xyz/claim',
];

const SAFE_URLS = [
  'https://www.google.com/search?q=cyber+safety',
  'https://github.com/microsoft/vscode',
  'https://cybercrime.gov.in',
  'https://developer.mozilla.org/en-US/docs',
  'https://www.wikipedia.org/wiki/Cybersecurity',
  'https://mail.google.com/mail/inbox',
  'https://docs.python.org/3/library',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
];

const QR_PAYLOADS_MALICIOUS = [
  'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.5',
  'http://free-diamonds-fire.xyz/claim-code',
  'tel:+1-900-555-SCAM',
  'sms:+44900123456?body=CONFIRM%20TRANSFER',
  'http://evil-redirect.cc/payload.exe',
];

const QR_PAYLOADS_SAFE = [
  'https://www.example.com/menu',
  'https://maps.google.com/?q=40.7128,-74.0060',
  'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD',
  'WIFI:T:WPA;S:CoffeeShop_Guest;P:welcome2024;;',
];

const THREAT_INDICATORS = [
  'Child Safety Alert: Adult content redirect detected',
  'Fake Gaming Giveaway (Robux/Diamonds Scam)',
  'Domain age < 24 hours',
  'SSL certificate mismatch',
  'Known phishing domain pattern',
  'Suspicious URL encoding detected',
  'IP geolocation mismatch',
  'Malware signature match (EICAR)',
  'Urgency words detected in message (Account Blocked / Pay Now)',
];

const SAFE_INDICATORS = [
  'Child Protection Guard Verified Clean',
  'Valid SSL certificate (EV)',
  'Domain age > 5 years',
  'WHOIS data matches organization',
  'No suspicious redirects',
  'Clean reputation score',
  'DMARC/SPF/DKIM verified',
  'Official Government / Trusted Portal',
];

const VERDICT_REASONS_FAKE = [
  'Child Safety Shield Warning: URL contains malicious redirect to unverified adult/gaming scam domains. Promoted fake giveaway requiring login credentials.',
  'URL structure mimics official bank portal with character substitution. Domain registered 2 hours ago. High risk of credential theft.',
  'Obfuscated payload detected aiming to trigger automated SMS charges. Satya AI classified this as phishing.',
];

const VERDICT_REASONS_REAL = [
  'URL resolves to a verified domain with EV SSL certificate. Child Safety Guard passed with 100% clean safety rating.',
  'QR code encodes standard vCard contact information with no embedded scripts or suspicious URIs.',
  'Official security portal verified clean by Satya AI database.',
];

const SOURCES = ['camera', 'qr', 'link', 'text'];

let eventIdCounter = 1000;

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateEvent() {
  const isThreat = Math.random() > 0.5; // 50% threat rate
  const source = pickRandom(SOURCES);

  let url, indicators, verdictReason;

  if (isThreat) {
    url = source === 'qr' ? pickRandom(QR_PAYLOADS_MALICIOUS) : pickRandom(PHISHING_URLS);
    indicators = [];
    const indicatorCount = randomInt(2, 4);
    const shuffled = [...THREAT_INDICATORS].sort(() => Math.random() - 0.5);
    for (let i = 0; i < indicatorCount; i++) indicators.push(shuffled[i]);
    verdictReason = pickRandom(VERDICT_REASONS_FAKE);
  } else {
    url = source === 'qr' ? pickRandom(QR_PAYLOADS_SAFE) : pickRandom(SAFE_URLS);
    indicators = [];
    const indicatorCount = randomInt(2, 3);
    const shuffled = [...SAFE_INDICATORS].sort(() => Math.random() - 0.5);
    for (let i = 0; i < indicatorCount; i++) indicators.push(shuffled[i]);
    verdictReason = pickRandom(VERDICT_REASONS_REAL);
  }

  const confidence = isThreat
    ? randomFloat(88, 99.9).toFixed(1)
    : randomFloat(92, 99.9).toFixed(1);

  const riskScore = isThreat
    ? randomInt(70, 98)
    : randomInt(2, 20);

  return {
    id: `EVT-${++eventIdCounter}`,
    timestamp: new Date(),
    source,
    payload: url,
    preview: url.length > 50 ? url.substring(0, 50) + '...' : url,
    verdict: isThreat ? 'fake' : 'real',
    verdictLabel: isThreat ? 'FAKE' : 'REAL',
    severity: isThreat ? (riskScore > 85 ? 'critical' : 'high') : 'low',
    confidence: parseFloat(confidence),
    riskScore,
    indicators,
    verdictReason,
    reviewed: false,
  };
}

export function generateInitialEvents(count = 10) {
  const events = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const event = generateEvent();
    event.timestamp = new Date(now - (count - i) * randomInt(8000, 30000));
    events.push(event);
  }
  return events;
}

export function getMetricsSnapshot(events) {
  const threats = events.filter(e => e.verdict === 'fake').length;
  const total = events.length;
  const integrity = total > 0
    ? (((total - threats) / total) * 100).toFixed(1)
    : 99.8;

  return {
    totalScans: total + 1420,
    threatsBlocked: threats + 89,
    childBlocks: 47,
    systemIntegrity: parseFloat(integrity),
    activeFeeds: 12,
  };
}
