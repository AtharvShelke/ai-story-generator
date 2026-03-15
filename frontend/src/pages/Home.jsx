import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axiosClient.js';

// --- Global Theme Constants ---
const THEME = {
    colors: {
        bg: '#050505',
        card: '#111111',
        border: '#222222',
        accent: '#CCFF00', // Cyber Lime
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1AA',
    },
    fonts: {
        display: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
    }
};

// --- Sub-Components ---

const LeaderNode = ({ user, rank }) => {
    const isFirst = rank === 1;
    const colors = {
        1: THEME.colors.accent,
        2: '#FFFFFF',
        3: '#A1A1AA',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: isFirst ? '2.5rem' : '1.5rem',
                background: THEME.colors.card,
                border: `1px solid ${isFirst ? colors[1] : THEME.colors.border}`,
                borderRadius: '4px',
                flex: isFirst ? 1.4 : 1,
                minWidth: '240px',
                overflow: 'hidden'
            }}
        >
            {isFirst && (
                <motion.div
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent, rgba(204, 255, 0, 0.05), transparent)',
                        pointerEvents: 'none'
                    }}
                />
            )}

            <div className="mono" style={{ 
                position: 'absolute', top: '12px', left: '12px', 
                fontSize: '0.7rem', color: isFirst ? colors[1] : THEME.colors.textSecondary,
                letterSpacing: '0.1em'
            }}>
                [ RANK_0{rank} ]
            </div>

            <div style={{
                width: isFirst ? '80px' : '60px',
                height: isFirst ? '80px' : '60px',
                border: `1px solid ${isFirst ? colors[1] : THEME.colors.border}`,
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                marginTop: '1rem',
                background: isFirst ? 'rgba(204, 255, 0, 0.03)' : 'transparent'
            }}>
                <div style={{ transform: 'rotate(-45deg)', fontWeight: '800', fontSize: isFirst ? '1.5rem' : '1.1rem' }}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
            </div>

            <div style={{ textAlign: 'center', zIndex: 1 }}>
                <h3 style={{ fontSize: isFirst ? '1.5rem' : '1.1rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                    {user.username}
                </h3>
                <div className="mono" style={{ color: isFirst ? colors[1] : THEME.colors.textSecondary, fontSize: '0.85rem' }}>
                    {user.points.toLocaleString()} <span style={{ opacity: 0.5 }}>XP</span>
                </div>
            </div>

            {isFirst && (
                <div style={{
                    marginTop: '1.5rem', padding: '4px 12px', border: `1px solid ${colors[1]}`,
                    fontSize: '0.6rem', color: colors[1], fontWeight: 'bold', letterSpacing: '0.2em'
                }} className="mono">
                    TOP_DOMAIN_NODE
                </div>
            )}
        </motion.div>
    );
};

