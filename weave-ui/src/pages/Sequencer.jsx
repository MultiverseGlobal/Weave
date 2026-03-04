import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Play,
    RotateCcw,
    Save,
    ArrowRight,
    Activity,
    Zap,
    Disc
} from 'lucide-react';
import { getPlaylistTracks, sequencePlaylist, exportPlaylist } from '../api/spotify';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import '../styles/Sequencer.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Sequencer = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [originalTracks, setOriginalTracks] = useState([]);
    const [sequencedTracks, setSequencedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weaving, setWeaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [playlistInfo, setPlaylistInfo] = useState(null);

    useEffect(() => {
        loadPlaylistData();
    }, [playlistId]);

    const loadPlaylistData = async () => {
        try {
            setLoading(true);
            const response = await getPlaylistTracks(playlistId);
            setOriginalTracks(response.data.tracks);
            setPlaylistInfo(response.data.info);
        } catch (err) {
            console.error('Error loading tracks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWeave = async () => {
        try {
            setWeaving(true);
            const response = await sequencePlaylist(playlistId);
            setSequencedTracks(response.data.orderedTracks);
        } catch (err) {
            console.error('Error weaving playlist:', err);
        } finally {
            setWeaving(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            await exportPlaylist(playlistId, sequencedTracks);
            alert('Playlist exported successfully!');
        } catch (err) {
            console.error('Error exporting:', err);
        } finally {
            setExporting(false);
        }
    };

    const chartData = {
        labels: (sequencedTracks.length ? sequencedTracks : originalTracks).map((_, i) => i + 1),
        datasets: [
            {
                label: 'Energy Profile',
                data: (sequencedTracks.length ? sequencedTracks : originalTracks).map(t => t.energy),
                borderColor: '#7C3AED',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#12121A',
                titleColor: '#E2E8F0',
                bodyColor: '#64748B',
                borderColor: '#1E1E2E',
                borderWidth: 1,
            }
        },
        scales: {
            y: { min: 0, max: 1, display: false },
            x: { display: false }
        }
    };

    if (loading) {
        return (
            <div className="sequencer-loading">
                <div className="spinner"></div>
                <p>Analyzing audio architecture...</p>
            </div>
        );
    }

    const tracksToDisplay = sequencedTracks.length ? sequencedTracks : originalTracks;

    return (
        <div className="sequencer-page">
            <header className="sequencer-header glass">
                <div className="header-left">
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="header-title">
                        <h2>{playlistInfo?.name || 'Processing Playlist'}</h2>
                        <p>{originalTracks.length} tracks found</p>
                    </div>
                </div>

                <div className="header-actions">
                    {sequencedTracks.length > 0 ? (
                        <>
                            <button onClick={() => setSequencedTracks([])} className="reset-btn">
                                <RotateCcw size={18} />
                                <span>Reset</span>
                            </button>
                            <button onClick={handleExport} className="export-btn" disabled={exporting}>
                                <Save size={18} />
                                <span>{exporting ? 'Exporting...' : 'Save to Spotify'}</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={handleWeave} className="weave-btn" disabled={weaving}>
                            <Play size={18} fill="currentColor" />
                            <span>{weaving ? 'Weaving...' : 'Run Weave Engine'}</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="sequencer-content">
                <aside className="stats-panel glass">
                    <div className="stat-group">
                        <label><Activity size={14} /> Energy Profile</label>
                        <div className="chart-container">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="instruction-box fade-in">
                        <Zap size={20} color="var(--color-accent)" />
                        <h3>Optimization Active</h3>
                        <p> Weave IO is reordering your set using harmonic proximity (Camelot Wheel) and energy tiering to ensure a perfect flow.</p>
                    </div>
                </aside>

                <section className="tracklist-panel">
                    <div className="track-grid-header">
                        <span>#</span>
                        <span>Track</span>
                        <span>Key</span>
                        <span>BPM</span>
                        <span>Energy</span>
                    </div>
                    <div className="track-list scrollable">
                        {tracksToDisplay.map((track, idx) => (
                            <div key={track.id} className="track-row fade-in" style={{ animationDelay: `${idx * 0.02}s` }}>
                                <span className="track-index">{idx + 1}</span>
                                <div className="track-main">
                                    <div className="track-img">
                                        {track.album?.images?.[0]?.url ? (
                                            <img src={track.album.images[0].url} alt="" />
                                        ) : (
                                            <Disc size={16} />
                                        )}
                                    </div>
                                    <div className="track-meta">
                                        <span className="track-name">{track.name}</span>
                                        <span className="track-artist">{track.artists?.[0]?.name}</span>
                                    </div>
                                </div>
                                <span className="track-key-badge">{track.camelot || '—'}</span>
                                <span className="track-bpm">{Math.round(track.tempo)}</span>
                                <div className="track-energy-bar">
                                    <div className="energy-fill" style={{ width: `${track.energy * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Sequencer;
