import { supabase } from '../lib/supabase';

/**
 * Weave IO API Wrapper for Supabase Edge Functions
 */

const callFunction = async (name, body) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(name, {
        body: {
            ...body,
            access_token: session.provider_token // Supabase provides this for OAuth
        }
    });

    if (error) throw error;
    return { data };
};

export const getPlaylists = () => callFunction('get-playlists', {});

export const getPlaylistTracks = (playlistId) =>
    callFunction('get-playlist-tracks', { playlistId });

export const sequencePlaylist = (playlistId) =>
    callFunction('weave-sequence', { playlistId });

export const exportPlaylist = (playlistId, tracks) =>
    callFunction('export-set', { playlistId, tracks });

export default {
    getPlaylists,
    getPlaylistTracks,
    sequencePlaylist,
    exportPlaylist
};
