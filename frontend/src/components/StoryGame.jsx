import { useEffect, useState } from "react";

const StoryGame = ({ story, onNewStory, addXP, addAchievement }) => {
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [currentNode, setCurrentNode] = useState(null);
    const [options, setOptions] = useState([]);
    const [isEnding, setIsEnding] = useState(false);
    const [isWinningEnding, setIsWinningEnding] = useState(false);
    const [choiceCount, setChoiceCount] = useState(0);
    const [storyProgress, setStoryProgress] = useState(0);
    const [visitedNodes, setVisitedNodes] = useState(new Set());

    useEffect(() => {
        if (story && story.root_node) {
            const rootNodeId = story.root_node.id;
            setCurrentNodeId(rootNodeId);
            setChoiceCount(0);
            setVisitedNodes(new Set([rootNodeId]));
        }
    }, [story]);

    useEffect(() => {
        if (currentNodeId && story && story.all_nodes) {
            const node = story.all_nodes[currentNodeId];
            setCurrentNode(node);
            setIsEnding(node.is_ending);
            setIsWinningEnding(node.is_winning_ending);
            
            // Calculate story progress
            const totalNodes = Object.keys(story.all_nodes).length;
            const progress = (visitedNodes.size / totalNodes) * 100;
            setStoryProgress(Math.min(progress, 100));
            
            if (!node.is_ending && node.options && node.options.length > 0) {
                setOptions(node.options);
            } else {
                setOptions([]);
                
                // Award XP and achievements for completing story
                if (node.is_ending) {
                    if (addXP) {
                        const baseXP = isWinningEnding ? 50 : 25;
                        const bonusXP = Math.floor(choiceCount / 3) * 5; // Bonus for making more choices
                        addXP(baseXP + bonusXP);
                    }
                    
                    if (addAchievement) {
                        if (isWinningEnding) {
                            addAchievement("🏆 Victory Achieved");
                            if (choiceCount >= 10) {
                                addAchievement("🎯 Strategic Thinker");
                            }
                        } else {
                            addAchievement("📚 Story Complete");
                        }
                        
                        if (visitedNodes.size >= totalNodes * 0.8) {
                            addAchievement("🗺️ Explorer Supreme");
                        }
                    }
                }
            }
        }
    }, [currentNodeId, story, choiceCount, visitedNodes]);

    const chooseOption = (optionId) => {
        setCurrentNodeId(optionId);
        setChoiceCount(prev => prev + 1);
        setVisitedNodes(prev => new Set([...prev, optionId]));
        
        // Award XP for making choices
        if (addXP) {
            addXP(5);
        }
        
        // Check for achievement milestones
        if (addAchievement) {
            const newCount = choiceCount + 1;
            if (newCount === 5) {
                addAchievement("🎲 Decision Maker");
            } else if (newCount === 15) {
                addAchievement("🧠 Master Strategist");
            }
        }
    };

    const restartStory = () => {
        if (story && story.root_node) {
            setCurrentNodeId(story.root_node.id);
            setChoiceCount(0);
            setVisitedNodes(new Set([story.root_node.id]));
            setStoryProgress(0);
            
            if (addXP) {
                addXP(10);
            }
        }
    };

    const getTotalNodes = () => {
        return story?.all_nodes ? Object.keys(story.all_nodes).length : 0;
    };

    return (
        <div className="story-game panel section">
            <header className="story-header">
                <div className="story-title-section">
                    <h2>{story.title}</h2>
                    <div className="story-stats">
                        <span className="stat-item">Choices: {choiceCount}</span>
                        <span className="stat-item">Progress: {Math.round(storyProgress)}%</span>
                        <span className="stat-item">Explored: {visitedNodes.size}/{getTotalNodes()}</span>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="story-progress-container">
                    <div className="story-progress-bar">
                        <div 
                            className="story-progress-fill"
                            style={{ width: `${storyProgress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            <div className="story-content">
                {currentNode && (
                    <div className="story-node">
                        <div className="story-text-container">
                            <p className="story-text">{currentNode.content}</p>
                        </div>
                        
                        {isEnding ? (
                            <div className="story-ending">
                                <h3 className={`ending-title ${isWinningEnding ? 'victory' : 'normal'}`}>
                                    {isWinningEnding ? "Victory" : "The End"}
                                </h3>
                                <p className="ending-message">
                                    {isWinningEnding 
                                        ? "Congratulations! You've reached the best outcome." 
                                        : "Your journey has reached its conclusion."}
                                </p>
                                
                                <div className="ending-stats">
                                    <div className="stat-card">
                                        <span className="stat-value">{choiceCount}</span>
                                        <span className="stat-label">Choices</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{visitedNodes.size}</span>
                                        <span className="stat-label">Nodes Visited</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{isWinningEnding ? 50 : 25}+</span>
                                        <span className="stat-label">XP</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="story-options">
                                <h3 className="options-title">Next step</h3>
                                <div className="options-list">
                                    {options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => chooseOption(option.node_id)}
                                            className="option-btn"
                                        >
                                            <span className="option-number">{index + 1}</span>
                                            <span className="option-text">{option.text}</span>
                                            <span className="option-arrow">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="story-controls cluster" style={{justifyContent:'center'}}>
                    <button onClick={restartStory} className="control-btn restart-btn button-ghost">
                        Restart
                    </button>
                    {onNewStory && (
                        <button onClick={onNewStory} className="control-btn new-story-btn button-primary">
                            New story
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryGame;
