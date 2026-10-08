export interface DiscordUser {
  avatar: string;
  avatar_decoration_data: {
    asset: string;
    sku_id: string;
  } | null;
  bot: boolean;
  collectibles?: {
    [key: string]: unknown;
  };
  discriminator: string;
  display_name: string;
  global_name: string;
  id: string;
  public_flags: number;
  username: string;
}

export interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

export interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
  created_at?: number;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  party?: {
    id?: string;
    size?: [number, number];
  };
  buttons?: string[];
  sync_id?: string;
  session_id?: string;
  flags?: number;
}

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export interface LanyardData {
  kv: {
    [key: string]: string;
  };
  discord_user: DiscordUser;
  activities: Activity[];
  discord_status: DiscordStatus;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_embedded: boolean;
  listening_to_spotify: boolean;
  spotify: SpotifyData | null;
}

export interface LanyardResponse {
  success: boolean;
  data: LanyardData;
}
