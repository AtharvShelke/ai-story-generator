import {useParams, useNavigate} from "react";
import LoadingStatus from "./LoadingStatus";
import StoryGame from "./StoryGame";

const API_BASE_URL = "/api";

const StoryLoader = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        loadStory(id);
    },[id])

    const loadStory = async (storyId)=>{
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/stories/${storyId}/complete`);
            if (!response.ok) {
                throw new Error(`Error fetching story: ${response.statusText}`);
            }
            const data = await response.json();
            setStory(data);
            

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    }
    const createNewStory = () => {
        navigate("/");
    }
    if (loading) {
        return <LoadingStatus theme={"story"}/>
    }
    if (error) {
        return(
            <div className="story-loader">
                <div className="error-message">
                    <h3>Story not found</h3>
                    <p>{error}</p>
                </div>
            </div>
        )
    }
    if (story) {
        return (
            <div className="story-loader">
                <StoryGame story={story} onNewStory={createNewStory}/>
            </div>
        )
        
    }
  
}

export default StoryLoader