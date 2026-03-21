export const getBackgroundMusic = () => {
  if (typeof window !== 'undefined') {
    if (!window.weddingAudio) {
      window.weddingAudio = new Audio('/savera.mp3');
      window.weddingAudio.loop = true;
    }
    return window.weddingAudio;
  }
  return null;
};
