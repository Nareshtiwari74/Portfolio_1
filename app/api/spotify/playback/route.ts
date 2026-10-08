import { NextResponse } from "next/server";

import {
  getPlayback,
  isSpotifyConfigured,
} from "@/lib/spotify/spotify-service";

/**
 * Current Spotify playback for the hero's song row. Route Handlers are
 * uncached by default, and `SongActivity` polls this every 5s because a track
 * only lasts a couple of minutes, so the response also carries `no-store` to
 * stop the browser or a CDN in front of it from replaying a finished song.
 */
export async function GET() {
  if (!isSpotifyConfigured()) {
    return NextResponse.json(
      { available: false, isPlaying: false, message: "Spotify unavailable" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  const playback = await getPlayback(
    process.env.SPOTIFY_CLIENT_ID as string,
    process.env.SPOTIFY_CLIENT_SECRET as string,
    process.env.SPOTIFY_REFRESH_TOKEN as string,
  );

  return NextResponse.json(
    { ...playback, available: true },
    {
      status: playback.error ? 502 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
