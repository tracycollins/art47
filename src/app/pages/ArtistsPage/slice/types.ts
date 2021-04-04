import { Artist } from 'types/Artist';
import { Cursor } from 'types/Cursor';

/* --- STATE --- */
export interface ArtistsState {
  artists: Artist[];
  artistsDisplayIds: string[];
  currentArtistId?: string | null;
  loading: boolean;
  cursor: Cursor;
  error?: ArtistErrorType | null;
}

export enum ArtistErrorType {
  RESPONSE_ERROR = 1,
  ARTIST_NOT_FOUND = 2,
  RATE_LIMIT = 3,
}
