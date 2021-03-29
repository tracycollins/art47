import { lazyLoad } from 'utils/loadable';

export const ArtworkExcerpt = lazyLoad(
  () => import('./index'),
  module => module.ArtworkExcerpt,
);
