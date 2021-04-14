import { User } from 'types/User';

/* --- STATE --- */
export interface UserState {
  user: User;
  loaded: number | null;
  loading: boolean;
  oauthID?: string | null;
  error?: UserErrorType | null;
}

export enum UserErrorType {
  RESPONSE_ERROR = 1,
  USER_NOT_FOUND = 2,
  RATE_LIMIT = 3,
}
