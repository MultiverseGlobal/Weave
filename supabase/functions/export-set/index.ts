// Supabase Edge Function: export-set
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { playlistId, tracks, access_token } = await req.json()

        // 1. Get Me
        const userRes = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const userData = await userRes.json()
        const userId = userData.id

        // 2. Get Original Playlist Name
        const plRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const plData = await plRes.json()
        const originalName = plData.name

        // 3. Create Playlist
        const createRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${originalName} [Weave IO]`,
                description: 'Optimized set by Weave IO — Serverless precision.',
                public: false
            })
        })
        const newPlData = await createRes.json()
        const newPlaylistId = newPlData.id

        // 4. Add Tracks
        const uris = tracks.map((t: any) => t.uri)
        await fetch(`https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uris })
        })

        return new Response(JSON.stringify({ success: true, url: newPlData.external_urls.spotify }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
