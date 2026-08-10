import React, { useState, useCallback, memo } from 'react';
import { Sparkles, Download, Image as ImageIcon } from 'lucide-react';
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

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const url = await generateImage(prompt, selectedStyle, selectedRatio);
      setGeneratedImage(url);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, selectedRatio]);

  const handleDownload = useCallback(() => {
    if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [generatedImage]);

  return (
    <div className="flex flex-col gap-4 p-4 text-slate-200">
      <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-xs text-[var(--text-muted)] font-mono mb-2 uppercase">Prompt</label>
          <textarea
            className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-3 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none resize-none"
            rows={2}
            placeholder="Describe what you want to see..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] font-mono mb-2 uppercase">Style</label>
          <div className="flex flex-wrap gap-2">
            {(IMAGE_STYLES || [
              { id: 'photorealistic', emoji: '📸', label: 'Realistic' },
              { id: 'anime', emoji: '🎨', label: 'Anime' },
              { id: '3d-render', emoji: '🧊', label: '3D Render' }
            ]).map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedStyle === style.id ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)]' : 'bg-[#0B0F19] border-[#27395C] hover:border-slate-500'}`}
              >
                {style.emoji} {style.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] font-mono mb-2 uppercase">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {(ASPECT_RATIOS || [
              { id: '1:1', label: '1:1' },
              { id: '16:9', label: '16:9' },
              { id: '9:16', label: '9:16' }
            ]).map(ratio => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${selectedRatio === ratio.id ? 'bg-[var(--accent)] text-slate-950 border-[var(--accent)]' : 'bg-[#0B0F19] border-[#27395C] hover:border-slate-500'}`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 bg-[var(--accent)] text-slate-950 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isGenerating ? (
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
               <Sparkles className="w-5 h-5" />
             </motion.div>
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate Image'}</span>
        </button>
        <p className="text-center text-[10px] text-[var(--text-muted)] mt-1">Demo mode: Results may vary without API key</p>
      </div>

      {(isGenerating || generatedImage) && (
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
          {isGenerating ? (
            <div className="w-full h-64 rounded-xl bg-slate-800 animate-pulse flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
               <ImageIcon className="w-12 h-12 text-slate-600" />
            </div>
          ) : generatedImage ? (
            <div className="space-y-4 w-full">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full max-h-[400px] object-contain rounded-xl shadow-2xl" 
              />
              <button 
                onClick={handleDownload}
                className="w-full py-2 bg-[#0B0F19] border border-[#27395C] hover:border-[var(--accent)] text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Download Image
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
});

ImageGeneratorPanel.displayName = 'ImageGeneratorPanel';
export default ImageGeneratorPanel;
