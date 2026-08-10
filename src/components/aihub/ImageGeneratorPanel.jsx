import React, { useState, useCallback, memo } from 'react';
import { Sparkles, Download, Image as ImageIcon, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';
import { generateImage, IMAGE_STYLES, ASPECT_RATIOS } from '../../services/imageGenerationService';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ImageGeneratorPanel = memo(() => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(IMAGE_STYLES?.[0]?.id || 'photorealistic');
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS?.[0]?.id || '1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [modelBadge, setModelBadge] = useState('NVIDIA Nemotron-3 Ultra 550B');
  const [error, setError] = useState('');

  const samplePrompts = [
    'generate the photo of scene',
    'cyberpunk neon city with rain reflections',
    'photorealistic sunset over golden ocean waves',
    'anime samurai standing under pink cherry blossoms',
    '3d digital art of futuristic AI cyber core',
  ];

  const handleGenerate = useCallback(async (overridePrompt) => {
    const textToUse = overridePrompt || prompt;
    if (!textToUse || !textToUse.trim()) return;

    if (overridePrompt) setPrompt(overridePrompt);

    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);

    try {
      const res = await generateImage(textToUse.trim(), selectedStyle, selectedRatio);
      if (res && res.success && res.imageUrl) {
        setGeneratedImage(res.imageUrl);
        if (res.modelName) setModelBadge(res.modelName);
      } else {
        setError(res?.error || 'Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error("Failed to generate image", err);
      setError('An error occurred during image generation.');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, selectedRatio]);

  const handleDownload = useCallback(() => {
    if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `nemotron-3-ultra-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [generatedImage]);

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-5 text-slate-200 font-mono">
      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              NVIDIA Nemotron-3 Ultra 550B AI Image Generator
            </h2>
            <p className="text-[10px] text-[var(--text-muted)]">High-speed multimodal prompt processor & visual artist engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0B0F19] border border-[#27395C] rounded-lg text-[10px] font-bold text-cyan-400 w-fit">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>NEMOTRON-3 ULTRA 550B ACTIVE</span>
        </div>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] font-bold mb-1.5 uppercase tracking-wider">
            PROMPT (Describe what you want to see)
          </label>
          <textarea
            className="w-full bg-[#0B0F19] border border-[#27395C] rounded-xl p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none resize-none font-mono"
            rows={2}
            placeholder="e.g. generate the photo of scene..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Sample Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] mt-2">
            <span className="text-[var(--text-muted)] font-bold shrink-0">Try Prompt:</span>
            {samplePrompts.map((pText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGenerate(pText)}
                className="px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#27395C] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] whitespace-nowrap transition-all shrink-0 font-mono"
              >
                {pText}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] font-bold mb-2 uppercase tracking-wider">
            STYLE
          </label>
          <div className="flex flex-wrap gap-2">
            {IMAGE_STYLES.map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  selectedStyle === style.id 
                    ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]' 
                    : 'bg-[#0B0F19] border-[#27395C] text-[var(--text-secondary)] hover:border-slate-500'
                }`}
              >
                <span>{style.emoji}</span>
                <span>{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] font-bold mb-2 uppercase tracking-wider">
            ASPECT RATIO
          </label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map(ratio => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => setSelectedRatio(ratio.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedRatio === ratio.id 
                    ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]' 
                    : 'bg-[#0B0F19] border-[#27395C] text-[var(--text-secondary)] hover:border-slate-500'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Nemotron-3 Ultra Generating Image...' : 'Generate Image (Nemotron-3 Ultra)'}</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/30 text-xs font-bold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Image Output Preview Card */}
      {(isGenerating || generatedImage) && (
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] shadow-2xl space-y-4">
          {isGenerating ? (
            <div className="w-full h-72 rounded-xl bg-[#0B0F19] border border-[#27395C] animate-pulse flex flex-col items-center justify-center gap-3 relative overflow-hidden">
              <Sparkles className="w-10 h-10 text-[var(--accent)] animate-spin" />
              <div className="text-xs font-bold text-[var(--accent)]">NVIDIA Nemotron-3 Ultra 550B Processing...</div>
              <div className="text-[10px] text-[var(--text-muted)]">Building visual composition & color grading</div>
            </div>
          ) : generatedImage ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 w-full flex flex-col items-center">
              <div className="relative w-full flex justify-center">
                <img 
                  src={generatedImage} 
                  alt="Nemotron Generated Visual" 
                  className="max-h-[420px] w-auto object-contain rounded-xl border border-[#27395C] shadow-2xl" 
                />
              </div>

              <div className="flex items-center justify-between w-full p-3 bg-[#0B0F19] rounded-xl border border-[#27395C] text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 size={16} />
                  <span>{modelBadge}</span>
                </div>

                <button 
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-all text-xs shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}
    </div>
  );
});

ImageGeneratorPanel.displayName = 'ImageGeneratorPanel';
export default ImageGeneratorPanel;
