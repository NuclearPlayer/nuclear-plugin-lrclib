import type {
  LyricsProvider,
  NuclearPluginAPI,
} from '@nuclearplayer/plugin-sdk';

import { LrclibClient } from './client';
import { closestRecord } from './closest-record';
import { config } from './config';
import { recordToLyrics } from './record-to-lyrics';

export const createLyricsProvider = (api: NuclearPluginAPI): LyricsProvider => {
  const client = new LrclibClient(api.Http.fetch);

  return {
    id: config.providerId,
    kind: 'lyrics',
    name: config.providerName,

    async getLyrics(track) {
      const records = await client.search({
        trackName: track.title,
        artistName: track.artists[0]?.name,
      });
      const record = closestRecord(records, track.durationMs);
      if (!record) {
        return undefined;
      }
      return recordToLyrics(record);
    },
  };
};
