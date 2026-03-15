import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';

// --- Helper Logic ---
const getStoryPreview = (story) => {
    const content = story?.root_node?.content;
    if (!content) return 'ARCHIVE_DATA_MISSING';
    return content.length > 140 ? content.substring(0, 140) + '...' : content;
};

const countNodes = (story) => story?.all_nodes ? Object.keys(story.all_nodes).length : 0;

const hasWinningEnd = (story) => {
    if (!story?.all_nodes) return false;
    return Object.values(story.all_nodes).some(n => n.is_winning_ending);
};

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await axiosClient.get('/stories/me');
                setStories(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, [user]);

    if (!user) {
        return (
            <div className="mono" style={{ textAlign: 'center', marginTop: '10rem', color: 'var(--brand)', fontSize: '0.8rem' }}>
                &gt; INITIALIZING_USER_DATA...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
            
            {/* ── USER_PROFILE_HEADER (Bento Style) ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1rem',
                    marginBottom: '4rem'
                }}
            >
                {/* Main ID Block */}
                <div className="panel" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flex: 2 }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--panel-elev)',
                        border: '1px solid var(--brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'var(--brand)',
                        borderRadius: '2px'
                    }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--brand)', letterSpacing: '0.2em' }}>[ NEURAL_IDENTITY ]</span>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.2rem 0' }}>{user.username}</h1>
                        <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>LEVEL: APPRENTICE_NARRATOR</p>
                    </div>
                </div>

                {/* XP Stats Block */}
                <div className="panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.2em' }}>ACCUMULATED_XP</span>
                    <div className="mono" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--brand)', margin: '0.5rem 0' }}>
                        {user.points.toLocaleString()}
                    </div>
                    <div style={{ width: '100%', height: '2px', background: 'var(--border)', position: 'relative' }}>
                        <div style={{ width: '65%', height: '100%', background: 'var(--brand)', boxShadow: '0 0 10px var(--brand)' }} />
                    </div>
                </div>
            </motion.div>

            {/* ── SECTION_HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 className="mono" style={{ fontSize: '0.85rem', color: 'var(--text)', letterSpacing: '0.2em' }}>
                    &gt; ARCHIVE_CHRONICLES ({stories.length})
                </h2>
                <Link to="/generate" className="mono" style={{ fontSize: '0.7rem', color: 'var(--brand)', textDecoration: 'none' }}>+ INITIALIZE_NEW_SIMULATION</Link>
            </div>

            {loading ? (
                <div className="mono" style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
                    ACCESSING_ARCHIVE_DATABANKS...
                </div>
            ) : stories.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '6rem 2rem', borderStyle: 'dashed' }}>
                    <p className="mono" style={{ color: 'var(--muted)', marginBottom: '2rem' }}>NO_DATA_FOUND: ARCHIVE_IS_EMPTY</p>
                    <Link to="/generate" className="button-primary">Begin_First_Protocol</Link>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                        gap: '1rem' 
                    }}
                >
                    {stories.map((story) => {
                        const nodeCount = countNodes(story);
                        const won = hasWinningEnd(story);
                        
                        return (
                            <motion.div key={story.id} variants={cardVariants}>
                                <Link to={`/story/${story.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="profile-story-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', flex: 1 }}>
                                                {story.title || 'UNNAMED_OBJECTIVE'}
                                            </h3>
                                            <span className="mono" style={{ 
                                                fontSize: '0.65rem', 
                                                padding: '4px 8px', 
                                                background: won ? 'rgba(204, 255, 0, 0.1)' : 'var(--panel-elev)',
                                                border: `1px solid ${won ? 'var(--brand)' : 'var(--border)'}`,
                                                color: won ? 'var(--brand)' : 'var(--muted)'
                                            }}>
                                                {won ? 'STATUS: SUCCESS' : 'STATUS: ACTIVE'}
                                            </span>
                                        </div>

                                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '1rem 0', lineHeight: '1.6', height: '3.2rem', overflow: 'hidden' }}>
                                            {getStoryPreview(story)}
                                        </p>

                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            marginTop: 'auto', 
                                            paddingTop: '1rem', 
                                            borderTop: '1px solid var(--border)' 
                                        }}>
                                            <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                                                NODES_PROCESSED: <span style={{ color: 'var(--text)' }}>{nodeCount}</span>
                                            </div>
                                            <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                                                {new Date(story.created_at).toLocaleDateString('en-GB').replace(/\//g, '.')}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            <style>{`
                .profile-story-card {
                    background: var(--panel);
                    border: 1px solid var(--border);
                    padding: 1.5rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border-radius: 4px;
                }
                .profile-story-card:hover {
                    border-color: var(--brand);
                    background: #151a00;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default Profile;