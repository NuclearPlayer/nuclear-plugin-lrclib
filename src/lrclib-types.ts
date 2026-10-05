export type LrclibRecord = {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string | null;
  duration: number;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
};

export type LrclibSearchParams = {
  trackName: string;
  artistName?: string;
};
