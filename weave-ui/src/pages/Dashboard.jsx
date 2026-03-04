import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, User, LogOut, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
// Assuming we'll migrate getPlaylists to use Supabase later,
// for now keeping the structure but checking session
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/');
            return;
        }
        setUser(session.user);
        // Placeholder until we wire up the Spotify API via Supabase Edge Functions
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="dashboard-page">
            <nav className="dashboard-nav glass">
                <div className="nav-brand">
                    <div className="brand-logo">
                        <Music size={20} color="white" />
                    </div>
                    <span className="brand-name">Weave IO</span>
                </div>

                <div className="nav-actions">
                    <div className="nav-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={16} />
                        <span>Disconnect</span>
                    </button>
                    <div className="profile-wrapper">
                        {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', borderRadius: '50%' }} />
                        ) : (
                            <User size={18} />
                        )}
                    </div>
                </div>
            </nav>

            <main className="dashboard-main container">
                <header className="main-header fade-in">
                    <div className="header-eyebrow">CURATION DASHBOARD</div>
                    <h1>Woven Sets</h1>
                    <p>Welcome back, {user?.user_metadata?.full_name || 'Curator'}. Select a playlist to begin.</p>
                </header>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Scanning your musical archives...</p>
                    </div>
                ) : (
                    <div className="empty-state glass fade-in">
                        <h3>Supabase Integration Active</h3>
                        <p>Next: Wiring up Spotify data fetching via Supabase Edge Functions.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
