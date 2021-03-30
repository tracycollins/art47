import { Artwork } from 'types/Artwork';

/* --- STATE --- */
export interface ArtworksState {
  artworks: Artwork[];
  loading: boolean;
  error?: ArtworkErrorType | null;
}

export enum ArtworkErrorType {
  RESPONSE_ERROR = 1,
  ARTWORK_NOT_FOUND = 2,
  RATE_LIMIT = 3,
}
