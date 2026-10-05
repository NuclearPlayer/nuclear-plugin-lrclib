import { describe, expect, it } from 'vitest';

import { recordToLyrics } from './record-to-lyrics';
import { lrclibRecord } from './test/lrclib-record';

describe('recordToLyrics', () => {
  it('maps an instrumental record to instrumental lyrics', () => {
    expect(recordToLyrics(lrclibRecord({ instrumental: true }))).toEqual({
      type: 'instrumental',
      metadata: {},
    });
  });

  it('maps synced lyrics to line-synced lyrics, ending the last line at the track duration', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        syncedLyrics:
          '[00:46.24] Reckoner\n[00:57.60] You can\'t take it with you\n[01:09.42] Dancing for your pleasure',
        plainLyrics:
          "Reckoner\nYou can't take it with you\nDancing for your pleasure",
      }),
    );

    expect(lyrics).toEqual({
      type: 'lineSynced',
      metadata: {},
      sections: [
        {
          lines: [
            {
              startMs: 46240,
              endMs: 57600,
              segments: [{ text: 'Reckoner' }],
            },
            {
              startMs: 57600,
              endMs: 69420,
              segments: [{ text: "You can't take it with you" }],
            },
            {
              startMs: 69420,
              endMs: 290000,
              segments: [{ text: 'Dancing for your pleasure' }],
            },
          ],
        },
      ],
    });
  });

  it('skips LRC metadata tags', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        duration: 10,
        syncedLyrics:
          '[ar:Radiohead]\n[ti:Reckoner]\n[al:In Rainbows]\n[length:04:50]\n[00:01.00] Reckoner',
      }),
    );

    expect(lyrics).toEqual({
      type: 'lineSynced',
      metadata: {},
      sections: [
        {
          lines: [
            {
              startMs: 1000,
              endMs: 10000,
              segments: [{ text: 'Reckoner' }],
            },
          ],
        },
      ],
    });
  });

  it('makes one line per timestamp when a line has several timestamps', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        duration: 20,
        syncedLyrics: '[00:01.00][00:10.00]Chorus\n[00:05.00]Verse',
      }),
    );

    expect(lyrics).toEqual({
      type: 'lineSynced',
      metadata: {},
      sections: [
        {
          lines: [
            { startMs: 1000, endMs: 5000, segments: [{ text: 'Chorus' }] },
            { startMs: 5000, endMs: 10000, segments: [{ text: 'Verse' }] },
            { startMs: 10000, endMs: 20000, segments: [{ text: 'Chorus' }] },
          ],
        },
      ],
    });
  });

  it('ends the previous line at a timestamp with empty text and makes no line for it', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        duration: 30,
        syncedLyrics:
          '[00:01.00] Reckoner\n[00:05.00] \n[00:12.50] Take me with you\n[00:20.00] ',
      }),
    );

    expect(lyrics).toEqual({
      type: 'lineSynced',
      metadata: {},
      sections: [
        {
          lines: [
            { startMs: 1000, endMs: 5000, segments: [{ text: 'Reckoner' }] },
            {
              startMs: 12500,
              endMs: 20000,
              segments: [{ text: 'Take me with you' }],
            },
          ],
        },
      ],
    });
  });

  it('sorts lines by start time', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        duration: 10,
        syncedLyrics: '[00:03.00]Third\n[00:01.00]First\n[00:02.00]Second',
      }),
    );

    expect(lyrics).toEqual({
      type: 'lineSynced',
      metadata: {},
      sections: [
        {
          lines: [
            { startMs: 1000, endMs: 2000, segments: [{ text: 'First' }] },
            { startMs: 2000, endMs: 3000, segments: [{ text: 'Second' }] },
            { startMs: 3000, endMs: 10000, segments: [{ text: 'Third' }] },
          ],
        },
      ],
    });
  });

  it('reads timestamps with millisecond and without fractional precision', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        duration: 10,
        syncedLyrics: '[00:01.234]Milliseconds\n[00:02]Whole seconds\n[00:03.5]Tenths',
      }),
    );

    expect(lyrics).toEqual({
      type: 'lineSynced',
      metadata: {},
      sections: [
        {
          lines: [
            {
              startMs: 1234,
              endMs: 2000,
              segments: [{ text: 'Milliseconds' }],
            },
            {
              startMs: 2000,
              endMs: 3500,
              segments: [{ text: 'Whole seconds' }],
            },
            { startMs: 3500, endMs: 10000, segments: [{ text: 'Tenths' }] },
          ],
        },
      ],
    });
  });

  it('maps plain lyrics to plain lyrics with sections split by blank lines', () => {
    const lyrics = recordToLyrics(
      lrclibRecord({
        plainLyrics:
          "Reckoner\nYou can't take it with you\n\n\nYou are not to blame for\nBittersweet distractor \n",
      }),
    );

    expect(lyrics).toEqual({
      type: 'plain',
      metadata: {},
      sections: [
        {
          lines: [
            { segments: [{ text: 'Reckoner' }] },
            { segments: [{ text: "You can't take it with you" }] },
          ],
        },
        {
          lines: [
            { segments: [{ text: 'You are not to blame for' }] },
            { segments: [{ text: 'Bittersweet distractor' }] },
          ],
        },
      ],
    });
  });

  it('maps a record without any lyrics to plain lyrics with no sections', () => {
    expect(recordToLyrics(lrclibRecord({}))).toEqual({
      type: 'plain',
      metadata: {},
      sections: [],
    });
  });
});
