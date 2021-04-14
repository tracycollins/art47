import { Stats } from 'types/Stats';

/* --- STATE --- */
export interface StatsState {
  stats?: Stats;
  loaded: number | null;
  loading: boolean;
  error?: StatsErrorType | null;
}

export enum StatsErrorType {
  RESPONSE_ERROR = 1,
  RATE_LIMIT = 3,
}
