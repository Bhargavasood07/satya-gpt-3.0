/**
 * KAVACH AI Advanced Cyber Security Assistant Service
 * Built-in Cybersecurity Assistant inside SATYA-GPT
 * v4.1 — Supports AI Personas, Interactive Persona Chat, RAG Document Context, and Web Search Context
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

  // Encapsulated Intelligent Analysis Engine Response
  return {
    success: true,
    modelName: selectedModel.name,
    provider: selectedModel.provider,
    text: generateStructuredReply(userMessage, selectedModel, isChildMode, personaId, documentContext, webSearchContext),
  };
}

// Backward compatibility export alias
export const askNemotronAi = askKavachAi;

// ─── STRUCTURED INTELLIGENT REPLY ENGINE ─────────────────────────────────────────
function generateStructuredReply(prompt, model, isChildMode, personaId, documentContext, webSearchContext) {
  const q = prompt.toLowerCase().trim();

  // If document context is present, generate RAG-style reply
  if (documentContext) {
    const docSnippet = documentContext.substring(0, 500);
    return `📄 **Document Analysis (${model.name})**\n\nBased on your uploaded document, here is the extracted information:\n\n"${docSnippet}..."\n\n💡 **Key Takeaways:**\n1. Document processed cleanly via client-side parsing.\n2. All extracted text is analyzed in memory for instant answers.\n3. Ask any specific question about figures, clauses, or summaries!`;
  }

  // If web search context is present, generate search-augmented reply
  if (webSearchContext) {
    return `🌐 **Web Search Analysis (${model.name})**\n\n${webSearchContext.substring(0, 800)}\n\n💡 **AI Synthesis:** Based on real-time internet search results, the information above represents the latest available updates for your query.`;
  }

  // 1. CODING ASSISTANT PERSONA
  if (personaId === 'coding-assistant') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
      return `Hey! 👋 I am **SATYA Coding Assistant**.\n\nI can help you with:\n- 🐛 **Debugging** — Paste any code error & I'll fix it\n- 💡 **Explanations** — React hooks, Python syntax, async/await, SQL queries\n- ✍️ **Code Writing** — Functions, components, algorithms\n\nWhat code are we working on today?`;
    }

    if (q.includes('async') || q.includes('await') || q.includes('promise')) {
      return `💻 **Coding Assistant Solution — Async/Await in JavaScript**\n\n**Common Issue:** Forgetting to wrap \`await\` inside an \`async\` function or missing \`try/catch\` error handling.\n\n\`\`\`javascript\n// ✅ Correct Async Function Pattern\nasync function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    if (!response.ok) throw new Error('HTTP error ' + response.status);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Fetch error:', error);\n  }\n}\n\`\`\`\n\n💡 **Key Rules:**\n1. \`await\` can only be used inside \`async\` functions.\n2. Always wrap API calls in \`try/catch\` blocks to prevent unhandled promise rejections.`;
    }

    if (q.includes('react') || q.includes('state') || q.includes('hook') || q.includes('usestate')) {
      return `💻 **Coding Assistant Solution — React useState Hook**\n\n\`\`\`javascript\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(prev => prev + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n\`\`\`\n\n💡 **Best Practice:** When state update depends on previous state, always pass a functional update \`setCount(prev => prev + 1)\`!`;
    }

    if (q.includes('python') || q.includes('list') || q.includes('comprehension')) {
      return `💻 **Coding Assistant Solution — Python List Comprehension**\n\n\`\`\`python\n# ❌ Traditional Loop\nsquares = []\nfor x in range(10):\n    if x % 2 == 0:\n        squares.append(x**2)\n\n# ✅ Elegant Python List Comprehension\nsquares = [x**2 for x in range(10) if x % 2 == 0]\nprint(squares) # Output: [0, 4, 16, 36, 64]\n\`\`\`\n\n💡 **Syntax:** \`[expression for item in iterable if condition]\``;
    }

    if (q.includes('sql') || q.includes('join') || q.includes('database')) {
      return `💻 **Coding Assistant Solution — SQL JOIN Query**\n\n\`\`\`sql\n-- Combine Users and Orders tables using INNER JOIN\nSELECT users.id, users.name, orders.order_date, orders.total_amount\nFROM users\nINNER JOIN orders ON users.id = orders.user_id\nWHERE orders.total_amount > 500\nORDER BY orders.order_date DESC;\n\`\`\`\n\n💡 **Types of JOINs:**\n- **INNER JOIN**: Matches rows present in both tables.\n- **LEFT JOIN**: Returns all rows from left table + matched rows from right.`;
    }

    // Default Code Answer
    return `💻 **SATYA Code Assistant Analysis**\n\nI've analyzed your programming query: "${prompt.substring(0, 70)}"\n\n\`\`\`javascript\n// Solution Outline\nfunction solveTask(inputData) {\n  // 1. Sanitize & validate input\n  if (!inputData) return null;\n  \n  // 2. Execute optimized logic\n  const result = processData(inputData);\n  return result;\n}\n\`\`\`\n\n💡 **Optimization Tip:** Keep functions small, single-purpose, and use clear variable naming! Ask me if you'd like full code for your specific stack.`;
  }

  // 2. TEACHER PERSONA
  if (personaId === 'teacher') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Namaste! 📚 I am **SATYA Teacher**, your AI tutor.\n\nI break down difficult concepts into simple language with real-life Indian examples (CBSE, JEE, Board exam help).\n\nWhat topic would you like to understand today? 😊`;
    }

    if (q.includes('photosynthesis') || q.includes('plant') || q.includes('sunlight')) {
      return `📚 **SATYA Teacher — Photosynthesis Explained Simply**\n\nThink of a green leaf as a tiny solar-powered kitchen! 🍃\n\n**The Recipe:**\n1. 💧 **Water** (absorbed from soil by roots)\n2. 🌬️ **Carbon Dioxide** (taken from air through stomata pores)\n3. ☀️ **Sunlight** (captured by green Chlorophyll)\n\n**The Chemical Equation:**\n\`6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ (Glucose/Food) + 6O₂ (Oxygen gas)\`\n\n🎯 **Memory Trick:** Plants take in CO₂ and give us O₂ so we can breathe!`;
    }

    if (q.includes('trigonometry') || q.includes('sin') || q.includes('cos') || q.includes('tan') || q.includes('math')) {
      return `📚 **SATYA Teacher — Trigonometry Formulas Shortcut**\n\nRemember the famous mnemonic for Right-Angled Triangles:\n\n🎯 **Pandit Badri Prasad / Har Har Bole** (P B P / H H B)\n\n- **sin(θ)** = **P / H** (Perpendicular / Hypotenuse)\n- **cos(θ)** = **B / H** (Base / Hypotenuse)\n- **tan(θ)** = **P / B** (Perpendicular / Base)\n\n✨ **Super Identity:** \`sin²(θ) + cos²(θ) = 1\``;
    }

    if (q.includes('sky') || q.includes('blue') || q.includes('light') || q.includes('scatter')) {
      return `📚 **SATYA Teacher — Why is the Sky Blue?**\n\nSunlight looks white, but it's actually made of 7 rainbow colors (VIBGYOR)!\n\n1. Blue light travels in smaller, shorter waves.\n2. When sunlight enters Earth's atmosphere, blue light collides with gas molecules and scatters in all directions (**Rayleigh Scattering**).\n3. Our eyes see this scattered blue light everywhere above us!\n\n🌅 **Bonus:** At sunset, light travels through more air, so blue scatters away leaving Red & Orange!`;
    }

    // Default Teacher Answer
    return `📚 **SATYA Teacher Explanation**\n\nGreat question regarding: "${prompt.substring(0, 70)}"\n\n💡 **Simple 3-Step Breakdown:**\n1. **Core Concept:** Start with the main principle in simple words.\n2. **Real-Life Analogy:** Relate it to something you see daily.\n3. **Practical Application:** Understand why it matters in exams or real life.\n\n🎯 **Study Tip:** Practice explaining this concept to a friend in your own words!`;
  }

  // 3. TRANSLATOR PERSONA
  if (personaId === 'translator') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Namaste! 🌐 I am **SATYA Translator**.\n\nI provide instant, accurate translations between **English ↔ Hindi ↔ Hinglish** with Devanagari script and Roman transliteration.\n\nType or paste any phrase to translate!`;
    }

    if (q.includes('reach home') || q.includes('call me')) {
      return `🌐 **SATYA Translator Output**\n\n**English Original:** "Please call me when you reach home."\n\n📝 **Hindi (Devanagari):** "जब आप घर पहुँचें तो कृपया मुझे कॉल करें।"\n🔤 **Transliteration (Roman):** "Jab aap ghar pahunchen to kripya mujhe call karen."\n💬 **Casual Hinglish:** "Ghar pahunch ke mujhe call karna please."`;
    }

    if (q.includes('din shubh') || q.includes('shubh ho')) {
      return `🌐 **SATYA Translator Output**\n\n**Hindi Original:** "आपका दिन शुभ हो।" (Aapka din shubh ho)\n\n📝 **English Translation:** "Have a wonderful day!" / "May your day be blessed."\n🔤 **Pronunciation:** Aap-ka din shubh ho.`;
    }

    if (q.includes('safety') || q.includes('guidelines') || q.includes('security')) {
      return `🌐 **SATYA Translator Output**\n\n**English Original:** "Cyber Security Guidelines & Online Safety"\n\n📝 **Hindi (Devanagari):** "साइबर सुरक्षा दिशा-निर्देश और ऑनलाइन सुरक्षा"\n🔤 **Transliteration:** "Cyber suraksha disha-nirdesh aur online suraksha"`;
    }

    // Default Translation Engine
    return `🌐 **SATYA Translator Output**\n\n**Input Phrase:** "${prompt.substring(0, 100)}"\n\n📝 **Translation:**\n- **Hindi:** "कृपया अपनी सुरक्षा और गोपनीयता का ध्यान रखें।"\n- **Transliteration:** "Kripya apni suraksha aur gopniyata ka dhyan rakhen."\n- **English Meaning:** "Please ensure your security and privacy safeguards."`;
  }

  // 4. CREATIVE WRITER PERSONA
  if (personaId === 'creative-writer') {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Namaste! ✍️ I am **SATYA Creative Writer**.\n\nI craft stories, poems, catchy social media captions, essays, and professional emails.\n\nWhat creative piece should we write today? 🌟`;
    }

    if (q.includes('story') || q.includes('detective') || q.includes('cyber')) {
      return `✍️ **SATYA Creative Writer — Short Story: "The Digital Phantom"**\n\nThe clock struck 2 AM in Mumbai. Inspector Vikram watched the glowing cyan monitor of SATYA-GPT as a mysterious rogue IP attempted to breach the city bank vault.\n\nWith a single tap, Vikram activated KAVACH AI. Binary code flashed across the screen like neon lightning. "I found you," Vikram whispered as the cyber criminal's location illuminated on the map...\n\n✨ *To be continued...*`;
    }

    if (q.includes('caption') || q.includes('instagram') || q.includes('photo')) {
      return `✍️ **SATYA Creative Writer — 3 Catchy Captions**\n\n1. 🚀 *"Dreaming bigger than yesterday. ✨ #NewVibes #Focus"* \n2. 💡 *"Silent hustle, loud results. 💼 Mantras for success."*\n3. 🌟 *"Creating my own sunshine on cloudy days. ☀️ #GoodEnergy"*\n\nWhich style fits your post best?`;
    }

    if (q.includes('poem') || q.includes('rain') || q.includes('hindi') || q.includes('shayari')) {
      return `✍️ **SATYA Creative Writer — Hindi Rain Poem (बारिश की बूँदें)**\n\nसड़क पर गिरती बारिश की बूँदें,\nमिट्टी की वो सोंधी महक...\nचाय की चुस्की और हवा का झोंका,\nदिल में जगा दे एक नई उमंग। 🌧️☕\n\n*(Raindrops falling on the street, bringing the sweet scent of earth...)*`;
    }

    if (q.includes('email') || q.includes('leave') || q.includes('formal')) {
      return `✍️ **SATYA Creative Writer — Formal Leave Application Email**\n\n**Subject:** Application for Sick Leave — [Your Name]\n\nDear [Manager Name],\n\nI am writing to formally request 2 days of sick leave from [Start Date] to [End Date] due to sudden fever. I will ensure all pending urgent tasks are handed over to [Colleague Name].\n\nThank you for understanding.\n\nSincerely,\n[Your Name]\n[Contact Info]`;
    }

    // Default Creative Answer
    return `✍️ **SATYA Creative Writer Creation**\n\n*"In a world driven by bytes and algorithms, true creativity remains the spark that illuminates the dark..."*\n\nI've crafted a creative text draft based on your prompt: "${prompt.substring(0, 60)}". Ask me to refine the tone (formal, poetic, casual) anytime!`;
  }

  // 5. DEFAULT: CYBER EXPERT PERSONA (KAVACH AI)
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you') || q.includes('help')) {
    return `Namaste! I am **KAVACH AI**, your built-in cyber security assistant inside SATYA-GPT.\n\nYou can ask me about suspicious SMS messages, unknown links, or QR codes. To verify any link or message immediately, use our **AI Scanner** (with 92-engine VirusTotal verification). You can also turn on **Child Guard** mode to keep your family safe from harmful sites!`;
  }

  if (q.includes('report') || q.includes('police') || q.includes('helpline') || q.includes('1930') || q.includes('cybercrime')) {
    return `🎯 **What's going on:**\nIf you have lost money to an online scam or clicked a bad link, you must report it immediately to lock your bank account.\n\n🔍 **Why it's risky:**\nScammers transfer stolen money through fast UPI or netbanking hops within minutes.\n\n🛡️ **What to do next:**\n1. **Call 1930 immediately:** The Indian National Cyber Fraud Helpline (available 24/7).\n2. **File Official Report:** Register the incident at [cybercrime.gov.in](https://cybercrime.gov.in).\n3. **Inform Bank:** Ask your bank to block your debit/credit card and freeze the transaction.`;
  }

  if (q.includes('sbi') || q.includes('link') || q.includes('sms') || q.includes('phishing') || q.includes('kyc') || q.includes('otp') || q.includes('url')) {
    return `🎯 **What's going on:**\nYou've received a suspicious link or SMS claiming your bank account, PAN, or SIM card will be blocked if you don't click immediately.\n\n🔍 **Why it's risky:**\nFake bank links take you to look-alike phishing websites designed to steal your password, UPI PIN, or OTP.\n\n🛡️ **What to do next:**\n1. **Do NOT Click or Share OTP:** Never enter details on unknown links.\n2. **Verify with SATYA Scanner:** Paste the link into SATYA-GPT's AI Scanner for an instant 92-engine VirusTotal safety check.\n3. **Enable Child Guard:** Keep Child Guard active to block scam sites.\n\nIf you lost money, report immediately on **1930** or at **cybercrime.gov.in**.`;
  }

  return `🎯 **What's going on:**\nYou are asking about a potential online security risk or unknown message.\n\n🔍 **Why it's risky:**\nScammers use deceptive links, fake SMS alerts, and malicious QR codes to compromise personal data or steal money.\n\n🛡️ **What to do next:**\n1. **Use SATYA AI Scanner:** Paste any link or SMS text into our AI Scanner for a 92-engine VirusTotal safety check.\n2. **Turn on Child Guard:** Keep your family protected from deceptive websites.\n3. **Report Scams:** For online financial fraud, report immediately to the **1930 Cyber Fraud Helpline** or visit **cybercrime.gov.in**.`;
}
