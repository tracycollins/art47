import { Artist } from 'types/Artist';
import { Cursor } from 'types/Cursor';
import { Filter } from 'types/Filter';

/* --- STATE --- */
export interface ArtistsState {
  artists: Artist[];
  artistsDisplayIds: string[];
  currentArtistId?: string | null;
  loaded: boolean;
  loading: boolean;
  hasNextPage: boolean;
  filter: Filter;
  cursor: Cursor;
  error?: ArtistErrorType | null;
}

export enum ArtistErrorType {
  RESPONSE_ERROR = 1,
  ARTIST_NOT_FOUND = 2,
  RATE_LIMIT = 3,
}
