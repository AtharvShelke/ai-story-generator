import { useState, useEffect } from 'react';

const LoadingStatus = ({ theme }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const loadingTips = [
    "🎨 AI is painting your story world...",
    "📚 Crafting epic plot twists...",
    "🎭 Creating memorable characters...",
    "🗺️ Building your adventure map...",
    "✨ Adding magical elements...",
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 95));
    }, 800);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="loading-container panel section">
      <h2>Generating your {theme} story</h2>
      
      <div className="loading-animation">
        <div className="spinner"></div>
        <div className="loading-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>
      </div>

      <div className="progress-container" aria-label="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.floor(progress)}>
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="center muted">{loadingTips[currentTip]}</p>
      <p className="center muted">{Math.floor(progress)}% complete • Preparing content</p>
    </div>
  );
};

export default LoadingStatus;
