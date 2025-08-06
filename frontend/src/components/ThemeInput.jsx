import { useState } from "react";

const ThemeInput = ({ onSubmit }) => {
  const [theme, setTheme] = useState('');
  const [error, setError] = useState('');

  const themeExamples = [
    "Space Odyssey", "Pirate Adventure", "Magical Quest", 
    "Cyberpunk Future", "Medieval Fantasy", "Ocean Depths",
    "Mystery Thriller", "Superhero Origin", "Lunar Colony"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!theme.trim()) {
      setError("Every great adventure needs a theme! 🎯");
      return;
    }
    setError('');
    onSubmit(theme);
  };

  const selectExample = (example) => {
    setTheme(example);
    setError('');
  };

  return (
    <div className="theme-input-container glass-card">
      <h2>🎮 Create Your Epic Adventure</h2>
      <p>✨ Enter a theme and watch AI craft your personalized interactive story!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="🎲 Enter your adventure theme..."
            className={error ? "error" : ""}
            maxLength={50}
          />
          {error && <span className="error-text">{error}</span>}
        </div>
        
        <button type="submit" className="generate-btn">
          🚀 Generate Epic Story
        </button>
      </form>

      <div className="examples">
        <h3>🎯 Quick Start Ideas:</h3>
        <div className="example-grid">
          {themeExamples.map((example, index) => (
            <button
              key={index}
              className="example-btn"
              onClick={() => selectExample(example)}
              type="button"
              style={{margin:"10px"}}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeInput;
