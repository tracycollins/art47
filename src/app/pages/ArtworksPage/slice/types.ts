import { Artwork } from 'types/Artwork';
import { Cursor } from 'types/Cursor';

/* --- STATE --- */
export interface ArtworksState {
  artworks: Artwork[];
  currentArtworkId?: string | null;
  loading: boolean;
  cursor: Cursor;
  error?: ArtworkErrorType | null;
}

export enum ArtworkErrorType {
  RESPONSE_ERROR = 1,
  ARTWORK_NOT_FOUND = 2,
  RATE_LIMIT = 3,
}
