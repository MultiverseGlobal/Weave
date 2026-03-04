import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Play,
    RotateCcw,
    Save,
    Activity,
    Zap,
    Disc,
    Info
} from 'lucide-react';
import { getPlaylistTracks, sequencePlaylist, exportPlaylist } from '../api/spotify';
import { supabase } from '../lib/supabase';
import EnergyCurve from '../components/EnergyCurve';
import CamelotBadge from '../components/CamelotBadge';
import '../styles/Sequencer.css';

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
        checkSession();
    }, [playlistId]);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/');
            return;
        }
        loadPlaylistData();
    };

    const loadPlaylistData = async () => {
        try {
            setLoading(true);
            const { data } = await getPlaylistTracks(playlistId);
            setOriginalTracks(data.tracks || []);
            setPlaylistInfo(data.info);
        } catch (err) {
            console.error('Error loading tracks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWeave = async () => {
        try {
            setWeaving(true);
            const { data } = await sequencePlaylist(playlistId);
            setSequencedTracks(data.orderedTracks || []);
        } catch (err) {
            console.error('Error weaving playlist:', err);
        } finally {
            setWeaving(false);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const { data } = await exportPlaylist(playlistId, sequencedTracks);
            if (data.success) {
                alert('Set successfully saved to your Spotify library!');
                if (data.url) window.open(data.url, '_blank');
            }
        } catch (err) {
            console.error('Error exporting:', err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="sequencer-loading">
                <div className="spinner"></div>
                <p className="loading-text">Analyzing Audio Features...</p>
            </div>
        );
    }

    const tracksToDisplay = sequencedTracks.length ? sequencedTracks : originalTracks;
    const energyData = tracksToDisplay.map(t => t.energy);

    return (
        <div className="sequencer-page">
            <header className="sequencer-header glass">
                <div className="header-left">
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="header-title">
                        <div className="header-playlist-tag">OPTIMIZING PLAYLIST</div>
                        <h2>{playlistInfo?.name || 'Processing...'}</h2>
                    </div>
                </div>

                <div className="header-actions">
                    {sequencedTracks.length > 0 ? (
                        <>
                            <button onClick={() => setSequencedTracks([])} className="reset-btn">
                                <RotateCcw size={16} />
                                <span>Reset</span>
                            </button>
                            <button onClick={handleExport} className="export-btn" disabled={exporting}>
                                <Save size={16} />
                                <span>{exporting ? 'Saving...' : 'Save to Spotify'}</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={handleWeave} className="weave-btn" disabled={weaving}>
                            <Play size={16} fill="currentColor" />
                            <span>{weaving ? 'Weaving...' : 'Generate Set'}</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="sequencer-content">
                <aside className="stats-panel glass">
                    <div className="stat-group">
                        <label><Activity size={14} /> Energy Profile</label>
                        <div className="chart-outer glass">
                            <EnergyCurve data={energyData} />
                        </div>
                    </div>

                    <div className="instruction-box fade-in">
                        <div className="info-badge">
                            <Zap size={14} />
                            <span>SMART ENGINE ACTIVE</span>
                        </div>
                        <h3>Intelligent Flow</h3>
                        <p> Weave IO automatically arranges tracks by energy tiers, ensuring the perfect vibe from start to finish.</p>

                        <div className="logic-hint">
                            <Info size={12} />
                            <span>Uses Camelot Wheel Adjacency</span>
                        </div>
                    </div>
                </aside>

                <section className="tracklist-panel">
                    <div className="track-grid-header">
                        <span className="col-idx">#</span>
                        <span className="col-track">Track</span>
                        <span className="col-key">Key</span>
                        <span className="col-bpm">BPM</span>
                        <span className="col-energy">Energy</span>
                    </div>
                    <div className="track-list scrollable">
                        {tracksToDisplay.map((track, idx) => (
                            <div key={track.id} className="track-row fade-in" style={{ animationDelay: `${idx * 0.03}s` }}>
                                <span className="track-index">{String(idx + 1).padStart(2, '0')}</span>
                                <div className="track-main">
                                    <div className="track-img-v2">
                                        {track.album?.images?.[0]?.url ? (
                                            <img src={track.album.images[0].url} alt="" />
                                        ) : (
                                            <div className="track-img-placeholder"><Disc size={16} /></div>
                                        )}
                                    </div>
                                    <div className="track-meta">
                                        <span className="track-name">{track.name}</span>
                                        <span className="track-artist">{track.artists?.[0]?.name}</span>
                                    </div>
                                </div>
                                <div className="track-key-col">
                                    <CamelotBadge code={track.camelot} />
                                </div>
                                <span className="track-bpm">{Math.round(track.tempo)}</span>
                                <div className="track-energy-col">
                                    <div className="energy-value">{(track.energy * 100).toFixed(0)}%</div>
                                    <div className="energy-track">
                                        <div className="energy-fill" style={{ width: `${track.energy * 100}%` }}></div>
                                    </div>
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
