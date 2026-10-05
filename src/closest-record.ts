import type { LrclibRecord } from './lrclib-types';
import { secondsToMs } from './time';

const distanceFrom =
  (targetMs: number) =>
  (record: LrclibRecord): number =>
    Math.abs(secondsToMs(record.duration) - targetMs);

const orderByDuration = (
  records: LrclibRecord[],
  durationMs?: number,
): LrclibRecord[] => {
  if (durationMs === undefined) {
    return records;
  }
  const distance = distanceFrom(durationMs);
  return [...records].sort((left, right) => distance(left) - distance(right));
};

export const closestRecord = (
  records: LrclibRecord[],
  durationMs?: number,
): LrclibRecord | undefined => orderByDuration(records, durationMs).at(0);
