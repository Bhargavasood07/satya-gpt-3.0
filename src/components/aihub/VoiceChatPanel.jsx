import React, { useState, useEffect, useCallback, memo } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { askKavachAi } from '../../services/nemotronChatService';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import useTextToSpeech from '../../hooks/useTextToSpeech';
import { motion } from 'framer-motion';

const VoiceChatPanel = memo(() => {
  const [language, setLanguage] = useState('en-US');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ttsMuted, setTtsMuted] = useState(false);

  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript, isSupported, error } = useVoiceRecognition();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  useEffect(() => {
    if (transcript && !isListening) {
      handleQuery(transcript);
    }
  }, [transcript, isListening]);

  const handleQuery = useCallback(async (query) => {
    if (!query.trim()) return;
    setIsProcessing(true);
    setAiResponse('');
    try {
      const resp = await askKavachAi([{ role: 'user', content: query }], 'meta-llama-3');
      const text = resp?.content || 'I could not process that request.';
      setAiResponse(text);
      if (!ttsMuted) {
        speak(text, language);
      }
    } catch (err) {
      console.error(err);
      setAiResponse('An error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  }, [language, ttsMuted, speak]);

  const toggleListen = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      stopSpeaking();
      setAiResponse('');
      startListening(language);
    }
  }, [isListening, stopListening, resetTranscript, stopSpeaking, startListening, language]);

  if (!isSupported) {
    return (
      <div className="p-8 text-center text-slate-300">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
        <p>Voice recognition is not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 text-slate-200 h-full">
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setLanguage('en-US')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${language === 'en-US' ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)]' : 'bg-[#131B2E] border-[#27395C] text-slate-300 hover:border-slate-500'}`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('hi-IN')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${language === 'hi-IN' ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)]' : 'bg-[#131B2E] border-[#27395C] text-slate-300 hover:border-slate-500'}`}
        >
          Hindi
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          {isListening && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute w-24 h-24 rounded-full bg-[var(--accent)]"
            />
          )}
          <button
            onClick={toggleListen}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${isListening ? 'bg-[var(--accent)] text-slate-950' : 'bg-[#131B2E] border-2 border-[#27395C] text-slate-300 hover:border-[var(--accent)]'}`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
          </button>
        </div>

        <div className="text-center font-mono h-8">
          {isProcessing ? (
            <span className="text-[var(--accent)] animate-pulse">Processing...</span>
          ) : isListening ? (
            <span className="text-emerald-400">Listening...</span>
          ) : (
            <span className="text-slate-400">Tap to speak</span>
          )}
        </div>

        <div className="w-full max-w-md bg-[#131B2E] border border-[#27395C] rounded-xl p-4 min-h-[100px] max-h-[150px] overflow-y-auto font-mono text-sm">
          <p className="text-slate-300">{transcript || interimTranscript || <span className="text-slate-500 italic">Waiting for input...</span>}</p>
        </div>
      </div>

      {aiResponse && (
        <div className="mt-4 bg-[#131B2E] border border-[var(--accent-muted)] rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">AI Response</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setTtsMuted(!ttsMuted)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title={ttsMuted ? "Unmute TTS" : "Mute TTS"}
              >
                {ttsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => speak(aiResponse, language)}
                disabled={isSpeaking || ttsMuted}
                className="text-[var(--accent)] hover:text-emerald-400 transition-colors disabled:opacity-50"
                title="Replay"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
        </div>
      )}
    </div>
  );
});

VoiceChatPanel.displayName = 'VoiceChatPanel';
export default VoiceChatPanel;
