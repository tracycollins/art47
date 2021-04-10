import { Artwork } from 'types/Artwork';
import { Cursor } from 'types/Cursor';
import { Filter } from 'types/Filter';

/* --- STATE --- */
export interface ArtworksState {
  artworks: Artwork[];
  artworksDisplayIds: string[];
  currentArtworkId?: string | null;
  loaded: number | null;
  loading: boolean;
  filter: Filter;
  cursor: Cursor;
  error?: ArtworkErrorType | null;
}

export enum ArtworkErrorType {
  RESPONSE_ERROR = 1,
  ARTWORK_NOT_FOUND = 2,
  RATE_LIMIT = 3,
}
