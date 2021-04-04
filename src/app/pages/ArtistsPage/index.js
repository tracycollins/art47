/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useArtistsSlice } from './slice';
import {
  selectArtists,
  selectArtistsDisplayIds,
  selectCurrentArtist,
  selectLoading,
  selectCursor,
  // selectFilter,
} from './slice/selectors';

import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
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

  console.log({ history });

  const artistIdRegex = /\/artists\/(\w+)/;
  const urlArtistId =
    history.location &&
    history.location.pathname &&
    history.location.pathname.match(artistIdRegex)
      ? parseInt(history.location.pathname.match(artistIdRegex)[1], 10)
      : false;

  console.log({ urlArtistId });

  const { actions } = useArtistsSlice();

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const artists = useSelector(selectArtists);
  const artistsDisplayIds = useSelector(selectArtistsDisplayIds);
  const currentArtist = useSelector(selectCurrentArtist);
  const loading = useSelector(selectLoading);
  const cursor = useSelector(selectCursor);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [displayCurrentArtist, setDisplayCurrentArtist] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setHasNextPage(cursor && cursor._id !== null);
  }, [cursor]);

  useEffect(() => {
    const options = { user };

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
  }, [urlArtistId]);

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
        // handleUpdateRating={handleUpdateRating}
      />
    </div>
  ) : (
    <>
      {/* <AppBar className={classes.appBar} elevation={0} position="fixed">
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
      </AppBar> */}
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
