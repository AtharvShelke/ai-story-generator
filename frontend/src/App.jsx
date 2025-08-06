import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StoryLoader from './components/StoryLoader';
import StoryGenerator from './components/StoryGenerator';

const App = () => {
  const [userXP, setUserXP] = useState(() => {
    const savedXP = localStorage.getItem('userXP');
    return savedXP ? parseInt(savedXP) : 0;
  });

  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem('achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : [];
  });

  useEffect(() => {
    localStorage.setItem('userXP', userXP.toString());
  }, [userXP]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  const addXP = (amount) => {
    setUserXP(prev => prev + amount);
  };

  const addAchievement = (achievement) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
    }
  };

  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 5; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      );
    }
    return particles;
  };

  return (
    <Router>
      <div className="app-container">
        {createParticles()}
        <header className="glass-card">
          <h1 className="glitch">
            🚀 Interactive AI Story Generator
          </h1>
          <div className="user-stats">
            <div className="xp-container">
              <span>XP: {userXP}</span>
              <div className="xp-bar">
                <div 
                  className="xp-fill" 
                  style={{ width: `${(userXP % 100)}%` }}
                ></div>
              </div>
              <span>Level {Math.floor(userXP / 100) + 1}</span>
            </div>
            {achievements.length > 0 && (
              <div className="achievements">
                {achievements.map((achievement, index) => (
                  <span key={index} className="achievement">
                    {achievement}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span>⚡ The backend is hosted on Render - Epic adventures await!</span>
          <span>🌟 Database powered by Aiven - Your stories live in the cloud!</span>
        </header>
        <main>
          <Routes>
            <Route 
              path="/story/:id" 
              element={<StoryLoader addXP={addXP} addAchievement={addAchievement} />}
            />
            <Route 
              path="/" 
              element={<StoryGenerator addXP={addXP} addAchievement={addAchievement} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
