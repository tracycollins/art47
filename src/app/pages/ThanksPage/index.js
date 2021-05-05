import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ArtistExcerpt } from 'app/pages/ArtistExcerpt/Loadable';
import { selectUser } from 'app/pages/UserPage/slice/selectors';

import { useArtistsSlice } from 'app/pages/ArtistsPage/slice';
import {
  selectArtists,
  selectLoading,
} from 'app/pages/ArtistsPage/slice/selectors';

import {
  makeStyles,
  // createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';

import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

import '@fontsource/bungee'; // Defaults to weight 400.

let themeBungee = createMuiTheme({
  typography: {
    fontFamily: ['Bungee'].join(','),
    h1: {
      fontSize: 120,
    },
    h2: {
      fontSize: 40,
    },
    h3: {
      fontSize: 20,
    },
  },
});
themeBungee = responsiveFontSizes(themeBungee);

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: 'auto',
  },
  title: {
    marginTop: '5%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  artistListRoot: {
    display: 'flex',
    margin: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {},
}));

export function ThanksPage() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const artists = useSelector(selectArtists);
  const { actions } = useArtistsSlice();
  const loading = useSelector(selectLoading);
  const user = useSelector(selectUser);

  const artistsDisplay = useCallback(() => {
    dispatch(actions.getArtists());

    const artistsDisplayIds = [
      2,
      3,
      4,
      5,
      6,
      8,
      9,
      10,
      11,
      12,
      17,
      18,
      21,
      22,
      23,
      24,
      28,
    ];
    // for (const id of artistsDisplayIds) {
    //   if (!loading && !artists.find(artist => parseInt(artist.id) === id)) {
    //     console.log(`dispatch getArtistById: ${id} | loading: ${loading}`);
    //     dispatch(actions.getArtistById(id));
    //   }
    // }

    const displayArtists = artists.filter(artist => {
      return artistsDisplayIds.includes(parseInt(artist.id));
    });

    return displayArtists.map(artist => (
      <ArtistExcerpt key={artist.id} user={user} artist={artist} />
    ));
  }, [user, actions, artists, dispatch]);

  useEffect(() => {
    artistsDisplay();
  }, [loading, artistsDisplay]);

  return (
    <div className={classes.root}>
      <ThemeProvider theme={themeBungee}>
        <Typography className={classes.title} variant="h2">
          THANK YOU, INAUGURAL ARTISTS!
        </Typography>
      </ThemeProvider>
      <ThemeProvider theme={themeBungee}>
        <div className={classes.artistListRoot}>
          <div className={classes.artistList}>
            {artists.length === 0 ? (
              <CircularProgress />
            ) : (
              <GridList
                component={'div'}
                cellHeight={160}
                className={classes.gridList}
                spacing={50}
              >
                {artistsDisplay()}
              </GridList>
            )}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
