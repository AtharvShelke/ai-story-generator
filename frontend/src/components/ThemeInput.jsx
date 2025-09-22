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
    <div className="theme-input-container panel section stack-lg">
      <div className="stack-sm">
        <h2>Create a new story</h2>
        <p className="muted">Enter a theme or pick an example to get started.</p>
      </div>
      <form onSubmit={handleSubmit} className="stack-md">
        <div className="input-group">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. A detective in a city of dreams"
            className={`input ${error ? 'input-error' : ''}`}
            maxLength={50}
          />
          {error && <span className="error-text">{error}</span>}
        </div>
        <div className="cluster">
          <button type="submit" className="button-primary">Generate story</button>
          <button type="button" className="button-ghost" onClick={() => setTheme('')}>Clear</button>
        </div>
      </form>

      <div className="examples stack-sm">
        <h3>Examples</h3>
        <div className="example-grid">
          {themeExamples.map((example, index) => (
            <button
              key={index}
              className="example-btn"
              onClick={() => selectExample(example)}
              type="button"
              style={{margin:"4px"}}
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
