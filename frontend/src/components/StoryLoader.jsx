import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import LoadingStatus from "./LoadingStatus.jsx";
import StoryGame from "./StoryGame.jsx";
import { API_BASE_URL } from '../utils.js';

const StoryLoader = ({ addXP, addAchievement }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        loadStory(id);
    }, [id]);

    const loadStory = async (storyId) => {
        setLoading(true);
        setError(null);
        setLoadingProgress(0);
        
        try {
            // Simulate loading progress
            const progressInterval = setInterval(() => {
                setLoadingProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/stories/${storyId}/complete`);
            
            clearInterval(progressInterval);
            setLoadingProgress(100);
            
            setStory(response.data);
            setLoading(false);
            
            // Award XP for loading a story
            if (addXP) {
                addXP(10);
                addAchievement && addAchievement("📖 Story Explorer");
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewStory = () => {
        // Award XP for creating new story
        if (addXP) {
            addXP(5);
        }
        navigate("/");
    };

    if (loading) {
        return (
            <div className="story-loader-container">
                <LoadingStatus 
                    theme={"story"} 
                    progress={loadingProgress}
                    message="Loading your story..."
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="story-loader panel section">
                <div className="error-container">
                    <h3 className="error-title">Story not found</h3>
                    <p className="error-message">We couldn't load that story.</p>
                    <p className="error-details">{error}</p>
                    <div className="error-actions">
                        <button onClick={createNewStory} className="button-primary">
                            Create new story
                        </button>
                        <button onClick={() => window.location.reload()} className="button-ghost">
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (story) {
        return (
            <div className="story-loader panel section">
                <div className="story-navigation">
                    <button onClick={createNewStory} className="nav-btn button-ghost">
                        New story
                    </button>
                    <div className="story-info">
                        <span className="story-id">Story #{id?.slice(-6)}</span>
                    </div>
                </div>
                <StoryGame 
                    story={story} 
                    onNewStory={createNewStory}
                    addXP={addXP}
                    addAchievement={addAchievement}
                />
            </div>
        );
    }

    return null;
};

export default StoryLoader;
