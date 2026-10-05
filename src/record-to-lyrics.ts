import type { Lyrics } from '@nuclearplayer/plugin-sdk';

import { parseLrc } from './lrc';
import type { LrclibRecord } from './lrclib-types';
import { parsePlainLyrics } from './plain';

export const recordToLyrics = (record: LrclibRecord): Lyrics => {
  if (record.instrumental) {
    return { type: 'instrumental', metadata: {} };
  }
  if (record.syncedLyrics) {
    return {
      type: 'lineSynced',
      metadata: {},
      sections: [
        { lines: parseLrc(record.syncedLyrics, record.duration * 1000) },
      ],
    };
  }
  return {
    type: 'plain',
    metadata: {},
    sections: parsePlainLyrics(record.plainLyrics ?? ''),
  };
};
