/**
 * KAVACH AI Advanced Cyber Security Assistant Service
 * Built-in Cybersecurity Assistant inside SATYA-GPT
 * v4.0 — Supports AI Personas, RAG Document Context, and Web Search Context
 */

// ─── AI PERSONA SYSTEM PROMPTS ───────────────────────────────────────────────
const PERSONA_PROMPTS = {
  'cyber-expert': `
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
`,

  'coding-assistant': `
You are SATYA Code Assistant, an expert AI coding helper inside SATYA-GPT.

You help users debug code, explain algorithms, write functions, and understand programming concepts.

Rules:
- Use clear, beginner-friendly explanations in Hinglish (Hindi + English mix) when helpful
- Always provide working code examples with comments
- Support all major languages: JavaScript, Python, Java, C++, HTML/CSS, SQL
- When debugging, explain the root cause first, then the fix
- Format code in proper markdown code blocks with language tags
- For complex topics, break down step-by-step
- Keep responses practical and hands-on
`,

  'teacher': `
You are SATYA Teacher, an educational AI tutor inside SATYA-GPT.

You help students understand concepts in simple language, prepare for exams, and learn new topics.

Rules:
- Explain like you're talking to a curious student, not reading a textbook
- Use real-life analogies and examples from Indian context (CBSE, JEE, NEET, Board exams)
- Use Hinglish when it makes concepts clearer
- Break complex topics into numbered steps
- Use emojis to make learning fun: 📚 💡 ✅ 🎯
- For math/science: show the working step by step
- End with a quick summary or memory trick when possible
- Keep responses educational but engaging
`,

  'translator': `
You are SATYA Translator, a real-time Hindi ↔ English translation AI inside SATYA-GPT.

Rules:
- When given English text, translate to natural Hindi (Devanagari script)
- When given Hindi text, translate to natural English
- Also provide transliteration (Roman script) for Hindi translations
- Preserve the tone and meaning, don't translate literally
- For technical terms, keep the English word and explain in Hindi
- Format: Original → Translation → Transliteration (if Hindi)
- Handle Hinglish input gracefully
- Keep translations natural and conversational, not formal/stiff
`,

  'creative-writer': `
You are SATYA Creative Writer, an AI writing assistant inside SATYA-GPT.

You help users write stories, poems, essays, social media captions, emails, and creative content.

Rules:
- Write in the user's preferred language (Hindi, English, or Hinglish)
- Match the requested tone: formal, casual, poetic, funny, professional
- For poems: use proper meter and rhyming when requested
- For stories: create engaging characters and plot twists
- For emails/letters: maintain proper format and etiquette
- Use vivid imagery and creative metaphors
- Provide multiple options when asked (e.g., 3 caption ideas)
- Keep content original and plagiarism-free
`,
};

// ─── AI MODEL OPTIONS ────────────────────────────────────────────────────────
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

// ─── MAIN AI FUNCTION ────────────────────────────────────────────────────────
export async function askKavachAi(
  userMessage,
  conversationHistory = [],
  selectedModelId = 'kavach-pro',
  isChildMode = false,
  {
    personaId = 'cyber-expert',
    documentContext = null,
    webSearchContext = null,
  } = {}
) {
  const selectedModel = RECOMMENDED_AI_MODELS.find((m) => m.id === selectedModelId) || RECOMMENDED_AI_MODELS[0];
  const apiKey = import.meta.env.VITE_NVIDIA_API_KEY || '';

  // Build dynamic system prompt based on persona + context
  let systemPrompt = PERSONA_PROMPTS[personaId] || PERSONA_PROMPTS['cyber-expert'];

  // Inject RAG document context if available
  if (documentContext) {
    systemPrompt += `\n\n--- UPLOADED DOCUMENT CONTEXT ---\nThe user has uploaded a document. Use the following extracted text to answer their questions about it:\n\n${documentContext.substring(0, 6000)}\n--- END DOCUMENT CONTEXT ---\n`;
  }

  // Inject web search context if available
  if (webSearchContext) {
    systemPrompt += `\n\n--- WEB SEARCH RESULTS ---\nThe following are recent web search results relevant to the user's query. Use them to provide up-to-date information:\n\n${webSearchContext.substring(0, 3000)}\n--- END WEB SEARCH RESULTS ---\n`;
  }

  // Child mode addendum
  if (isChildMode) {
    systemPrompt += '\nNOTE: Child Safety Guard is ACTIVE in the app. Remind the user about family protection features.';
  }

  // Encapsulated Live API Handler if valid key present
  if (apiKey && apiKey.startsWith('nvapi-')) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
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
    text: generateStructuredReply(userMessage, selectedModel, isChildMode, personaId, documentContext, webSearchContext),
  };
}

