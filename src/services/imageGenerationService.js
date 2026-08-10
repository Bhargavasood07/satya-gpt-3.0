export const IMAGE_STYLES = [
  { id: 'photorealistic', label: 'Photorealistic', emoji: '📸' },
  { id: 'anime', label: 'Anime', emoji: '🌸' },
  { id: 'digital-art', label: 'Digital Art', emoji: '🎨' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🌆' },
  { id: 'watercolor', label: 'Watercolor', emoji: '🖌️' }
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square', width: 1024, height: 1024 },
  { id: '16:9', label: 'Widescreen', width: 1024, height: 576 },
  { id: '9:16', label: 'Portrait', width: 576, height: 1024 }
];

export const generateImage = async (prompt, style = 'photorealistic', aspectRatio = '1:1') => {
  const apiKey = import.meta.env.VITE_STABILITY_API_KEY;

  if (!apiKey) {
    // Demo mode: Generate gradient canvas
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0B0F19');
      gradient.addColorStop(0.5, '#131B2E');
      gradient.addColorStop(1, '#00ffff'); // cyan accent
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '24px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Demo Mode Image', canvas.width/2, canvas.height/2);
      
      const dataUrl = canvas.toDataURL('image/png');
      return { success: true, imageUrl: dataUrl };
    } catch (err) {
      return { success: false, error: 'Demo generation failed' };
    }
  }

  try {
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'image/*',
      },
      body: (() => {
        const formData = new FormData();
        formData.append('prompt', `${prompt}, ${style} style`);
        formData.append('output_format', 'jpeg');
        formData.append('aspect_ratio', aspectRatio);
        return formData;
      })(),
    });

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    return { success: true, imageUrl: dataUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
