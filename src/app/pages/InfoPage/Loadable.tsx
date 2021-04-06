import { lazyLoad } from 'utils/loadable';

export const InfoPage = lazyLoad(
  () => import('./index'),
  module => module.InfoPage,
);
