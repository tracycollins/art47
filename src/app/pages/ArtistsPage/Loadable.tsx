/**
 * Asynchronously loads the component for ArtistsPage
 */

import { lazyLoad } from 'utils/loadable';

export const ArtistsPage = lazyLoad(
  () => import('./index'),
  module => module.ArtistsPage,
);
