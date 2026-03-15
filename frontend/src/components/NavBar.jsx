import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosClient.post('/auth/logout');
        } catch (e) {
            console.error('Logout failed on backend', e);
        } finally {
            logout();
            navigate('/');
        }
    };

    return (
        <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.25rem 2rem', 
            background: 'var(--bg)', 
            borderBottom: '1px solid var(--border)', 
            position: 'sticky', 
            top: 0, 
            zIndex: 100,
            backdropFilter: 'blur(12px)'
        }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                {/* Brand Identity */}
                <Link to="/" style={{ 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px' 
                }}>
                    <div className="brand-mark" style={{ width: '12px', height: '12px', background: 'var(--brand)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                    <span className="mono" style={{ 
                        color: 'var(--text)', 
                        fontWeight: '700', 
                        fontSize: '1.1rem', 
                        letterSpacing: '-0.05em',
                        textTransform: 'uppercase'
                    }}>
                        AI_STORY<span style={{ color: 'var(--brand)' }}>.</span>LAB
                    </span>
                </Link>

                <nav style={{ display: 'flex', gap: '2rem' }}>
                    <Link to="/" className="nav-link-modern">Home</Link>
                    {user && <Link to="/generate" className="nav-link-modern">Protocol_Alpha</Link>}
                </nav>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        {/* Profile Pill */}
                        <Link to="/profile" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            background: 'rgba(255,255,255,0.03)', 
                            padding: '6px 14px', 
                            borderRadius: '4px', 
                            textDecoration: 'none', 
                            border: '1px solid var(--border)',
                            transition: 'all 0.2s ease'
                        }} className="nav-profile-pill">
                            <span style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{user.username}</span>
                            <div style={{ width: '1px', height: '12px', background: 'var(--border)' }}></div>
                            <span className="mono" style={{ color: 'var(--brand)', fontWeight: '700', fontSize: '0.85rem' }}>
                                {user.points} XP
                            </span>
                        </Link>
                        
                        <button onClick={handleLogout} className="logout-btn-minimal">
                            Terminate
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link-modern" style={{ marginRight: '1rem' }}>Login</Link>
                        <Link to="/register" className="button-primary" style={{ 
                            textDecoration: 'none', 
                            padding: '10px 20px', 
                            fontSize: '0.8rem' 
                        }}>
                            Get_Access
                        </Link>
                    </>
                )}
            </div>

            <style>{`
                .nav-link-modern {
                    text-decoration: none;
                    color: var(--muted);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    transition: color 0.2s ease;
                }
                .nav-link-modern:hover {
                    color: var(--brand);
                }
                .nav-profile-pill:hover {
                    border-color: var(--muted);
                    background: rgba(255,255,255,0.05);
                }
                .logout-btn-minimal {
                    background: transparent;
                    border: none;
                    color: #555;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: color 0.2s ease;
                    padding: 0;
                }
                .logout-btn-minimal:hover {
                    color: var(--danger);
                }
            `}</style>
        </header>
    );
};

export default Navbar;