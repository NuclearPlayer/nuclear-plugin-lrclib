import { describe, expect, it } from 'vitest';

import { closestRecord } from './closest-record';
import { lrclibRecord } from './test/lrclib-record';

describe('closestRecord', () => {
  it('returns the first record when there is no duration', () => {
    const record = closestRecord([
      lrclibRecord({ id: 1, duration: 300 }),
      lrclibRecord({ id: 2, duration: 290 }),
    ]);

    expect(record).toEqual(lrclibRecord({ id: 1, duration: 300 }));
  });

  it('returns the record with the duration closest to the given duration', () => {
    const record = closestRecord(
      [
        lrclibRecord({ id: 1, duration: 300 }),
        lrclibRecord({ id: 2, duration: 250 }),
        lrclibRecord({ id: 3, duration: 289 }),
      ],
      290000,
    );

    expect(record).toEqual(lrclibRecord({ id: 3, duration: 289 }));
  });

  it('returns undefined when there are no records', () => {
    expect(closestRecord([], 290000)).toBeUndefined();
  });
});
