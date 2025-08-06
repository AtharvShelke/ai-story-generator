import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils.js';
import { useEffect, useState } from 'react';
import ThemeInput from './ThemeInput.jsx';
import LoadingStatus from './LoadingStatus.jsx';
import axios from 'axios';

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
    if (jobId && jobStatus === "processing") {
      pullInterval = setInterval(() => {
        pullJobStatus(jobId);
      }, 3000); // Reduced interval for better UX
    }
    return () => {
      if (pullInterval) {
        clearInterval(pullInterval);
      }
    };
  }, [jobId, jobStatus]);

  const generateStory = async (theme) => {
    setLoading(true);
    setError(null);
    setTheme(theme);
    setGenerationProgress(0);
    setGenerationStep("🎯 Initializing AI Story Engine...");

    try {
      // Simulate initial progress
      setGenerationProgress(15);
      setGenerationStep("📡 Connecting to Story Generator...");

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/stories/create`, { theme });
      const { job_id, status } = response.data;
      
      setJobId(job_id);
      setJobStatus(status);
      setGenerationProgress(30);
      setGenerationStep("⚙️ Processing your theme...");
      
      // Award XP for starting story generation
      if (addXP) {
        addXP(15);
        addAchievement && addAchievement("🎨 Story Creator");
      }

      pullJobStatus(job_id);

    } catch (error) {
      setLoading(false);
      setError(`🚫 Failed to generate story: ${error.message}`);
    }
  };

  const pullJobStatus = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/jobs/${id}`);
      const { status, story_id, error: jobError } = response.data;
      
      setJobStatus(status);
      
      // Update progress based on status
      if (status === "processing") {
        setGenerationProgress(prev => Math.min(prev + 5, 85));
        const steps = [
          "🎭 Crafting characters...",
          "🗺️ Building story world...",
          "✨ Adding plot twists...",
          "🎪 Creating epic moments...",
          "🔥 Polishing the adventure..."
        ];
        const randomStep = steps[Math.floor(Math.random() * steps.length)];
        setGenerationStep(randomStep);
      }
      
      if (status === "completed" && story_id) {
        setGenerationProgress(100);
        setGenerationStep("🎉 Story Complete! Launching adventure...");
        
        // Award bonus XP for completion
        if (addXP) {
          addXP(25);
          addAchievement && addAchievement("⭐ Master Storyteller");
        }
        
        setTimeout(() => {
          fetchStory(story_id);
        }, 1000);
      } else if (status === "failed" || jobError) {
        setError(`⚠️ Story generation failed: ${jobError || 'Unknown error'}`);
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setError(`🔌 Connection error: ${error.message}`);
        setLoading(false);
      }
    }
  };

  const fetchStory = async (id) => {
    try {
      setLoading(false);
      setJobStatus("completed");
      navigate(`/story/${id}`);
    } catch (error) {
      setError(`📱 Navigation error: ${error.message}`);
      setLoading(false);
    }
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
    <div className='story-generator'>
      {error && (
        <div className='error-message glass-card'>
          <div className="error-icon">💥</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={reset} className="primary-btn">
              🔄 Try Again
            </button>
            <button onClick={() => window.location.reload()} className="secondary-btn">
              🏠 Refresh Page
            </button>
          </div>
        </div>
      )}
      
      {!jobId && !loading && !error && (
        <ThemeInput onSubmit={generateStory} />
      )}
      
      {loading && (
        <LoadingStatus 
          theme={theme || "Epic"} 
          progress={generationProgress}
          message={generationStep}
          showStats={true}
        />
      )}
    </div>
  );
};

export default StoryGenerator;
