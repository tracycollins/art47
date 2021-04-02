export interface Cursor {
  _id: number;
  sortType: string;
  subDoc?: string;
  sort: string;
  rate?: number;
  score?: number;
}
