import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient.js';
import { useAuthStore } from '../store/useAuthStore.js';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await axiosClient.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const token = res.data.access_token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const meRes = await axiosClient.get('/auth/me', config);

            setAuth(meRes.data, token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'AUTH_FAILURE: INVALID_CREDENTIALS');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '440px', margin: '8rem auto', padding: '0 2rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel" 
                style={{ padding: '3rem', position: 'relative' }}
            >
                {/* Visual Accent */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '2px', background: 'var(--brand)' }} />

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--brand)', letterSpacing: '0.2em' }}>
                        [ ACCESS_CONTROL ]
                    </span>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', textTransform: 'uppercase', fontWeight: '800' }}>
                        Identify_User
                    </h2>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mono"
                        style={{ 
                            color: 'var(--danger)', 
                            marginBottom: '2rem', 
                            padding: '1rem', 
                            background: 'rgba(255, 69, 58, 0.05)', 
                            border: '1px solid var(--danger)', 
                            fontSize: '0.75rem',
                            textAlign: 'center'
                        }}
                    >
                        &gt; {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                            USER_ID
                        </label>
                        <input
                            type="text"
                            placeholder="INPUT_USERNAME..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input mono"
                            style={{ fontSize: '0.9rem', padding: '12px' }}
                            required
                        />
                    </div>

                    <div>
                        <label className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                            SECURE_KEY
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input mono"
                            style={{ fontSize: '0.9rem', padding: '12px' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="button-primary"
                        style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}
                    >
                        {loading ? 'UPLINKING...' : 'ESTABLISH_SESSION →'}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                    <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>
                        NEW_ENTITY?{' '}
                        <Link to="/register" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: '700' }}>
                            REGISTER_HERE
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Sub-labeling for "aesthetic" depth */}
            <div className="mono" style={{ marginTop: '1.5rem', fontSize: '0.6rem', color: '#222', textAlign: 'center', letterSpacing: '0.3em' }}>
                NEURAL_STORY_LAB_ENCRYPTION_ACTIVE
            </div>
        </div>
    );
};

export default Login;