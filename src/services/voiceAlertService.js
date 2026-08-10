/**
 * Web Speech TTS Voice Alert Announcement Service
 * SATYA-GPT v7.0
 */

export const speakVoiceAlert = (verdict = 'fake', isHindi = false) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    let text = '';
    if (verdict === 'fake' || verdict === 'malicious') {
      text = isHindi
        ? 'Chetaavni! Yeh ek nakli aur khatarnak scam link hai. Is par click mat kijiye!'
        : 'Warning! High risk fake scam link detected. Do not click or pay money!';
    } else {
      text = isHindi
        ? 'Yeh link surakshit aur clean paayi gayi hai.'
        : 'This link has been verified clean and safe by KAVACH AI.';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Voice alert speech synthesis notice:', err);
  }
};
