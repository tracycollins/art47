/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useArtistsSlice } from './slice';
// import { initialState } from './slice';
import {
  selectArtists,
  selectArtistsDisplayIds,
  selectCurrentArtist,
  selectHasNextPage,
  selectLoading,
  selectLoaded,
  selectError,
  selectCursor,
} from './slice/selectors';

import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {} from './slice/selectors';
import { ArtistExcerpt } from 'app/pages/ArtistExcerpt/Loadable';
import { Artist } from '../Artist';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  artistRoot: {
    marginRight: theme.spacing(10),
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

  const artistIdRegex = /\/artists\/(\w+)/;
  const urlArtistId =
    history.location &&
    history.location.pathname &&
    history.location.pathname.match(artistIdRegex)
      ? parseInt(history.location.pathname.match(artistIdRegex)[1], 10)
      : false;

  const { actions } = useArtistsSlice();

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const artists = useSelector(selectArtists);
  const artistsDisplayIds = useSelector(selectArtistsDisplayIds);
  const currentArtist = useSelector(selectCurrentArtist);
  const hasNextPage = useSelector(selectHasNextPage);
  const loading = useSelector(selectLoading);
  const loaded = useSelector(selectLoaded);
  const error = useSelector(selectError);
  const cursor = useSelector(selectCursor);

  const [displayCurrentArtist, setDisplayCurrentArtist] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    console.log({ hasNextPage });

    if (urlArtistId) {
      console.log(
        `ArtistsPage | getArtists` +
          ` | ${artists ? artists.length : 0} ARTISTS` +
          ` | displayCurrentArtist: ${displayCurrentArtist}` +
          ` | loaded: ${loaded}` +
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
      setDisplayCurrentArtist(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artists, urlArtistId, loading, loaded, hasNextPage]);

  useEffect(() => {
    dispatch(actions.getArtists());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function infiniteHandleLoadMore() {
    const options = { user };
    if (!loading) {
      console.log(
        `infiniteHandleLoadMore | DISPATCH | hasNextPage: ${hasNextPage} | loading: ${loading}`,
      );
      dispatch(actions.getArtists(options));
    }
    console.log(
      `infiniteHandleLoadMore` +
        ` | LAST ARTWORK ID: ${
          artists.length > 0 ? artists[artists.length - 1].id : null
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

  const handlePrevNext = (prevNext, artistId) => {
    // console.log(`handlePrevNext | ${prevNext} | ARTIST ID: ${artistId}`);
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
    // console.log({ newArtistId });
    history.push(`/artists/${newArtistId}`);
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
      <Artist artist={currentArtist} prevNext={handlePrevNext} />
    </div>
  ) : (
    <>
      <AppBar className={classes.appBar} elevation={0} position="fixed">
        <Toolbar className={classes.toolBar}>
          <div className={classes.toolBarButton}>
            {loading ? <CircularProgress /> : <></>}
          </div>
        </Toolbar>
      </AppBar>
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
              <div className={classes.gridList} ref={infiniteRef}></div>
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
