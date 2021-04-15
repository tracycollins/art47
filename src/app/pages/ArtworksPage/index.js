/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useArtworksSlice } from './slice';
import { initialState } from './slice';
import {
  selectArtworks,
  selectArtworksDisplayIds,
  selectCurrentArtwork,
  selectHasNextPage,
  selectLoading,
  // selectLoaded,
  selectError,
  selectCursor,
} from './slice/selectors';

import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {} from './slice/selectors';
import { ArtworkExcerpt } from 'app/pages/ArtworkExcerpt/Loadable';
import { Artwork } from '../Artwork';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  artworkRoot: {
    marginRight: theme.spacing(10),
    // marginTop: theme.spacing(10),
    width: '100%',
  },
  artworkList: {
    display: 'flex',
  },
  artworkListRoot: {
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

export function ArtworksPage() {
  let history = useHistory();

  const artworkIdRegex = /\/artworks\/(\w+)/;
  const urlArtworkId =
    history.location &&
    history.location.pathname &&
    history.location.pathname.match(artworkIdRegex)
      ? parseInt(history.location.pathname.match(artworkIdRegex)[1], 10)
      : false;

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

  const { actions } = useArtworksSlice();

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const artworks = useSelector(selectArtworks);
  const artworksDisplayIds = useSelector(selectArtworksDisplayIds);
  const currentArtwork = useSelector(selectCurrentArtwork);
  const hasNextPage = useSelector(selectHasNextPage);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const cursor = useSelector(selectCursor);

  const [displayCurrentArtwork, setDisplayCurrentArtwork] = useState(false);
  const [topRated, toogleTopRated] = useToggle();
  const [topRecs, toogleTopRecs] = useToggle();
  const [unrated, toogleUnrated] = useToggle();

  const classes = useStyles();

  useEffect(() => {
    if (urlArtworkId) {
      console.log(
        `ArtworksPage | getArtworks` +
          ` | ${artworks ? artworks.length : 0} ARTWORKS` +
          ` | displayCurrentArtwork: ${displayCurrentArtwork}` +
          ` | loading: ${loading}` +
          ` | hasNextPage: ${hasNextPage}` +
          ` | urlArtworkId: ${urlArtworkId}`,
      );

      if (!currentArtwork || currentArtwork.id !== urlArtworkId) {
        dispatch(actions.getArtworkById(urlArtworkId));
      }
      dispatch(actions.setCurrentArtworkId(urlArtworkId));
      setDisplayCurrentArtwork(true);
    } else {
      setDisplayCurrentArtwork(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    artworks,
    currentArtwork,
    displayCurrentArtwork,
    urlArtworkId,
    loading,
    hasNextPage,
    cursor,
  ]);

  const updateFilterSort = useCallback(
    newFilter => {
      const options = { user };
      console.log(`UPDATE FILTER SORT`);
      console.log({ newFilter });
      dispatch(actions.setCursor({ cursor: initialState.cursor }));
      dispatch(actions.updateFilterSort({ filter: newFilter }));
      dispatch(actions.getArtworks(options));
      dispatch(actions.artworksFilterSort());
    },
    [actions, dispatch, user],
  );

  useEffect(() => {
    updateFilterSort({ topRated, topRecs, unrated });
  }, [updateFilterSort, displayCurrentArtwork, topRated, topRecs, unrated]);

  useEffect(() => {
    dispatch(actions.getArtworks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFilter = useCallback(
    toggle => {
      if (toggle.topRated) {
        toogleTopRated();
        toogleTopRecs(false);
        toogleUnrated(false);
      }
      if (toggle.topRecs) {
        toogleTopRated(false);
        toogleTopRecs();
        toogleUnrated(false);
      }
      if (toggle.unrated) {
        toogleTopRated(false);
        toogleTopRecs(false);
        toogleUnrated();
      }
    },
    [toogleTopRated, toogleTopRecs, toogleUnrated],
  );

  function infiniteHandleLoadMore() {
    const options = { user };
    if (!loading) {
      console.log(
        `infiniteHandleLoadMore | DISPATCH | hasNextPage: ${hasNextPage} | loading: ${loading}`,
      );
      dispatch(actions.getArtworks(options));
    }
    console.log(
      `infiniteHandleLoadMore` +
        ` | LAST ARTWORK ID: ${
          artworks.length > 0 ? artworks[artworks.length - 1].id : null
        }` +
        ` | cursor.id: ${cursor && cursor.id ? cursor.id : null}` +
        ` | loading: ${loading}` +
        ` | hasNextPage: ${hasNextPage}`,
    );
  }

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: infiniteHandleLoadMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  const handlePrevNext = (prevNext, artworkId) => {
    console.log(`handlePrevNext | ${prevNext} | ARTWORK ID: ${artworkId}`);
    const currentIndex = artworksDisplayIds.findIndex(id => artworkId === id);

    let newArtworkId = '';

    if (prevNext === 'next') {
      newArtworkId =
        currentIndex === artworksDisplayIds.length - 1
          ? artworksDisplayIds[0]
          : artworksDisplayIds[currentIndex + 1];
    } else {
      newArtworkId =
        currentIndex === 0
          ? artworksDisplayIds[artworksDisplayIds.length - 1]
          : artworksDisplayIds[currentIndex - 1];
    }
    console.log({ newArtworkId });
    history.push(`/artworks/${newArtworkId}`);
  };

  const handleUpdateRating = rating => {
    console.log({ rating });
    dispatch(actions.updateRating({ rating }));
    dispatch(actions.setCurrentArtworkId(urlArtworkId));
  };

  const artworksDisplay = () => {
    const displayArtworks = artworksDisplayIds.map(id =>
      artworks.find(artwork => artwork.id === id),
    );
    return displayArtworks.map(artwork => (
      <ArtworkExcerpt key={artwork.id} user={user} artwork={artwork} />
    ));
  };

  const content = displayCurrentArtwork ? (
    <div className={classes.artworkRoot}>
      <Artwork
        artwork={currentArtwork}
        prevNext={handlePrevNext}
        handleUpdateRating={handleUpdateRating}
      />
    </div>
  ) : (
    <>
      <AppBar className={classes.appBar} elevation={0} position="fixed">
        <Toolbar className={classes.toolBar}>
          <div className={classes.toolBarButton}>
            {loading ? <CircularProgress /> : <></>}
          </div>
          <Button
            className={classes.toolBarButton}
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
            RECS
          </Button>
          <Button
            className={classes.toolBarButton}
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
            RATED
          </Button>
          <Button
            className={classes.toolBarButton}
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
            UNRATED
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.artworkListRoot}>
        <GridList
          component={'div'}
          cellHeight={160}
          className={classes.gridList}
          spacing={50}
        >
          {artworksDisplay()}
          <div className={classes.gridList} ref={infiniteRef}></div>
        </GridList>
      </div>
    </>
  );

  return (
    <>
      <div className={classes.root}>{content}</div>
    </>
  );
}
