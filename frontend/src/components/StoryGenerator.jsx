import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeInput from './ThemeInput.jsx';
import LoadingStatus from './LoadingStatus.jsx';
import axiosClient from '../api/axiosClient.js';

const StoryGenerator = ({ addXP, addAchievement }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("");
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");

  useEffect(() => {
    let pullInterval;
    if (jobId && (jobStatus === "processing" || jobStatus === "pending")) {
      pullInterval = setInterval(() => {
        pullJobStatus(jobId);
      }, 3000);
    }
    return () => {
      if (pullInterval) clearInterval(pullInterval);
    };
  }, [jobId, jobStatus]);

  const generateStory = async (theme) => {
    setLoading(true);
    setError(null);
    setTheme(theme);
    setGenerationProgress(0);
    setGenerationStep("AUTH_SEQUENCE: INITIALIZING_CORE");

    try {
      setGenerationProgress(15);
      setGenerationStep("ESTABLISHING_NEURAL_LINK...");

      const response = await axiosClient.post('/stories/create', { theme });
      const { job_id, status } = response.data;
      
      setJobId(job_id);
      setJobStatus(status);
      setGenerationProgress(30);
      setGenerationStep("PROCESSING_THEME_PARAMETERS...");
      
      if (addXP) {
        addXP(15);
        addAchievement && addAchievement("🎨 Story Creator");
      }

      pullJobStatus(job_id);
    } catch (error) {
      setLoading(false);
      setError(`CRITICAL_FAILURE: ${error.message}`);
    }
  };

  const pullJobStatus = async (id) => {
    try {
      const response = await axiosClient.get(`/jobs/${id}`);
      const { status, story_id, error: jobError } = response.data;
      
      setJobStatus(status);
      
      if (status === "processing") {
        setGenerationProgress(prev => Math.min(prev + 5, 85));
        const steps = [
          "NEURAL_SYNTHESIS: CRAFTING_ENTITIES",
          "GRID_EXPANSION: WORLD_CONSTRUCTION",
          "LOGIC_FORGE: PLOT_DIVERGENCE",
          "NARRATIVE_STREAM: ENCODING_EVENTS",
          "FINALIZING_TEMPORAL_STRUCTURE"
        ];
        const randomStep = steps[Math.floor(Math.random() * steps.length)];
        setGenerationStep(randomStep);
      }
      
      if (status === "completed" && story_id) {
        setGenerationProgress(100);
        setGenerationStep("SEQUENCE_COMPLETE: LAUNCHING_SIMULATION");
        
        if (addXP) {
          addXP(25);
          addAchievement && addAchievement("⭐ Master Storyteller");
        }
        
        setTimeout(() => {
          fetchStory(story_id);
        }, 1000);
      } else if (status === "failed" || jobError) {
        setError(`SYSTEM_ERROR: ${jobError || 'REASON_UNKNOWN'}`);
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setError(`UPLINK_INTERRUPTED: ${error.message}`);
        setLoading(false);
      }
    }
  };

  const fetchStory = async (id) => {
    setLoading(false);
    setJobStatus("completed");
    navigate(`/story/${id}`);
  };

  const reset = () => {
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setTheme("");
    setLoading(false);
    setGenerationProgress(0);
    setGenerationStep("");
  };

  return (
    <div className='story-generator' style={{ maxWidth: '800px', margin: '4rem auto', width: '100%' }}>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='panel section' 
            style={{ borderLeft: '4px solid var(--danger)', background: '#0a0000' }}
          >
            <h3 className="mono" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>TERMINAL_ERROR</h3>
            <p className="mono" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>{error}</p>
            <div className="cluster">
              <button onClick={reset} className="button-primary" style={{ background: 'var(--danger)', color: 'white' }}>Reboot_System</button>
              <button onClick={() => window.location.reload()} className="button-ghost">Refresh_Uplink</button>
            </div>
          </motion.div>
        )}
        
        {!jobId && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h2 className="mono" style={{ fontSize: '0.85rem', color: 'var(--brand)', letterSpacing: '0.2em' }}>[ INITIALIZE_PROTOCOL ]</h2>
              <p style={{ marginTop: '0.5rem' }}>Input theme parameters to begin neural narrative generation.</p>
            </div>
            <ThemeInput onSubmit={generateStory} />
          </motion.div>
        )}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Forge_Status: <span style={{ color: 'var(--brand)' }}>Active</span>
              </span>
            </div>
            
            <LoadingStatus 
              theme={theme || "story"} 
              progress={generationProgress}
              message={generationStep}
              showStats={true}
            />

            {/* Visual Progress Bar Overlay if LoadingStatus is simple */}
            <div style={{ 
              width: '100%', 
              height: '2px', 
              background: 'var(--border)', 
              marginTop: '4rem',
              position: 'relative',
              overflow: 'hidden' 
            }}>
              <motion.div 
                style={{ 
                  height: '100%', 
                  background: 'var(--brand)', 
                  boxShadow: '0 0 15px var(--brand)' 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryGenerator;