import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, User, LogOut, RefreshCw } from 'lucide-react';
import { getPlaylists } from '../api/spotify';
import PlaylistCard from '../components/PlaylistCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await getPlaylists();
            setPlaylists(response.data.items || []);
        } catch (err) {
            console.error('Error fetching playlists:', err);
            setError('Session expired or access denied. Please reconnect.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear cookie (logic handled by backend /auth/logout in future)
        window.location.href = '/';
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
                        <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    </button>
                    <div className="nav-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={16} />
                        <span>Disconnect</span>
                    </button>
                    <div className="profile-wrapper">
                        <User size={18} />
                    </div>
                </div>
            </nav>

            <main className="dashboard-main container">
                <header className="main-header fade-in">
                    <div className="header-eyebrow">CURATION DASHBOARD</div>
                    <h1>Woven Sets</h1>
                    <p>Select a playlist to reorder with harmonic intelligence.</p>
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
                        <button onClick={() => window.location.href = 'http://localhost:3001/auth/login'}>Reconnect Spotify</button>
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
