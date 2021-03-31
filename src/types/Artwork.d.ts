export interface Artwork {
  _id: string;
  id: string;
  title: string;
  ratings: array;
  ratingUser: object;
  recommendations: array;
  recommendationUser: object;
}
