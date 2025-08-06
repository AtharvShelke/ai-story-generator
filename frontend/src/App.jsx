import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import StoryLoader from './components/StoryLoader';
import StoryGenerator from './components/StoryGenerator';

const App = () => {
  return (
    
    <Router>
      <div className="app-container">
        <header>
          <h1>
            Interactive AI Story Generator
          </h1>
          <span>The backend is hosted on Render so there may be delay in loading the story (60 seconds or more depending on the inactivity)</span>
        </header>
        <main>
          <Routes>
            <Route path={"/story/:id"} element={<StoryLoader/>}/>
            <Route path={"/"} element={<StoryGenerator/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App