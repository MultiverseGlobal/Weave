import React from 'react';
import { Music } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
    const handleLogin = () => {
        // Connect to the backend login route
        window.location.href = 'http://localhost:3001/auth/login';
    };

    return (
        <div className="login-page">
            <div className="waveform-container">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="wave-bar"
                        style={{
                            animationDelay: `${i * 0.05}s`,
                            height: `${Math.random() * 50 + 20}%`
                        }}
                    />
                ))}
            </div>

            <div className="login-content fade-in">
                <div className="logo-section">
                    <div className="logo-icon">
                        <Music size={40} strokeWidth={1.5} color="var(--color-accent)" />
                    </div>
                    <h1>Weave IO</h1>
                    <p className="tagline">Where music becomes a set.</p>
                </div>

                <div className="info-card glass">
                    <p>Iterate on your playlists with harmonic precision. Sequence tracks by BPM, energy, and key adjacency.</p>
                    <button onClick={handleLogin} className="login-button">
                        <span>Connect Spotify</span>
                    </button>
                </div>
            </div>

            <div className="login-footer">
                <p>© 2026 Weave IO. Precision curation.</p>
            </div>
        </div>
    );
};

export default Login;
