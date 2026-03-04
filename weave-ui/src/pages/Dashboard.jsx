import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, User, LogOut, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getPlaylists } from '../api/spotify';
import PlaylistCard from '../components/PlaylistCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
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
        await fetchPlaylists();
    };

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const { data } = await getPlaylists();
            setPlaylists(data.items || []);
        } catch (err) {
            console.error('Error fetching playlists:', err);
            setError('Could not load playlists. Make sure Spotify is connected in Supabase.');
        } finally {
            setLoading(false);
        }
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
                    <button onClick={fetchPlaylists} className="nav-icon-btn" title="Refresh">
                        <RefreshCw size={18} className={loading && playlists.length > 0 ? 'spinning' : ''} />
                    </button>
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
                    <p>Welcome, {user?.user_metadata?.full_name || 'Curator'}. Select a playlist to weave.</p>
                </header>

                {loading && playlists.length === 0 ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Scanning your musical archives...</p>
                    </div>
                ) : error ? (
                    <div className="error-state glass fade-in">
                        <div className="error-icon">!</div>
                        <p>{error}</p>
                        <button onClick={() => navigate('/')}>Back to Login</button>
                    </div>
                ) : (
                    <div className="playlist-grid fade-in">
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                onClick={() => navigate(`/sequencer/${playlist.id}`)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
