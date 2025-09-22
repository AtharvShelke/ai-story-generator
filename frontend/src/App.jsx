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

  // Professional layout: remove decorative particles

  return (
    <Router>
      <div className="app-shell">
        <header className="site-header panel">
          <div className="brand">
            <span className="brand-mark" />
            <span className="brand-title">AI Story Generator</span>
          </div>
          <div className="header-meta">
            <span>XP {userXP}</span>
            <div style={{width:120}}>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${(userXP % 100)}%` }} />
              </div>
            </div>
            <span>Level {Math.floor(userXP / 100) + 1}</span>
          </div>
        </header>
        <main className="site-main">
          <Routes>
            <Route path="/story/:id" element={<StoryLoader addXP={addXP} addAchievement={addAchievement} />} />
            <Route path="/" element={<StoryGenerator addXP={addXP} addAchievement={addAchievement} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
