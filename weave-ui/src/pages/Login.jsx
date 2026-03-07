import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Disc } from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Explicitly check for Supabase OAuth hash fragments
        if (window.location.hash && window.location.hash.includes('access_token')) {
            // Let Supabase process the token in the URL first
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) navigate('/dashboard', { replace: true });
            });
        } else {
            // Normal session check
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) navigate('/dashboard', { replace: true });
            });
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate('/dashboard', { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: 'user-read-private playlist-read-private playlist-modify-public playlist-modify-private',
            },
        });

        if (error) {
            console.error('Login error:', error.message);
            alert('Authentication failed. Check your Supabase configuration.');
        }
    };

    return (
        <div className="login-page">
            {/* Mesh Gradient Background */}
            <div className="visual-field">
                <div className="mesh-sphere sphere-purple"></div>
                <div className="mesh-sphere sphere-blue"></div>
                <div className="mesh-sphere sphere-teal"></div>
                <div className="grid-overlay"></div>
                <div className="noise-filter"></div>
            </div>

            <div className="login-content">
                <header className="login-header">
                    <div className="hero-badge">
                        <div className="rotating-disc"></div>
                        <span>Intelligent Sequencing</span>
                    </div>
                    <h1 className="hero-title">
                        Weave<span>.</span>IO
                    </h1>
                    <p className="hero-subtitle">
                        Perfecting your mix with harmonic intelligence and curated energy profiles.
                    </p>
                </header>

                <section className="login-card-container">
                    <div className="login-card glass">
                        <div className="card-top">
                            <div className="logo-glow-box">
                                <Music size={26} color="white" strokeWidth={2.5} />
                            </div>
                            <h3>Join the curation</h3>
                            <p>Connect your Spotify account to start generating harmonically optimized sets.</p>
                        </div>

                        <button onClick={handleLogin} className="spotify-auth-btn">
                            <Music size={18} fill="currentColor" />
                            <span>Connect Spotify</span>
                        </button>

                        <div className="hero-features">
                            <div className="feature"><div className="dot"></div> HARMONIC</div>
                            <div className="feature"><div className="dot"></div> ENERGY</div>
                            <div className="feature"><div className="dot"></div> BPM</div>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="login-footer">
                <p>Powered by Supabase · Intelligence v2.1</p>
            </footer>
        </div>
    );
};

export default Login;
