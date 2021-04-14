interface StatsItem {
  user?: object | null;
  users?: object | null;
  artists?: object | null;
  artworks?: object | null;
  ratings?: object | null;
  recommendations?: object | null;
}

export interface Stats extends StatsItem {
  _id?: string;
}
