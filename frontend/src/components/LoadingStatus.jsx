import { motion } from 'framer-motion';

const LoadingStatus = ({ theme, progress, message }) => {
  // Array for the decorative neural grid animation
  const dots = Array.from({ length: 9 });

  return (
    <div className="loading-status-container" style={{ padding: '2rem 0' }}>
      
      {/* --- NEURAL VISUALIZER --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        width: '60px', 
        margin: '0 auto 3rem' 
      }}>
        {dots.map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
              backgroundColor: ['#222', '#CCFF00', '#222'] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.1,
              ease: "easeInOut" 
            }}
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(204, 255, 0, 0)'
            }}
          />
        ))}
      </div>

      {/* --- CORE DATA READOUT --- */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '0.5rem', 
          textTransform: 'uppercase', 
          letterSpacing: '-0.02em' 
        }}>
          Synthesizing <span style={{ color: 'var(--brand)' }}>{theme}</span>
        </h2>
        
        {/* Syncing the actual message from StoryGenerator */}
        <div className="mono" style={{ 
          fontSize: '0.8rem', 
          color: 'var(--brand)', 
          letterSpacing: '0.1em' 
        }}>
          &gt; {message}
        </div>
      </div>

      {/* --- PERCENTAGE READOUT --- */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'baseline', 
        gap: '8px',
        marginTop: '1rem' 
      }}>
        <span className="mono" style={{ 
          fontSize: '4rem', 
          fontWeight: '800', 
          lineHeight: 1,
          color: 'var(--text)'
        }}>
          {Math.floor(progress)}
        </span>
        <span className="mono" style={{ 
          fontSize: '1.2rem', 
          color: 'var(--muted)',
          fontWeight: '400'
        }}>
          %_LOADED
        </span>
      </div>

      {/* --- SUB-METADATA --- */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px', 
        marginTop: '2rem' 
      }}>
        <div style={{ textAlign: 'left' }}>
          <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '4px' }}>UPLINK_STABILITY</p>
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text)' }}>STABLE_99.9%</p>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}></div>
        <div style={{ textAlign: 'left' }}>
          <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '4px' }}>CORE_TEMP</p>
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text)' }}>OPTIMAL</p>
        </div>
      </div>

    </div>
  );
};

export default LoadingStatus;