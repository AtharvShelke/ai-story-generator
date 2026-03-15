import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient.js';
import { useAuthStore } from '../store/useAuthStore.js';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Step 1: Create Account
            await axiosClient.post('/auth/register', { username, email, password });

            // Step 2: Auto-auth sequence
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
            setError(err.response?.data?.detail || 'REGISTRATION_FAILURE: PROCESS_ABORTED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '480px', margin: '6rem auto', padding: '0 2rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel" 
                style={{ padding: '3rem', position: 'relative' }}
            >
                {/* Visual Technical Accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderRight: '1px solid var(--brand)', borderTop: '1px solid var(--brand)', opacity: 0.5 }} />

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--brand)', letterSpacing: '0.2em' }}>
                        [ REGISTRATION_PROTOCOL ]
                    </span>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', textTransform: 'uppercase', fontWeight: '800', lineHeight: 1.1 }}>
                        Create_New_Entity
                    </h2>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mono"
                        style={{ 
                            color: 'var(--danger)', 
                            marginBottom: '2rem', 
                            padding: '1rem', 
                            background: 'rgba(255, 69, 58, 0.05)', 
                            border: '1px solid var(--danger)', 
                            fontSize: '0.75rem'
                        }}
                    >
                        &gt; {error}
                    </motion.div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                            ENTITY_NAME
                        </label>
                        <input
                            type="text"
                            placeholder="CHOOSE_USERNAME..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input mono"
                            required
                            minLength={3}
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>

                    <div>
                        <label className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                            CONTACT_UPLINK
                        </label>
                        <input
                            type="email"
                            placeholder="EMAIL_ADDRESS..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input mono"
                            required
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>

                    <div>
                        <label className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                            SECURE_KEY
                        </label>
                        <input
                            type="password"
                            placeholder="MIN_6_CHARACTERS"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input mono"
                            required
                            minLength={6}
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="button-primary"
                        style={{ marginTop: '1.5rem', width: '100%', padding: '1.1rem' }}
                    >
                        {loading ? 'INITIALIZING...' : 'EXECUTE_REGISTRATION →'}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                    <p className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>
                        EXISTING_DATA_LINK?{' '}
                        <Link to="/login" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: '700' }}>
                            SIGN_IN_PROMPT
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Global Encryption Status footer */}
            <div className="mono" style={{ marginTop: '1.5rem', fontSize: '0.55rem', color: '#333', textAlign: 'center', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                Secure_Handshake_Active // Node_v3.0.1
            </div>
        </div>
    );
};

export default Register;