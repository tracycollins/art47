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
  console.log({ history });

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
  const hasNextPage = true;

  // const isLoading = useSelector(selectLoading);
  // const error = useSelector(selectError);

  console.log({ user });
  console.log({ cursor });
  console.log({ loading });
  console.log({ artworks });

  const classes = useStyles();

  useEffect(() => {
    console.log(`ArtworksPage | getArtworks | urlArtworkId: ${urlArtworkId}`);
    const options = { user };
    const results = dispatch(actions.getArtworks(options));
    console.log({ results });
    console.log({ urlArtworkId });
    if (urlArtworkId) {
      dispatch(actions.setCurrentArtworkId(urlArtworkId));
      setDisplayCurrentArtwork(true);
    } else {
      dispatch(actions.setCurrentArtworkId(null));
      setDisplayCurrentArtwork(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlArtworkId]);

  function infiniteHandleLoadMore() {
    console.log(`infiniteHandleLoadMore`);
    const options = { user };
    return dispatch(actions.getArtworks(options));
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: infiniteHandleLoadMore,
  });

  // const handleSetCurrentArtwork = artwork_id => {
  //   dispatch(actions.setCurrentArtworkId(artwork_id));
  //   setDisplayCurrentArtwork(true);
  // };

  const handlePrevNext = artwork_id => {
    // dispatch(actions.setCurrentArtwork(artwork_id));
  };

  const handleUpdateRating = artwork_id => {
    // dispatch(actions.setCurrentArtwork(artwork_id));
  };
  // export function ArtworkExcerpt({ key, user, artwork, handleSetCurrent }) {

  const artworksDisplay = () =>
    artworks.map(artwork => (
      <ArtworkExcerpt key={artwork.id} user={user} artwork={artwork} />
    ));

  // function Artwork({ user, artwork, prevNext, handleUpdateRating, history }) {

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
