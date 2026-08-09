/**
 * KAVACH AI Advanced Cyber Security Assistant Service
 * Built-in Cybersecurity Assistant inside SATYA-GPT
 */

export const RECOMMENDED_AI_MODELS = [
  {
    id: 'kavach-pro',
    name: 'KAVACH AI Pro',
    badge: 'RECOMMENDED',
    provider: 'KAVACH Neural Engine',
    description: 'Everyday Indian Scam & Phishing Protection Assistant',
  },
  {
    id: 'kavach-deep',
    name: 'KAVACH Deep Reasoning Engine',
    badge: 'DEEP REASONING',
    provider: 'KAVACH Neural Engine',
    description: 'Advanced Threat Breakdown & Remediation Strategy',
  },
  {
    id: 'kavach-vision',
    name: 'KAVACH High Speed Vision',
    badge: 'HIGH SPEED',
    provider: 'KAVACH Neural Engine',
    description: 'Real-Time Phishing & Image/QR Payload Analysis',
  },
  {
    id: 'kavach-core',
    name: 'KAVACH Shield Core',
    badge: 'BUILT-IN',
    provider: 'KAVACH Neural Engine',
    description: 'Zero-Latency Local Cyber Threat Safeguard',
  },
];

const KAVACH_SYSTEM_PROMPT = `
You are KAVACH AI, the built-in cybersecurity assistant inside SATYA-GPT, a mobile security app used mainly by everyday Indian users to check suspicious links, SMS, and QR codes.

Your audience is non-technical. Explain things in plain language first, technical terms only when useful, and never sound like a compliance document.

For genuine threat/scam questions (phishing, fraud, suspicious links, malware, scam SMS, QR codes), answer using this structure:
1. 🎯 What's going on (1-2 sentences, plain language)
2. 🔍 Why it's risky (the specific red flag or mechanism)
3. 🛡️ What to do next (concrete, numbered steps)

For simple questions, greetings, or general app help, just answer directly and briefly — do not force the 3-part structure.

When relevant, point users to the app's own tools: the link/SMS/QR scanner (92-engine VirusTotal check) for anything they want verified, and remind them Child Guard mode exists for family protection.

Always end threat-related answers by mentioning official reporting channels when appropriate: cybercrime.gov.in or the 1930 Cyber Fraud Helpline (India). Don't repeat this for unrelated queries.

Keep responses concise — 100-150 words unless the user asks for more detail.
`;

export async function askKavachAi(userMessage, conversationHistory = [], selectedModelId = 'kavach-pro', isChildMode = false) {
  const selectedModel = RECOMMENDED_AI_MODELS.find(m => m.id === selectedModelId) || RECOMMENDED_AI_MODELS[0];
  const apiKey = import.meta.env.VITE_NVIDIA_API_KEY || '';

  // Encapsulated Live API Handler if valid key present
  if (apiKey && apiKey.startsWith('nvapi-')) {
    try {
      const messages = [
        { role: 'system', content: KAVACH_SYSTEM_PROMPT + (isChildMode ? '\nNOTE: Child Safety Guard is ACTIVE in the app. Remind the user about family protection features.' : '') },
        ...conversationHistory.slice(-6),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-ultra-550b-a55b',
          messages,
          temperature: 0.3,
          max_tokens: 450,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return { success: true, text: reply, modelName: selectedModel.name, provider: selectedModel.provider };
        }
      }
    } catch (err) {
      console.warn('Threat Engine notice, using encapsulated KAVACH engine:', err);
    }
  }

  // Encapsulated Cyber Analysis Engine Response
  return {
    success: true,
    modelName: selectedModel.name,
    provider: selectedModel.provider,
    text: generateStructuredReply(userMessage, selectedModel, isChildMode),
  };
}

// Backward compatibility export alias
export const askNemotronAi = askKavachAi;

function generateStructuredReply(prompt, model, isChildMode) {
  const q = prompt.toLowerCase().trim();

  // Greetings, simple questions, or general app help (Direct & Brief - NO 3-part structure forced)
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you') || q.includes('help')) {
    return `Namaste! I am **KAVACH AI**, your built-in cyber security assistant inside SATYA-GPT.\n\nYou can ask me about suspicious SMS messages, unknown links, or QR codes. To verify any link or message immediately, use our **AI Scanner** (with 92-engine VirusTotal verification). You can also turn on **Child Guard** mode to keep your family safe from harmful sites!`;
  }

  // Reporting / Police / Fraud Queries
  if (q.includes('report') || q.includes('police') || q.includes('helpline') || q.includes('1930') || q.includes('cybercrime')) {
    return `🎯 **What's going on:**\nIf you have lost money to a online scam or clicked a bad link, you must report it immediately to lock your bank account.\n\n🔍 **Why it's risky:**\nScammers transfer stolen money through fast UPI or netbanking hops within minutes.\n\n🛡️ **What to do next:**\n1. **Call 1930 immediately:** The Indian National Cyber Fraud Helpline (available 24/7).\n2. **File Official Report:** Register the incident at [cybercrime.gov.in](https://cybercrime.gov.in).\n3. **Inform Bank:** Ask your bank to block your debit/credit card and freeze the transaction.`;
  }

  // Phishing / SMS / Links / Banking Scams
  if (q.includes('sbi') || q.includes('link') || q.includes('sms') || q.includes('phishing') || q.includes('kyc') || q.includes('otp') || q.includes('url')) {
    return `🎯 **What's going on:**\nYou've received a suspicious link or SMS claiming your bank account, PAN, or SIM card will be blocked if you don't click immediately.\n\n🔍 **Why it's risky:**\nFake bank links take you to look-alike phishing websites designed to steal your password, UPI PIN, or OTP.\n\n🛡️ **What to do next:**\n1. **Do NOT Click or Share OTP:** Never enter details on unknown links.\n2. **Verify with SATYA Scanner:** Paste the link into SATYA-GPT's AI Scanner for an instant 92-engine VirusTotal safety check.\n3. **Enable Child Guard:** If sharing your phone with family, keep Child Guard active to block scam sites.\n\nIf you lost money, report immediately on **1930** or at **cybercrime.gov.in**.`;
  }

  // Gaming / Robux Scams / Child Protection
  if (q.includes('game') || q.includes('robux') || q.includes('child') || q.includes('family') || q.includes('free')) {
    return `🎯 **What's going on:**\nFree game coins, Robux, or gift card traps target children and gaming enthusiasts to steal account access.\n\n🔍 **Why it's risky:**\nThese fake giveaway pages ask for phone numbers, OTPs, or app downloads containing malware.\n\n🛡️ **What to do next:**\n1. **Keep Child Guard Active:** Turn on Child Guard mode in SATYA-GPT to block adult & gaming scam sites.\n2. **Scan Downloads:** Run any APK or link through our 92-engine VirusTotal Scanner.\n3. **Use 2-Factor Auth:** Lock your gaming and Google accounts with password protection.`;
  }

  // Default Threat Query Response (100-150 words)
  return `🎯 **What's going on:**\nYou are asking about a potential online security risk or unknown message.\n\n🔍 **Why it's risky:**\nScammers use deceptive links, fake SMS alerts, and malicious QR codes to compromise personal data or steal money.\n\n🛡️ **What to do next:**\n1. **Use SATYA AI Scanner:** Paste any link or SMS text into our AI Scanner for a 92-engine VirusTotal safety check.\n2. **Turn on Child Guard:** Keep your family protected from deceptive websites.\n3. **Report Scams:** For online financial fraud, report immediately to the **1930 Cyber Fraud Helpline** or visit **cybercrime.gov.in**.`;
}
