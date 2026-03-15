import { useState } from "react";
import { motion } from "framer-motion";

const ThemeInput = ({ onSubmit }) => {
  const [theme, setTheme] = useState('');
  const [error, setError] = useState('');

  const themeExamples = [
    "NEURAL_PUNK_2099", "VOID_STRIKER", "KINGDOM_OF_ASH", 
    "DEEP_SEA_PROTOCOL", "COSMIC_HORIZON", "MYSTIC_REDACTED",
    "GHOST_IN_THE_CELL", "REVOLUTION_01", "FRACTURED_REALITY"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!theme.trim()) {
      setError("INPUT_REQUIRED: PARAMETER_THEME_IS_EMPTY");
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="theme-input-container panel" 
      style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative Corner Accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderLeft: '2px solid var(--brand)', borderTop: '2px solid var(--brand)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRight: '2px solid var(--brand)', borderBottom: '2px solid var(--brand)' }} />

      <div style={{ marginBottom: '2.5rem' }}>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--brand)', letterSpacing: '0.2em' }}>
          [ SYSTEM_PROMPT ]
        </span>
        <h2 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>Neural Narrative Input</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Define your narrative parameters or select a preset module.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="TYPE_YOUR_THEME_HERE..."
            className="input mono"
            maxLength={50}
            style={{ 
                fontSize: '1.1rem', 
                padding: '1.5rem', 
                borderWidth: '0 0 1px 0', 
                borderRadius: '0', 
                background: 'transparent',
                borderColor: error ? 'var(--danger)' : 'var(--border)'
            }}
          />
          {error && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mono" 
              style={{ color: 'var(--danger)', fontSize: '0.7rem', position: 'absolute', bottom: '-25px', left: 0 }}
            >
              {error}
            </motion.span>
          )}
        </div>

        <div className="cluster" style={{ marginTop: '3rem' }}>
          <button type="submit" className="button-primary" style={{ padding: '1rem 2.5rem' }}>
            Execute_Generation
          </button>
          <button 
            type="button" 
            className="logout-btn-minimal" 
            onClick={() => setTheme('')}
            style={{ fontSize: '0.8rem', marginLeft: '1rem' }}
          >
            Reset_Buffer
          </button>
        </div>
      </form>

      <div className="examples">
        <h3 className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
          AVAILABLE_MODULES
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '10px' 
        }}>
          {themeExamples.map((example, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(204, 255, 0, 0.05)', borderColor: 'var(--brand)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectExample(example)}
              type="button"
              className="mono"
              style={{
                padding: '12px',
                background: 'var(--panel-elev)',
                border: '1px solid var(--border)',
                color: theme === example ? 'var(--brand)' : 'var(--text)',
                borderColor: theme === example ? 'var(--brand)' : 'var(--border)',
                fontSize: '0.7rem',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'border-color 0.2s ease'
              }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeInput;