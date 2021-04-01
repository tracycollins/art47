export interface Artwork {
  _id: string;
  id: string;
  title: string;
  ratings: array;
  ratingUser: {
    id: string;
    user: object;
    rate: number;
  };
  recommendations: array;
  recommendationUser: {
    id: string;
    user: object;
    score: number;
  };
}
