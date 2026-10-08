"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Play } from "lucide-react";

import {
  CircularMusicPlayer,
  CircularMusicPlayerMatrix,
  CircularMusicPlayerProgress,
} from "@/components/ui/circular-music-player";
import type { SpotifyPlayback } from "@/types/spotify";

const ENDPOINT = "/api/spotify/playback";

/**
 * A track turns over every couple of minutes, so the row polls instead of
 * caching. Anything longer than this and the disc's progress ring visibly
 * lags the song it is describing.
 */
const POLL_MS = 5_000;

const SPOTIFY_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg";

/** Shared by the row and its skeleton, so neither shifts when the data lands. */
const ROW =
  "col-span-2 mt-10 mb-5 flex items-center justify-between gap-4 rounded-xl border p-4";

/**
 * Stands in for the loaded row line for line: album art, the logo-and-status
 * caption, the track title, the artist line, then the disc and the play link.
 * The bar heights are the line heights of the type steps they replace, so the
 * row is the same height before and after the first poll lands.
 */
const SongActivitySkeleton = () => (
  <div className={`${ROW} animate-pulse`} aria-hidden>
    <div className="flex min-w-0 items-center gap-3">
      <div className="bg-surface-strong h-12 w-12 shrink-0 rounded-lg" />
      {/* Capped rather than fixed, so the bars shrink with the row on a phone
          the same way the title and artist lines do. */}
      <div className="flex min-w-0 flex-col gap-1.5">
        {/* Spotify mark plus "Now Playing" / "Last Played". */}
        <div className="flex items-center gap-1">
          <div className="bg-surface-strong size-3 shrink-0 rounded-full" />
          <div className="bg-surface-strong h-3 w-20 max-w-full rounded" />
        </div>
        <div className="bg-surface-strong h-4 w-44 max-w-full rounded" />
        <div className="bg-surface-raised h-3 w-36 max-w-full rounded" />
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-3">
      <div className="bg-surface-strong size-12 rounded-full" />
      <div className="bg-surface-raised h-4 w-4 rounded-sm" />
    </div>
  </div>
);

/**
 * What I'm listening to, live. It runs on the client so the page never waits
 * on Spotify to render, and shows a skeleton until the first poll answers.
 */
const SongActivity = () => {
  const [songData, setSongData] = useState<SpotifyPlayback | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(poll, POLL_MS);
    };

    const poll = async () => {
      if (cancelled || inFlight) return;

      // A hidden tab has nothing to show, and Spotify rate-limits per app, so
      // skip the round trip and pick it up again on `visibilitychange`.
      if (document.hidden) {
        schedule();
        return;
      }

      inFlight = true;
      try {
        const res = await fetch(ENDPOINT, { cache: "no-store" });
        if (!res.ok) throw new Error("Playback request failed");
        const data = (await res.json()) as SpotifyPlayback;
        if (!cancelled) {
          setSongData((previous) => {
            if (data.available === false || data.name) return data;
            return previous?.name ? { ...previous, isPlaying: false } : data;
          });
        }
      } catch {
        // Keep the last verified track after a failed poll, without continuing
        // to claim that it is playing. The next attempt is only 5s away.
        if (!cancelled) {
          setSongData((previous) =>
            previous?.name ? { ...previous, isPlaying: false } : previous,
          );
        }
      } finally {
        inFlight = false;
        if (!cancelled) {
          // Set even on a failure, so a Spotify outage falls through to the
          // "unavailable" row instead of holding the skeleton forever.
          setLoaded(true);
          schedule();
        }
      }
    };

    poll();

    const onVisibilityChange = () => {
      if (!document.hidden) poll();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!loaded) return <SongActivitySkeleton />;

  return (
    <div className={ROW}>
      {/* `min-w-0` all the way down the left side: a flex item defaults to its
          content's minimum width, so without it a long title refuses to shrink
          and wraps to three lines on a phone instead of ellipsing. */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <Image
            src={songData?.albumArt || SPOTIFY_LOGO}
            alt={songData?.name || "Spotify"}
            width={50}
            height={50}
            quality={50}
            className="outline-image-outline h-12 w-12 rounded-lg object-cover shadow outline -outline-offset-1"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-content-muted flex items-center gap-1 text-xs font-semibold uppercase">
            <Image
              src={SPOTIFY_LOGO}
              alt="Spotify"
              width={20}
              height={20}
              className={`text-content-secondary h-3 w-3 shrink-0 ${
                songData?.isPlaying ? "animate-pulse" : ""
              }`}
            />
            {songData?.name
              ? songData.isPlaying
                ? "Now Playing"
                : "Last Played"
              : "Listening activity"}
          </span>
          <span className="truncate text-sm font-bold">
            {songData?.name ?? "Spotify unavailable"}
          </span>
          {/* Rendered even when empty so the row keeps its three-line height
              whether or not Spotify gave us an artist. */}
          <span className="text-content-muted truncate text-xs">
            {songData?.artists ? `by: ${songData.artists}` : "\u00a0"}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {/* The smallest size variant is still 160px, so the disc is sized down
            here to match the 48px album-art box next to it. */}
        <CircularMusicPlayer
          playing={Boolean(songData?.isPlaying)}
          progress={songData?.progress ?? 0}
          label={
            songData?.name
              ? `${songData.isPlaying ? "Now playing" : "Last played"}: ${songData.name}${
                  songData.artists ? ` by ${songData.artists}` : ""
                }`
              : "Spotify player"
          }
          className="size-12"
        >
          <CircularMusicPlayerMatrix
            columns={11}
            inset="sm"
            speed={1.15}
            peaks={false}
          />
          <CircularMusicPlayerProgress segments={20} thickness={4} />
        </CircularMusicPlayer>
        <Link href={songData?.url || "https://open.spotify.com"}>
          <Play size={18} className="text-content-secondary" />
        </Link>
      </div>
    </div>
  );
};

export default SongActivity;
