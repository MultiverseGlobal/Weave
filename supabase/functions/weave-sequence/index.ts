// Supabase Edge Function: weave-sequence
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { sequenceTracks } from "./algorithm.ts"
import { toCamelot } from "./camelot.ts"

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

        // 1. Fetch Tracks from Spotify
        const tracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`
        const tracksRes = await fetch(tracksUrl, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const tracksData = await tracksRes.json()
        const tracks = tracksData.items.map((item: any) => item.track).filter(Boolean)

        if (tracks.length === 0) {
            return new Response(JSON.stringify({ error: 'No tracks found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        // 2. Fetch Audio Features
        const ids = tracks.map((t: any) => t.id).join(',')
        const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const featuresData = await featuresRes.json()
        const featuresMap = featuresData.audio_features.reduce((acc: any, f: any) => {
            if (f) acc[f.id] = f
            return acc
        }, {})

        // 3. Merge and run Algorithm
        const tracksWithFeatures = tracks.map((track: any) => {
            const f = featuresMap[track.id]
            return {
                ...track,
                ...f,
                camelot: f ? toCamelot(f.key, f.mode) : '—'
            }
        })

        const orderedTracks = sequenceTracks(tracksWithFeatures)

        return new Response(JSON.stringify({ orderedTracks }), {
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
