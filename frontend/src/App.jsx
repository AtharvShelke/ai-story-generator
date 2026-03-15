import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added for modern transitions
import axiosClient from './api/axiosClient';
import StoryLoader from './components/StoryLoader';
import StoryGenerator from './components/StoryGenerator';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// Component to handle page transition logic
const AnimatedRoutes = ({ addXP, addAchievement }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          } 
        />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/generate" 
            element={
              <PageWrapper>
                <StoryGenerator addXP={addXP} addAchievement={addAchievement} />
              </PageWrapper>
            } 
          />
          <Route 
            path="/story/:id" 
            element={
              <PageWrapper>
                <StoryLoader addXP={addXP} addAchievement={addAchievement} />
              </PageWrapper>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PageWrapper>
                <Profile />
              </PageWrapper>
            } 
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// Simple wrapper for smooth fade-in transitions between pages
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const { setAuth, logout, token, setUser } = useAuthStore();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axiosClient.get('/auth/me');
          setAuth(res.data, token);
        } catch (err) {
          logout();
        }
      }
    };
    fetchUser();
  }, [setAuth, logout, token]);

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
    const user = useAuthStore.getState().user;
    if (user) {
        setUser({...user, points: user.points + amount});
    }
  };

  const addAchievement = (achievement) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
    }
  };

  return (
    <Router>
      <div 
        className="app-shell" 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          background: 'var(--bg)', // Now uses the Noir Black from index.css
          color: 'var(--text)', 
          fontFamily: "'Inter', sans-serif",
          transition: 'background 0.5s ease'
        }}
      >
        <Navbar />
        
        <main 
          className="site-main" 
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {/* Noise overlay for extra "AI/Modern" texture */}
          <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.02,
            zIndex: 9999,
            background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
          }} />

          <AnimatedRoutes addXP={addXP} addAchievement={addAchievement} />
        </main>
      </div>
    </Router>
  );
};

export default App;