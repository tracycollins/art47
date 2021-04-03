/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useArtistsSlice } from './slice';
// import { selectArtists, selectLoading, selectError } from './slice/selectors';
import {
  selectArtists,
  selectArtistsDisplayIds,
  selectCurrentArtist,
  selectLoading,
  selectCursor,
  // selectFilter,
} from './slice/selectors';
// import { ArtistErrorType } from './slice/types';

import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {} from './slice/selectors';
import { ArtistExcerpt } from 'app/pages/ArtistExcerpt/Loadable';
import { Artist } from '../Artist';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  artistRoot: {
    marginRight: theme.spacing(10),
    // marginTop: theme.spacing(10),
    width: '100%',
  },
  artistList: {
    display: 'flex',
  },
  artistListRoot: {
    display: 'flex',
    padding: theme.spacing(10),
  },

  gridList: {
    display: 'flex',
  },
  gridListItem: {},
  progress: {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
  },
  appBar: {
    backgroundColor: 'transparent',
    top: 'auto',
    bottom: 0,
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginRight: theme.spacing(10),
  },
  toolBarButton: {
    marginRight: theme.spacing(1),
    display: 'flex',
  },
}));

export function ArtistsPage() {
  let history = useHistory();

  console.log({ history });

  const artistIdRegex = /\/artists\/(\w+)/;
  const urlArtistId =
    history.location &&
    history.location.pathname &&
    history.location.pathname.match(artistIdRegex)
      ? parseInt(history.location.pathname.match(artistIdRegex)[1], 10)
      : false;

  // const currentArtistIdRef = useRef(currentArtistId);

  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(n => {
      if (n !== undefined) {
        setValue(v => n);
      } else {
        setValue(v => !v);
      }
    }, []);
    return [value, toggle];
  };

  const { actions } = useArtistsSlice();

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const artists = useSelector(selectArtists);
  const artistsDisplayIds = useSelector(selectArtistsDisplayIds);
  const currentArtist = useSelector(selectCurrentArtist);
  const loading = useSelector(selectLoading);
  const cursor = useSelector(selectCursor);
  // const filter = useSelector(selectFilter);
  // const error = useSelector(selectError);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [displayCurrentArtist, setDisplayCurrentArtist] = useState(false);

  const [topRated, toogleTopRated] = useToggle();
  const [topRecs, toogleTopRecs] = useToggle();
  const [unrated, toogleUnrated] = useToggle();

  const classes = useStyles();

  useEffect(() => {
    setHasNextPage(cursor && cursor._id !== null);
  }, [cursor]);

  useEffect(() => {
    const options = { user };
    // if (artists.length === 0) {
    //   dispatch(actions.getArtistById(options));
    // }
    if (urlArtistId) {
      console.log(
        `ArtistsPage | getArtists` +
          ` | ${artists ? artists.length : 0} ARTISTS` +
          ` | displayCurrentArtist: ${displayCurrentArtist}` +
          ` | loading: ${loading}` +
          ` | hasNextPage: ${hasNextPage}` +
          ` | urlArtistId: ${urlArtistId}`,
      );

      if (!currentArtist || currentArtist.id !== urlArtistId) {
        dispatch(actions.getArtistById(urlArtistId));
      }
      dispatch(actions.setCurrentArtistId(urlArtistId));
      setDisplayCurrentArtist(true);
    } else {
      console.log(
        `ArtistsPage | getArtists` +
          ` | ${artists ? artists.length : 0} ARTISTS` +
          ` | displayCurrentArtist: ${displayCurrentArtist}` +
          ` | loading: ${loading}` +
          ` | hasNextPage: ${hasNextPage}` +
          ` | urlArtistId: ${urlArtistId}`,
      );

      setDisplayCurrentArtist(false);
      if (artists.length === 0 && hasNextPage && !loading) {
        dispatch(actions.setCurrentArtistId(null));
        dispatch(actions.getArtists(options));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artists, urlArtistId, loading, hasNextPage]);

  const updateFilterSort = useCallback(
    newFilter => {
      console.log(`UPDATE FILTER SORT`);
      console.log({ newFilter });
      dispatch(actions.updateFilterSort({ filter: newFilter }));
      dispatch(actions.artistsFilterSort());

      if (newFilter.unrated) {
        console.log(`UPDATE UNRATED SORT`);
        dispatch(
          actions.setCursor({
            cursor: {
              _id: 0,
              sortType: 'none',
              subDoc: 'none',
              sort: 'none',
              rate: 0,
              score: 0,
              value: 0,
            },
          }),
        );
      }
    },
    [actions, dispatch],
  );

  const toggleFilter = useCallback(
    toggle => {
      if (toggle.topRated) {
        toogleTopRated();
        toogleTopRecs(false);
        toogleUnrated(false);
        updateFilterSort({
          topRated: !topRated,
          topRecs: false,
          unrated: false,
        });
      }
      if (toggle.topRecs) {
        toogleTopRated(false);
        toogleTopRecs();
        toogleUnrated(false);
        updateFilterSort({
          topRecs: !topRecs,
          topRated: false,
          unrated: false,
        });
      }
      if (toggle.unrated) {
        toogleTopRated(false);
        toogleTopRecs(false);
        toogleUnrated();
        updateFilterSort({
          unrated: !unrated,
          topRecs: false,
          topRated: false,
        });
      }
    },
    [
      updateFilterSort,
      topRated,
      topRecs,
      unrated,
      toogleTopRated,
      toogleTopRecs,
      toogleUnrated,
    ],
  );

  function infiniteHandleLoadMore() {
    setHasNextPage(false);
    const options = { user };
    if (hasNextPage && !loading) {
      dispatch(actions.getArtists(options));
      setHasNextPage(cursor && cursor._id !== null);
    }
    console.log(
      `infiniteHandleLoadMore` +
        ` | LAST ARTIST ID: ${
          artists.length > 0 ? artists[artists.length - 1].id : null
        }` +
        ` | cursor._id: ${cursor && cursor._id ? cursor._id : null}` +
        ` | loading: ${loading}` +
        ` | hasNextPage: ${hasNextPage}`,
    );
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: infiniteHandleLoadMore,
  });

  const handlePrevNext = (prevNext, artistId) => {
    console.log(`handlePrevNext | ${prevNext} | ARTIST ID: ${artistId}`);
    const currentIndex = artistsDisplayIds.findIndex(id => artistId === id);

    let newArtistId = '';

    if (prevNext === 'next') {
      newArtistId =
        currentIndex === artistsDisplayIds.length - 1
          ? artistsDisplayIds[0]
          : artistsDisplayIds[currentIndex + 1];
    } else {
      newArtistId =
        currentIndex === 0
          ? artistsDisplayIds[artistsDisplayIds.length - 1]
          : artistsDisplayIds[currentIndex - 1];
    }
    console.log({ newArtistId });
    history.push(`/artists/${newArtistId}`);
    // dispatch(actions.setCurrentArtist(artist_id));
  };

  const handleUpdateRating = rating => {
    console.log({ rating });
    dispatch(actions.updateRating({ rating }));
    dispatch(actions.setCurrentArtistId(urlArtistId));
  };

  const artistsDisplay = () => {
    const displayArtists = artistsDisplayIds.map(id =>
      artists.find(artist => artist.id === id),
    );
    return displayArtists.map(artist => (
      <ArtistExcerpt key={artist.id} user={user} artist={artist} />
    ));
  };

  const content = displayCurrentArtist ? (
    <div className={classes.artistRoot}>
      <Artist
        artist={currentArtist}
        prevNext={handlePrevNext}
        handleUpdateRating={handleUpdateRating}
      />
    </div>
  ) : (
    <>
      <AppBar className={classes.appBar} elevation={0} position="fixed">
        <Toolbar className={classes.toolBar}>
          <Button
            className={classes.toolBarButton}
            // onClick={() => handleSetFilter('topRecs')}
            onClick={() =>
              toggleFilter({
                topRecs: true,
                topRated: false,
                unrated: false,
              })
            }
            variant="contained"
            color={topRecs ? 'secondary' : 'primary'}
          >
            REC SORT
          </Button>
          <Button
            className={classes.toolBarButton}
            // onClick={() => handleSetFilter('topRated')}
            onClick={() =>
              toggleFilter({
                topRecs: false,
                topRated: true,
                unrated: false,
              })
            }
            variant="contained"
            color={topRated ? 'secondary' : 'primary'}
          >
            RATING SORT
          </Button>
          <Button
            className={classes.toolBarButton}
            // onClick={() => handleSetFilter('unrated')}
            onClick={() =>
              toggleFilter({
                topRecs: false,
                topRated: false,
                unrated: true,
              })
            }
            variant="contained"
            color={unrated ? 'secondary' : 'primary'}
          >
            YOUR UNRATED
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.artistListRoot}>
        <div className={classes.artistList}>
          {artists.length === 0 ? (
            <CircularProgress />
          ) : (
            <GridList
              component={'div'}
              ref={infiniteRef}
              cellHeight={160}
              className={classes.gridList}
              spacing={50}
            >
              {artistsDisplay()}
              <div className={classes.progress}>
                {loading ? <CircularProgress /> : <></>}
              </div>
            </GridList>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className={classes.root}>{content}</div>
    </>
  );
}
