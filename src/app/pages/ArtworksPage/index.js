/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useArtworksSlice } from './slice';
// import { selectArtworks, selectLoading, selectError } from './slice/selectors';
import {
  selectArtworks,
  selectCurrentArtwork,
  selectLoading,
  selectCursor,
} from './slice/selectors';
// import { ArtworkErrorType } from './slice/types';

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

  // const currentArtworkIdRef = useRef(currentArtworkId);

  const [displayCurrentArtwork, setDisplayCurrentArtwork] = useState(false);

  const { actions } = useArtworksSlice();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const artworks = useSelector(selectArtworks);
  const currentArtwork = useSelector(selectCurrentArtwork);
  const loading = useSelector(selectLoading);
  const cursor = useSelector(selectCursor);
  const [hasNextPage, setHasNextPage] = useState(true);

  // const error = useSelector(selectError);

  const classes = useStyles();

  useEffect(() => {
    console.log(`ArtworksPage | getArtworks | urlArtworkId: ${urlArtworkId}`);
    const options = { user };
    // if (artworks.length === 0) {
    //   dispatch(actions.getArtworkById(options));
    // }
    if (urlArtworkId) {
      if (!currentArtwork || currentArtwork.id !== urlArtworkId) {
        dispatch(actions.getArtworkById(urlArtworkId));
      }
      dispatch(actions.setCurrentArtworkId(urlArtworkId));
      setDisplayCurrentArtwork(true);
    } else {
      setDisplayCurrentArtwork(false);
      if (artworks.length === 0) {
        dispatch(actions.setCurrentArtworkId(null));
        dispatch(actions.getArtworks(options));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlArtworkId, loading]);

  function infiniteHandleLoadMore() {
    setHasNextPage(false);
    const options = { user };
    if (hasNextPage) {
      dispatch(actions.getArtworks(options));
    }
    setHasNextPage(cursor && cursor._id !== null);
    console.log(
      `infiniteHandleLoadMore` +
        ` | LAST ARTWORK ID: ${
          artworks.length > 0 ? artworks[artworks.length - 1].id : null
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

  const handlePrevNext = (prevNext, artworkId) => {
    console.log(`handlePrevNext | ${prevNext} | ARTWORK ID: ${artworkId}`);
    let newArtworkId = '';
    if (prevNext === 'next') {
      newArtworkId =
        artworkId === artworks[artworks.length - 1].id
          ? parseInt(artworks[0].id)
          : parseInt(artworkId) + 1;
    } else {
      newArtworkId =
        parseInt(artworkId) === 1
          ? parseInt(artworks[artworks.length - 1].id)
          : parseInt(artworkId) - 1;
    }
    console.log({ newArtworkId });
    history.push(`/artworks/${newArtworkId}`);
    // dispatch(actions.setCurrentArtwork(artwork_id));
  };

  const handleUpdateRating = rating => {
    console.log({ rating });
    dispatch(actions.updateRating({ rating }));
    dispatch(actions.setCurrentArtworkId(urlArtworkId));
  };

  const artworksDisplay = () =>
    artworks.map(artwork => (
      <ArtworkExcerpt key={artwork.id} user={user} artwork={artwork} />
    ));

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
          <Button
            className={classes.toolBarButton}
            onClick={() => console.log('click topRecs')}
            variant="contained"
          >
            REC SORT
          </Button>
          <Button
            className={classes.toolBarButton}
            onClick={() => console.log('click topRated')}
            variant="contained"
          >
            RATING SORT
          </Button>
          <Button
            className={classes.toolBarButton}
            onClick={() => console.log('click unrated')}
            variant="contained"
          >
            YOUR UNRATED
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.artworkListRoot}>
        <div className={classes.artworkList}>
          {artworks.length === 0 ? (
            <CircularProgress />
          ) : (
            <GridList
              component={'div'}
              ref={infiniteRef}
              cellHeight={160}
              className={classes.gridList}
              spacing={50}
            >
              {artworksDisplay()}
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
