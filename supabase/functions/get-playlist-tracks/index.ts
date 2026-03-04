// Supabase Edge Function: get-playlist-tracks
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { toCamelot } from "../weave-sequence/camelot.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { playlistId, access_token } = await req.json()

        if (!access_token) {
            return new Response(JSON.stringify({ error: 'Missing Spotify access token' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 1. Get Playlist Info
        const infoRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const info = await infoRes.json()

        // 2. Get Tracks
        const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const tracksData = await tracksRes.json()
        const tracks = tracksData.items.map((item: any) => item.track).filter(Boolean)

        // 3. Get Audio Features
        const ids = tracks.map((t: any) => t.id).join(',')
        const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const featuresData = await featuresRes.json()
        const featuresMap = featuresData.audio_features.reduce((acc: any, f: any) => {
            if (f) acc[f.id] = f
            return acc
        }, {})

        // 4. Merge
        const tracksWithFeatures = tracks.map((track: any) => {
            const f = featuresMap[track.id]
            return {
                ...track,
                ...f,
                camelot: f ? toCamelot(f.key, f.mode) : '—'
            }
        })

        return new Response(JSON.stringify({ info, tracks: tracksWithFeatures }), {
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
