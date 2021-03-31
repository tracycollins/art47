export interface Artwork {
  _id: string;
  id: number;
  title: string;
  ratings: array;
  ratingUser: object;
  recommendations: array;
  recommendationUser: object;
}
