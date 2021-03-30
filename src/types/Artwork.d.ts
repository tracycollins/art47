interface ArtworkItem {
  title: string;
  id: number;
}

export interface Artwork extends ArtworkItem {
  forks: number;
  open_issues: number;
  watchers: number;
}
