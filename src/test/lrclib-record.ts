import type { LrclibRecord } from '../lrclib-types';

export const lrclibRecord = (
  overrides: Partial<LrclibRecord>,
): LrclibRecord => ({
  id: 34513,
  name: 'Reckoner',
  trackName: 'Reckoner',
  artistName: 'Radiohead',
  albumName: 'In Rainbows',
  duration: 290,
  instrumental: false,
  plainLyrics: null,
  syncedLyrics: null,
  ...overrides,
});
