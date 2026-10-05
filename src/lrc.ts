import type {
  LyricsSegment,
  SyncedLyricsLine,
} from '@nuclearplayer/plugin-sdk';

type TimedText = {
  startMs: number;
  text: string;
};

const fractionToMs = (fraction = ''): number =>
  Number(fraction.padEnd(3, '0'));

const timestampToMs = ([, minutes, seconds, fraction]: RegExpMatchArray): number =>
  (Number(minutes) * 60 + Number(seconds)) * 1000 +
  fractionToMs(fraction);

const parseLine = (line: string): TimedText[] => {
  const timestamps = line.match(/^(?:\[\d+:\d{1,2}(?:\.\d{1,3})?\])+/)?.[0] ?? '';
  const text = line.slice(timestamps.length).trim();
  return [...timestamps.matchAll(/\[(\d+):(\d{1,2})(?:\.(\d{1,3}))?\]/g)].map((match) => ({
    startMs: timestampToMs(match),
    text,
  }));
};

export const parseLrc = (
  lrc: string,
  durationMs: number,
): SyncedLyricsLine<LyricsSegment>[] => {
  const timedTexts = lrc
    .split(/\r?\n/)
    .flatMap(parseLine)
    .sort((left, right) => left.startMs - right.startMs);

  return timedTexts
    .map((timedText, index) => ({
      ...timedText,
      endMs: timedTexts[index + 1]?.startMs ?? durationMs,
    }))
    .filter((timedText) => timedText.text.length > 0)
    .map(({ startMs, endMs, text }) => ({
      startMs,
      endMs,
      segments: [{ text }],
    }));
};