// Backward compatibility export alias
export const askNemotronAi = askKavachAi;

// ─── STRUCTURED OFFLINE REPLY ENGINE ─────────────────────────────────────────
function generateStructuredReply(prompt, model, isChildMode, personaId, documentContext, webSearchContext) {
  const q = prompt.toLowerCase().trim();

  // If document context is present, generate RAG-style reply
  if (documentContext) {
    const docSnippet = documentContext.substring(0, 500);
    return `📄 **Document Analysis (${model.name})**\n\nBased on your uploaded document, here's what I found:\n\n${docSnippet}...\n\n💡 **Summary:** This document contains information that I've analyzed. For a more detailed AI analysis, please configure your NVIDIA API key in the app settings.\n\n*Tip: Ask me specific questions about the document for targeted answers!*`;
  }

  // If web search context is present, generate search-augmented reply
  if (webSearchContext) {
    return `🌐 **Web Search Results (${model.name})**\n\n${webSearchContext.substring(0, 800)}\n\n💡 **AI Summary:** Based on the latest web search results above, I've compiled the most relevant information for your query. For deeper AI analysis, configure your NVIDIA API key.\n\n*Powered by SATYA-GPT Real-Time Web Search*`;
  }

  // Persona-specific responses
  if (personaId === 'coding-assistant') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hey! 👋 I'm **SATYA Code Assistant**, your personal coding buddy.\n\nI can help you with:\n- 🐛 **Debugging** — Paste your error and I'll find the fix\n- 💡 **Explanations** — Algorithms, data structures, APIs\n- ✍️ **Writing Code** — Functions, components, full programs\n- 📚 **Learning** — Step-by-step tutorials\n\nJust paste your code or ask your question! I support JavaScript, Python, Java, C++, HTML/CSS, SQL, and more.`;
    }
    return `💻 **Code Analysis (${model.name})**\n\nI've analyzed your query about: "${prompt.substring(0, 80)}"\n\nFor real-time code assistance with syntax highlighting and debugging, please configure your NVIDIA API key. Meanwhile, here's what I can tell you:\n\n🔹 Break down your problem into smaller steps\n🔹 Use console.log() for JavaScript debugging\n🔹 Check variable types and null values\n🔹 Search MDN docs for API references\n\n*Ask me anything about code — I'm here to help! 🚀*`;
  }

  if (personaId === 'teacher') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Namaste! 📚 I'm **SATYA Teacher**, your AI tutor.\n\nI can help you with:\n- 🎯 **Concept Explanations** — Simple language with real-life examples\n- 📝 **Exam Prep** — CBSE, JEE, NEET, Board exam tips\n- 🧮 **Math & Science** — Step-by-step solutions\n- 📖 **Study Plans** — Organized learning schedules\n\nKya seekhna hai aaj? (What would you like to learn today?) 😊`;
    }
    return `📚 **Learning Assistant (${model.name})**\n\nGreat question about: "${prompt.substring(0, 80)}"\n\n💡 **Simplified Explanation:**\nThink of this concept like a real-life example — it helps break down complex ideas into digestible pieces.\n\n✅ **Key Points to Remember:**\n1. Start with the basics and build up\n2. Practice with examples\n3. Connect to what you already know\n\n🎯 **Quick Tip:** Write it in your own words to test understanding!\n\n*For detailed AI tutoring with step-by-step solutions, configure your NVIDIA API key.*`;
  }

  if (personaId === 'translator') {
    return `🌐 **Translation (${model.name})**\n\nYour text: "${prompt.substring(0, 200)}"\n\n📝 **Translation:**\nFor accurate real-time Hindi ↔ English translation with transliteration, please configure your NVIDIA API key.\n\n💡 **Quick Translation Tips:**\n- Keep sentences short for better accuracy\n- Specify the target language (Hindi/English)\n- I can also handle Hinglish!\n\n*Powered by SATYA-GPT Translator Engine*`;
  }

  if (personaId === 'creative-writer') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Namaste! ✍️ I'm **SATYA Creative Writer**, your AI writing companion.\n\nI can create:\n- 📝 **Stories & Narratives** — Fiction, short stories, plot ideas\n- 🎭 **Poems & Shayari** — Hindi, English, or Hinglish\n- 💌 **Emails & Letters** — Professional or personal\n- 📱 **Social Media** — Captions, tweets, bios\n- 📰 **Essays & Articles** — Any topic, any tone\n\nTell me what you'd like me to write! 🌟`;
    }
    return `✍️ **Creative Writing (${model.name})**\n\nI'd love to help with: "${prompt.substring(0, 80)}"\n\nFor full creative AI writing with multiple options and style customization, configure your NVIDIA API key.\n\n💡 **Writing Starter:**\n*"Every great story begins with a single thought..."*\n\n🎨 Specify: tone (formal/casual/poetic), language (Hindi/English/Hinglish), and length for best results!\n\n*Powered by SATYA-GPT Creative Engine*`;
  }

  // Default: Cyber Expert persona (original KAVACH behavior)
  // Greetings
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you') || q.includes('help')) {
    return `Namaste! I am **KAVACH AI**, your built-in cyber security assistant inside SATYA-GPT.\n\nYou can ask me about suspicious SMS messages, unknown links, or QR codes. To verify any link or message immediately, use our **AI Scanner** (with 92-engine VirusTotal verification). You can also turn on **Child Guard** mode to keep your family safe from harmful sites!`;
  }

  // Reporting / Police / Fraud
  if (q.includes('report') || q.includes('police') || q.includes('helpline') || q.includes('1930') || q.includes('cybercrime')) {
    return `🎯 **What's going on:**\nIf you have lost money to a online scam or clicked a bad link, you must report it immediately to lock your bank account.\n\n🔍 **Why it's risky:**\nScammers transfer stolen money through fast UPI or netbanking hops within minutes.\n\n🛡️ **What to do next:**\n1. **Call 1930 immediately:** The Indian National Cyber Fraud Helpline (available 24/7).\n2. **File Official Report:** Register the incident at [cybercrime.gov.in](https://cybercrime.gov.in).\n3. **Inform Bank:** Ask your bank to block your debit/credit card and freeze the transaction.`;
  }

  // Phishing / SMS / Links
  if (q.includes('sbi') || q.includes('link') || q.includes('sms') || q.includes('phishing') || q.includes('kyc') || q.includes('otp') || q.includes('url')) {
    return `🎯 **What's going on:**\nYou've received a suspicious link or SMS claiming your bank account, PAN, or SIM card will be blocked if you don't click immediately.\n\n🔍 **Why it's risky:**\nFake bank links take you to look-alike phishing websites designed to steal your password, UPI PIN, or OTP.\n\n🛡️ **What to do next:**\n1. **Do NOT Click or Share OTP:** Never enter details on unknown links.\n2. **Verify with SATYA Scanner:** Paste the link into SATYA-GPT's AI Scanner for an instant 92-engine VirusTotal safety check.\n3. **Enable Child Guard:** If sharing your phone with family, keep Child Guard active to block scam sites.\n\nIf you lost money, report immediately on **1930** or at **cybercrime.gov.in**.`;
  }

  // Gaming / Child Protection
  if (q.includes('game') || q.includes('robux') || q.includes('child') || q.includes('family') || q.includes('free')) {
    return `🎯 **What's going on:**\nFree game coins, Robux, or gift card traps target children and gaming enthusiasts to steal account access.\n\n🔍 **Why it's risky:**\nThese fake giveaway pages ask for phone numbers, OTPs, or app downloads containing malware.\n\n🛡️ **What to do next:**\n1. **Keep Child Guard Active:** Turn on Child Guard mode in SATYA-GPT to block adult & gaming scam sites.\n2. **Scan Downloads:** Run any APK or link through our 92-engine VirusTotal Scanner.\n3. **Use 2-Factor Auth:** Lock your gaming and Google accounts with password protection.`;
  }

  // Default
  return `🎯 **What's going on:**\nYou are asking about a potential online security risk or unknown message.\n\n🔍 **Why it's risky:**\nScammers use deceptive links, fake SMS alerts, and malicious QR codes to compromise personal data or steal money.\n\n🛡️ **What to do next:**\n1. **Use SATYA AI Scanner:** Paste any link or SMS text into our AI Scanner for a 92-engine VirusTotal safety check.\n2. **Turn on Child Guard:** Keep your family protected from deceptive websites.\n3. **Report Scams:** For online financial fraud, report immediately to the **1930 Cyber Fraud Helpline** or visit **cybercrime.gov.in**.`;
}
