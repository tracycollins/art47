import { ArtworksState } from 'app/pages/ArtworksPage/slice/types';
import { ArtistsState } from 'app/pages/ArtistsPage/slice/types';
import { StatsState } from 'app/pages/StatsPage/slice/types';
import { UserState } from 'app/pages/UserPage/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  artworks?: ArtworksState;
  artists?: ArtistsState;
  user?: UserState;
  stats?: StatsState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
