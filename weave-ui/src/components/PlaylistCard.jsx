import React from 'react';
import { Music, Play } from 'lucide-react';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist, onClick }) => {
    const imageUrl = playlist.images?.[0]?.url;
    const trackCount = playlist.tracks?.total || 0;

    return (
        <div className="playlist-card-v2 glass pulse-hover" onClick={onClick}>
            <div className="card-image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt={playlist.name} className="card-image" loading="lazy" />
                ) : (
                    <div className="card-image-placeholder">
                        <Music size={48} strokeWidth={1} />
                    </div>
                )}
                <div className="card-overlay">
                    <div className="play-button-visual">
                        <Play size={24} fill="currentColor" />
                    </div>
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{playlist.name}</h3>
                <div className="card-meta">
                    <span className="track-count">{trackCount} TRACKS</span>
                    <div className="dot"></div>
                    <span className="owner-name">{playlist.owner?.display_name || 'Spotify'}</span>
                </div>
            </div>
        </div>
    );
};

export default PlaylistCard;
