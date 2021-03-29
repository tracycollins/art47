import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.artworks || initialState;

export const selectArtworks = createSelector([selectSlice], state => state);
