import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for cookies
});

export const getPlaylists = () => api.get('/playlists');
export const getPlaylistTracks = (id) => api.get(`/playlists/${id}/tracks`);
export const sequencePlaylist = (playlistId) => api.post('/sequencer/sequence', { playlistId });
export const exportPlaylist = (playlistId, tracks) => api.post('/sequencer/export', { playlistId, tracks });

export default api;
