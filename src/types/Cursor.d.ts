export interface Cursor {
  id: number | null;
  subDoc: string;
  sort: string;
  rate?: number;
  score?: number;
  value?: number;
}
