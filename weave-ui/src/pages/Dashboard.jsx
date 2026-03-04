import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Music, Search, User } from 'lucide-react';
import { getPlaylists } from '../api/spotify';
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
            setError('Could not load playlists. Make sure you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <nav className="dashboard-nav glass">
                <div className="nav-brand">
                    <Music size={24} color="var(--color-accent)" />
                    <span>Weave IO</span>
                </div>
                <div className="nav-profile">
                    <div className="profile-icon">
                        <User size={18} />
                    </div>
                </div>
            </nav>

            <main className="dashboard-main container fade-in">
                <header className="main-header">
                    <h1>Your Playlists</h1>
                    <p>Select a playlist to weave into a set.</p>
                </header>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Fetching your collection...</p>
                    </div>
                ) : error ? (
                    <div className="error-state glass">
                        <p>{error}</p>
                        <button onClick={() => window.location.href = '/'}>Back to Login</button>
                    </div>
                ) : (
                    <div className="playlist-grid">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="playlist-card glass"
                                onClick={() => navigate(`/sequencer/${playlist.id}`)}
                            >
                                <div className="playlist-image">
                                    {playlist.images?.[0]?.url ? (
                                        <img src={playlist.images[0].url} alt={playlist.name} />
                                    ) : (
                                        <div className="image-placeholder">
                                            <Music size={40} />
                                        </div>
                                    )}
                                    <div className="playlist-overlay">
                                        <button className="weave-trigger">Weave Set</button>
                                    </div>
                                </div>
                                <div className="playlist-info">
                                    <h3>{playlist.name}</h3>
                                    <p>{playlist.tracks?.total || 0} tracks</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
