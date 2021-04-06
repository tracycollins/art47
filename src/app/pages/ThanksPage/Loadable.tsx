import { lazyLoad } from 'utils/loadable';

export const ThanksPage = lazyLoad(
  () => import('./index'),
  module => module.ThanksPage,
);
