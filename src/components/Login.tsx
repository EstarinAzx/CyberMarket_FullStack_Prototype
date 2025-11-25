import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
    const { login, signup } = useStore();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('IDENTITY REQUIRED');
            return;
        }

        if (!password.trim()) {
            setError('ACCESS CODE REQUIRED');
            return;
        }

        if (isLogin) {
            const result = await login(username, password);
            if (!result.success) setError(result.message);
        } else {
            const result = await signup(username, password);
            if (!result.success) setError(result.message);
        }
    };

    return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="crt-overlay"></div>
            <div className="scanline"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'rgba(10, 10, 10, 0.95)',
                    border: '2px solid #00f3ff',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '450px',
                    position: 'relative',
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="glitch" data-text="CYBER_MARKET" style={{
                        fontFamily: 'Orbitron',
                        color: '#00f3ff',
                        fontSize: '2.5rem',
                        marginBottom: '10px'
                    }}>CYBER_MARKET</h1>
                    <div style={{ color: '#ff0055', letterSpacing: '3px' }}>AUTHENTICATION REQUIRED</div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#ffe600', marginBottom: '5px', fontFamily: 'Orbitron' }}>
                            NETRUNNER_ID
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0, 243, 255, 0.1)',
                                border: '1px solid #333',
                                padding: '15px',
                                color: '#fff',
                                fontFamily: 'Rajdhani',
                                fontSize: '1.2rem',
                                outline: 'none'
                            }}
                            placeholder="ENTER ALIAS..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#ffe600', marginBottom: '5px', fontFamily: 'Orbitron' }}>
                            ACCESS_CODE
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0, 243, 255, 0.1)',
                                border: '1px solid #333',
                                padding: '15px',
                                color: '#fff',
                                fontFamily: 'Rajdhani',
                                fontSize: '1.2rem',
                                outline: 'none'
                            }}
                            placeholder="ENTER PASSPHRASE..."
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#ff0055',
                            background: 'rgba(255, 0, 85, 0.1)',
                            padding: '10px',
                            borderLeft: '3px solid #ff0055',
                            fontFamily: 'Orbitron',
                            fontSize: '0.9rem'
                        }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button className="cyber-btn" style={{ marginTop: '10px' }}>
                        {isLogin ? 'ESTABLISH LINK' : 'INITIALIZE NEW ID'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#00f3ff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontFamily: 'Rajdhani',
                            fontSize: '1rem'
                        }}
                    >
                        {isLogin ? 'NO ID? REGISTER NEW LINK' : 'ALREADY REGISTERED? LOGIN'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
