import React from 'react';
import { Music, Disc } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/login';
    };

    return (
        <div className="login-page">
            {/* Dynamic Visual Layer */}
            <div className="visual-field">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="login-content fade-in">
                <header className="login-header">
                    <div className="hero-badge">
                        <Disc size={14} className="rotating" />
                        <span>INTELLIGENT SEQUENCING</span>
                    </div>
                    <h1 className="hero-title">
                        Weave<span>.</span>IO
                    </h1>
                    <p className="hero-subtitle">
                        Crafting the perfect set with harmonic precision and energy tiers.
                    </p>
                </header>

                <section className="login-card-container">
                    <div className="login-card glass">
                        <div className="card-top">
                            <div className="logo-box">
                                <Music size={28} color="white" strokeWidth={2.5} />
                            </div>
                            <h3>Connect to Begin</h3>
                            <p>Sign in with Spotify to access your playlists and start weaving.</p>
                        </div>

                        <button onClick={handleLogin} className="spotify-auth-btn">
                            <span className="btn-icon">
                                <Music size={18} fill="currentColor" />
                            </span>
                            <span>Connect Spotify</span>
                        </button>

                        <div className="hero-features">
                            <div className="feature"><div className="dot"></div> Harmonic Adjacency</div>
                            <div className="feature"><div className="dot"></div> BPM Continuity</div>
                            <div className="feature"><div className="dot"></div> Energy Curves</div>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="login-footer">
                <div className="footer-line"></div>
                <p>V1.0 MVP — Precision Curation Layer</p>
            </footer>
        </div>
    );
};

export default Login;
