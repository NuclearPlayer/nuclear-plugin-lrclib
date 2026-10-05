import type {
  LyricsLine,
  LyricsSection,
  LyricsSegment,
} from '@nuclearplayer/plugin-sdk';

type PlainLine = LyricsLine<LyricsSegment>;

const blockToLines = (block: string): PlainLine[] =>
  block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((text) => text.length > 0)
    .map((text) => ({ segments: [{ text }] }));

export const parsePlainLyrics = (
  text: string,
): LyricsSection<PlainLine>[] =>
  text
    .split(/\n\s*\n/)
    .map(blockToLines)
    .filter((lines) => lines.length > 0)
    .map((lines) => ({ lines }));
