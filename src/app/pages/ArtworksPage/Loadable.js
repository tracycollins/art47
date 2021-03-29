import { lazyLoad } from 'utils/loadable';

export const ArtworksPage = lazyLoad(
  () => import('./index'),
  module => module.ArtworksPage,
);
