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
    <div className="loading-container glass-card">
      <h2>🎮 Generating Your {theme} Adventure</h2>
      
      <div className="loading-animation">
        <div className="spinner"></div>
        <div className="loading-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>
      </div>

      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="loading-info">
        {loadingTips[currentTip]}
      </p>
      
      <div className="loading-stats">
        <span>⚡ Power Level: {Math.floor(progress)}%</span>
        <span>🎯 Status: Crafting Epic Tale</span>
      </div>
    </div>
  );
};

export default LoadingStatus;
