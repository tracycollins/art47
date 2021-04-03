import { lazyLoad } from 'utils/loadable';

export const ArtistExcerpt = lazyLoad(
  () => import('./index'),
  module => module.ArtistExcerpt,
);
