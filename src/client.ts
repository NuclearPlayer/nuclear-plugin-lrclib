import type { FetchFunction } from '@nuclearplayer/plugin-sdk';

import { config } from './config';
import type { LrclibRecord, LrclibSearchParams } from './lrclib-types';

const searchParamsOf = ({
  trackName,
  artistName,
}: LrclibSearchParams): Record<string, string> => {
  if (artistName) {
    return { track_name: trackName, artist_name: artistName };
  }
  return { track_name: trackName };
};

export class LrclibClient {
  constructor(private readonly fetch: FetchFunction) {}

  search(params: LrclibSearchParams): Promise<LrclibRecord[]> {
    return this.request<LrclibRecord[]>('/api/search', searchParamsOf(params));
  }

  private async request<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const url = new URL(path, config.apiBase);
    url.search = new URLSearchParams(params).toString();
    const response = await this.fetch(url.toString());
    if (!response.ok) {
      throw new Error(`LRCLIB API error: ${response.status} for ${path}`);
    }
    return (await response.json()) as T;
  }
}
