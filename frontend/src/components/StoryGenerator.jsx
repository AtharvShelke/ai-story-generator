import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils.js';
import { useEffect, useState } from 'react';
import ThemeInput from './ThemeInput.jsx';
import LoadingStatus from './LoadingStatus.jsx';
import axios from 'axios';

const StoryGenerator = () => {
  const navigate = useNavigate()
  const [theme, setTheme] = useState("");
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let pullInterval;
    if (jobId && jobStatus === "processing") {
      pullInterval = setInterval(()=>{
        pullJobStatus(jobId)
      }, 5000)
    }
    return ()=>{
      if (pullInterval) {
        clearInterval(pullInterval)
      }
    }
  },[jobId, jobStatus])

  const generateStory = async (theme) => {
    setLoading(true);
    setError(null);
    setTheme(theme);
    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/stories/create`, {theme});
      const {job_id, status} = response.data;
      setJobId(job_id);
      setJobStatus(status);
      pullJobStatus(job_id);

    } catch (error) {
      setLoading(false)
      setError(`failed to generate story: ${error.message}`)
    }
  }

  const pullJobStatus = async (id) => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/jobs/${id}`);
      const { status, story_id, error: jobError } = response.data;
      setJobStatus(status);
      if (status === "completed" && story_id) {
        fetchStory(story_id);
      } else if (status === "failed" || jobError) {
        setError(jobError);
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setError(`failed to check story status: ${error.message}`)
        setLoading(false);
      }
    }
  }

  const fetchStory = async (id) => {
    try {
      setLoading(false);
      setJobStatus("completed");
      navigate(`/story/${id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const reset = () => {
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setTheme("");
    setLoading(false);

  }
  return (
    <div className='story-generator'>
      {error && (
        <div className='error-message'>
          <p>{error}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
      {!jobId && !loading && !error && (
        <ThemeInput onSubmit={generateStory}/>
      )}
      {loading && <LoadingStatus theme={"theme"} />}
    </div>
  )
}

export default StoryGenerator