const LeadershipSection = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosClient.get('/leaderboard/top/10');
                setLeaderboard(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3, 10);

    return (
        <section style={{ maxWidth: '1100px', margin: '8rem auto', padding: '0 2rem' }}>
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                marginBottom: '4rem', borderLeft: `4px solid ${THEME.colors.accent}`, paddingLeft: '1.5rem'
            }}>
                <div>
                    <h2 className="mono" style={{ fontSize: '0.75rem', color: THEME.colors.accent, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                        [ Sector_Command_Leaders ]
                    </h2>
                    <p style={{ color: THEME.colors.textSecondary, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Entities with highest narrative synthesis score.
                    </p>
                </div>
                <div className="mono" style={{ fontSize: '0.7rem', color: THEME.colors.textSecondary, textAlign: 'right' }}>
                    STATUS: <span style={{ color: THEME.colors.accent }}>SYNCED_LIVE</span><br/>
                    REGION: GLOBAL_O1
                </div>
            </div>

            {loading ? (
                <div className="mono" style={{ padding: '10rem 0', textAlign: 'center', color: THEME.colors.accent }}>
                    &gt; ACCESSING_LEADERSHIP_REGISTRY...
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {top3[1] && <LeaderNode user={top3[1]} rank={2} />}
                        {top3[0] && <LeaderNode user={top3[0]} rank={1} />}
                        {top3[2] && <LeaderNode user={top3[2]} rank={3} />}
                    </div>

                    <div style={{ marginTop: '1rem', background: THEME.colors.card, border: `1px solid ${THEME.colors.border}`, borderRadius: '4px' }}>
                        {rest.map((user, i) => (
                            <motion.div
                                key={user.id}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)', x: 5 }}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '1.25rem 2rem',
                                    borderBottom: i === rest.length - 1 ? 'none' : `1px solid ${THEME.colors.border}`,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span className="mono" style={{ width: '60px', color: THEME.colors.textSecondary, fontSize: '0.8rem' }}>0{i + 4}</span>
                                <span style={{ flex: 1, fontWeight: '600', letterSpacing: '-0.02em' }}>{user.username}</span>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="mono" style={{ color: THEME.colors.accent, fontSize: '0.9rem' }}>{user.points.toLocaleString()}</span>
                                    <span className="mono" style={{ fontSize: '0.6rem', color: THEME.colors.textSecondary, marginLeft: '8px' }}>XP</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

// --- Main Home Component ---

const Home = () => {
    return (
        <div style={{ backgroundColor: THEME.colors.bg, color: THEME.colors.textPrimary, minHeight: '100vh', fontFamily: THEME.fonts.display }}>
            
            {/* ── HERO SECTION ── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 2rem 6rem', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: '2.5rem', textTransform: 'uppercase' }}>
                        Infinite <span style={{ color: THEME.colors.accent }}>Worlds</span><br/>
                        Await You.
                    </h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: THEME.colors.textSecondary, fontSize: '1.2rem', lineHeight: 1.5 }}>
                        The first AI-driven divergent storytelling engine. Create, explore, and dominate the ranks of the elite.
                    </p>
                    <Link to="/generate" className="modern-button">Launch Protocol →</Link>
                </motion.div>
            </section>

            {/* ── METHODOLOGY SECTION ── */}
            <section style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { step: '01', title: 'Input Parameters', desc: 'Define your narrative seed. From cyberpunk distopias to high-fantasy realms, the engine accepts any thematic input.' },
                        { step: '02', title: 'Neural Synthesis', desc: 'Our AI model constructs a coherent world, characters, and an opening gambit based on your specific parameters.' },
                        { step: '03', title: 'Divergent Choice', desc: 'Every decision ripples. Your choices fragment the story into unique timelines. No two adventures are identical.' }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ borderColor: THEME.colors.accent }}
                            style={{ padding: '2.5rem', background: THEME.colors.card, border: `1px solid ${THEME.colors.border}`, borderRadius: '4px', transition: 'border-color 0.3s' }}
                        >
                            <div className="mono" style={{ color: THEME.colors.accent, fontSize: '0.8rem', marginBottom: '1rem' }}>[ PROTOCOL_{item.step} ]</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{item.title}</h3>
                            <p style={{ color: THEME.colors.textSecondary, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── BENTO FEATURES ── */}
            <section style={{ maxWidth: '1100px', margin: '8rem auto', padding: '0 2rem' }}>
                <div style={{ marginBottom: '4rem' }}>
                    <h2 className="mono" style={{ fontSize: '0.75rem', color: THEME.colors.accent, letterSpacing: '0.3em' }}>[ SYSTEM_CAPABILITIES ]</h2>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.04em' }}>Engineered for Total Immersion.</p>
                </div>

                <div className="bento-grid">
                    <div className="bento-item large">
                        <h4 className="mono accent">CORE_ENGINE</h4>
                        <h3>Neural Narrative Model</h3>
                        <p>Powered by state-of-the-art networks, generating context-aware prose that remembers your past actions and character traits.</p>
                        <div className="bento-bg-text">AI</div>
                    </div>

                    <div className="bento-item small accent-bg">
                        <h4 className="mono dark">RANKING_SYSTEM</h4>
                        <h3 className="dark">Global XP Ledger</h3>
                        <p className="dark">Earn XP for every choice made. Climb the nodes to achieve Domain Dominance.</p>
                    </div>

                    <div className="bento-item small">
                        <h4 className="mono accent">PERSISTENCE</h4>
                        <h3>Archive Vault</h3>
                        <p>Every story is permanent. Revisit chronicles and share divergent paths with other entities.</p>
                    </div>

                    <div className="bento-item medium quote">
                        <h3>"The most advanced text-adventure interface ever engineered."</h3>
                        <p className="mono accent">[ VERIFIED_USER_FEEDBACK ]</p>
                    </div>
                </div>
            </section>

            {/* ── LEADERSHIP SECTION ── */}
            <LeadershipSection />

            {/* ── FINAL CTA ── */}
            <section style={{ padding: '10rem 2rem', textAlign: 'center', borderTop: `1px solid ${THEME.colors.border}`, background: 'linear-gradient(to bottom, #050505, #0a0a0a)' }}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.05em' }}>READY TO BEGIN?</h2>
                <Link to="/register" className="modern-button">Initialize Account</Link>
                <p className="mono" style={{ marginTop: '3rem', color: THEME.colors.textSecondary, fontSize: '0.7rem', letterSpacing: '0.2em' }}>
                    CONNECTION_SECURE // NEURAL_GATE_OPEN // NODE_v3.0.1
                </p>
            </section>

            <style>{`
                .modern-button {
                    display: inline-block;
                    padding: 1.25rem 2.5rem;
                    background: ${THEME.colors.accent};
                    color: #000;
                    text-decoration: none;
                    font-weight: 800;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .modern-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 40px rgba(204, 255, 0, 0.3);
                    filter: brightness(1.1);
                }
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    grid-auto-rows: 280px;
                    gap: 1rem;
                }
                .bento-item {
                    background: ${THEME.colors.card};
                    border: 1px solid ${THEME.colors.border};
                    padding: 2.5rem;
                    border-radius: 4px;
                    position: relative;
                    overflow: hidden;
                }
                .bento-item.large { grid-column: span 4; }
                .bento-item.small { grid-column: span 2; }
                .bento-item.medium { grid-column: span 3; }
                .bento-item.accent-bg { background: ${THEME.colors.accent}; color: #000; }
                .bento-item.quote { display: flex; flex-direction: column; justify-content: center; text-align: center; grid-column: span 6; height: 200px; }
                
                .mono.accent { color: ${THEME.colors.accent}; font-size: 0.7rem; letter-spacing: 0.2em; }
                .mono.dark { color: rgba(0,0,0,0.6); font-size: 0.7rem; letter-spacing: 0.2em; font-weight: 800; }
                .dark { color: #000; }
                
                .bento-item h3 { font-size: 1.8rem; margin-top: 1rem; letter-spacing: -0.03em; font-weight: 700; }
                .bento-item p { color: ${THEME.colors.textSecondary}; margin-top: 1rem; line-height: 1.6; }
                .bento-item.accent-bg p { color: rgba(0,0,0,0.7); font-weight: 600; }
                
                .bento-bg-text { position: absolute; right: -20px; bottom: -20px; fontSize: 10rem; opacity: 0.03; font-weight: 900; pointer-events: none; }

                @media (max-width: 900px) {
                    .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
                    .bento-item.large, .bento-item.small, .bento-item.medium { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

export default Home;