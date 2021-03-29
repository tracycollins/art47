/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'redux';
import { useArtworksSlice } from './slice';
import { selectArtworks } from './slice/selectors';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import { useAuth0 } from '@auth0/auth0-react';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { createStructuredSelector } from 'reselect';

import {} from './slice/selectors';
// import {
//   makeSelectArtworks,
//   makeSelectCursor,
//   makeSelectFilter,
//   makeSelectCurrentUser,
//   makeSelectCurrentArtwork,
//   makeSelectLoading,
//   makeSelectError,
// } from 'app/selectors';

// import {
//   // loadArtworks,
//   setCurrentArtwork,
//   updateRating,
//   setFilter,
//   // setCursor,
// } from 'app/actions';

// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
// import reducer from 'app/reducer';
import { ArtworkExcerpt } from 'app/pages/ArtworkExcerpt/Loadable';
// import artworksSaga from './slice/saga';
// import saga from './saga';
import Artwork from '../Artwork';

// const key = 'global';

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

function ArtworksPage({
  cursor,
  handleSetFilter,
  filter,
  currentArtwork,
  currentUser,
  location,
  history,
  artworks,
  loading,
  // handleLoadMore,
  // handleSetCursor,
  handleSetCurrentArtwork,
  handleUpdateRating,
}) {
  const { actions } = useArtworksSlice();
  const dispatch = useDispatch();

  // useInjectReducer({ key, reducer });
  // useInjectSaga({ key, artworksSaga });
  // const { user } = useAuth0();
  const classes = useStyles();

  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(n => {
      if (n !== undefined) {
        setValue(n);
      } else {
        setValue(v => !v);
      }
    }, []);
    return [value, toggle];
  };

  const [topRated, toogleTopRated] = useToggle(filter.topRated);
  const [topRecs, toogleTopRecs] = useToggle(filter.topRecs);
  const [unrated, toogleUnrated] = useToggle(filter.unrated);

  const updateFilterSort = useCallback(newFilter => {
    console.log(`DISPLAY | FILTER`);
    console.log({ newFilter });
    handleSetFilter(newFilter);
    dispatch(actions.loadArtworks());
    // handleLoadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const prevNext = name => {
    let newIndex = 0;
    if (name === 'prev') {
      newIndex = currentIndex <= 0 ? artworks.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex >= artworks.length - 1 ? 0 : currentIndex + 1;
    }
    setCurrentIndex(newIndex);
    handleSetCurrentArtwork(artworks[newIndex]);
    history.push(`/artworks/${artworks[newIndex].id}`);
  };

  const artworkIdRegex = /\/artworks\/(\w+)/;
  const currentArtworkId =
    location && location.pathname && location.pathname.match(artworkIdRegex)
      ? parseInt(location.pathname.match(artworkIdRegex)[1], 10)
      : false;

  const currentArtworkIdRef = useRef(currentArtworkId);

  useEffect(() => {
    dispatch(actions.loadArtworks());
    // handleLoadMore();
    handleSetCurrentArtwork(
      currentArtworkIdRef.current
        ? artworks.find((artwork, index) => {
            if (artwork.id === currentArtworkIdRef.current) {
              setCurrentIndex(index);
              return artwork;
            }
            return false;
          })
        : false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // handleLoadMore();
    dispatch(actions.loadArtworks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHasNextPage(cursor && cursor._id !== 0);
  }, [cursor]);

  useEffect(() => {
    currentArtworkIdRef.current =
      // eslint-disable-next-line radix
      location && location.pathname && location.pathname.match(artworkIdRegex)
        ? parseInt(location.pathname.match(artworkIdRegex)[1], 10)
        : false;

    handleSetCurrentArtwork(
      currentArtworkIdRef.current
        ? artworks.find((artwork, index) => {
            if (artwork.id === currentArtworkIdRef.current) {
              setCurrentIndex(index);
              return artwork;
            }
            return false;
          })
        : false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  function infiniteHandleLoadMore() {
    // return handleLoadMore();
    return dispatch(actions.loadArtworks());
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: infiniteHandleLoadMore,
  });

  const artworksDisplay = () =>
    artworks.map(artwork => (
      <ArtworkExcerpt
        key={artwork.id}
        className={classes.gridListItem}
        user={currentUser}
        artwork={artwork}
        handleSetCurrent={() => handleSetCurrentArtwork(artwork)}
      />
    ));

  const content =
    currentArtworkId && currentArtwork ? (
      <div className={classes.artworkRoot}>
        <Artwork
          history={history}
          prevNext={prevNext}
          user={currentUser}
          artwork={currentArtwork}
          handleUpdateRating={handleUpdateRating}
        />
      </div>
    ) : (
      <>
        <AppBar className={classes.appBar} elevation={0} position="fixed">
          <Toolbar className={classes.toolBar}>
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
              REC SORT
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
              RATING SORT
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

ArtworksPage.propTypes = {
  artworks: PropTypes.array,
  currentUser: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  currentArtwork: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  handleSetFilter: PropTypes.func,
  filter: PropTypes.object,
  cursor: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  location: PropTypes.object,
  loading: PropTypes.bool,
  history: PropTypes.object,
  // handleSetCursor: PropTypes.func,
  // handleLoadMore: PropTypes.func,
  handleSetCurrentArtwork: PropTypes.func,
  handleUpdateRating: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  artworks: selectArtworks(),
  // filter: makeSelectFilter(),
  // cursor: makeSelectCursor(),
  // currentUser: makeSelectCurrentUser(),
  // currentArtwork: makeSelectCurrentArtwork(),
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    // // handleLoadMore: () => dispatch(loadArtworks()),
    // handleSetCurrentArtwork: artwork => dispatch(setCurrentArtwork(artwork)),
    // // handleSetCursor: cursor => dispatch(setCursor(cursor)),
    // handleSetFilter: filter => dispatch(setFilter(filter)),
    // handleUpdateRating: rating => dispatch(updateRating(rating)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ArtworksPage);
