/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { memo } from 'react';
// import { push } from 'connected-react-router';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@material-ui/core/styles';
// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectLoading, makeSelectError } from 'app/selectors';
// import { updateRating } from 'app/actions';

import { useHotkeys } from 'react-hotkeys-hook';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Image from 'material-ui-image';
import Rating from '@material-ui/lab/Rating';
import IconButton from '@material-ui/core/IconButton';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const useStyles = makeStyles(theme => ({
  root: {
    width: '50%',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    right: 72,
    backgroundColor: 'transparent',
  },
  toolBar: {
    justifyContent: 'flex-end',
  },

  title: {},
  image: {
    // align: "center",
    // alignItems: "center",
    // textAlign: "center",
    // marginTop: theme.spacing(10),
  },
  recommendation: {
    marginBottom: theme.spacing(1),
  },
  info: {
    width: 0.15 * window.innerWidth,
  },
  artworkInfo: {
    marginBottom: theme.spacing(1),
  },
  rating: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function Artwork({ user, artwork, prevNext, handleUpdateRating, history }) {
  const { isAuthenticated } = useAuth0();

  console.log({ user });
  console.log({ artwork });

  const classes = useStyles();

  // const [ratingUser, setRatingUser] = useState(null);

  // useEffect(() => {
  //   setRatingUser(artwork.ratingUser);
  //   console.log(`artwork.ratingUser: `, artwork.ratingUser);
  // }, [artwork, user]);

  const handleSetRating = ratingInput => {
    if (!isAuthenticated) {
      console.log('!!! NOT LOGGED IN - RATING IGNORED');
      return;
    }

    const ratingInstance = {
      user,
      artwork,
      rate: ratingInput,
    };

    handleUpdateRating(ratingInstance);
  };

  useHotkeys('up', () => history.push(`/artworks`), [artwork]);
  useHotkeys('left', () => prevNext('prev'), [artwork]);
  useHotkeys('right', () => prevNext('next'), [artwork]);
  useHotkeys('n', () => prevNext('next'), [artwork]);
  useHotkeys('p', () => prevNext('prev'), [artwork]);
  useHotkeys('0', () => handleSetRating(0), [isAuthenticated, user, artwork]);
  useHotkeys('1', () => handleSetRating(1), [isAuthenticated, user, artwork]);
  useHotkeys('2', () => handleSetRating(2), [isAuthenticated, user, artwork]);
  useHotkeys('3', () => handleSetRating(3), [isAuthenticated, user, artwork]);
  useHotkeys('4', () => handleSetRating(4), [isAuthenticated, user, artwork]);
  useHotkeys('5', () => handleSetRating(5), [isAuthenticated, user, artwork]);

  const content = () =>
    artwork ? (
      <Container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className={classes.root}
      >
        <Image
          className={classes.image}
          src={artwork.image ? artwork.image.url : null}
          alt={artwork.title}
          imageStyle={{
            objectFit: 'contain',
          }}
        />
        <AppBar className={classes.appBar} elevation={0} position="fixed">
          <Toolbar className={classes.toolBar}>
            <Card className={classes.info}>
              <CardContent className={classes.artworkInfo}>
                <Typography variant="h6">{artwork.title}</Typography>
                <Link
                  to={{
                    pathname: `/artists/${artwork.artist.id}`,
                  }}
                >
                  <Typography className={classes.title} color="textSecondary">
                    {artwork.artist ? artwork.artist.displayName : ''}
                  </Typography>
                </Link>
              </CardContent>
              <Divider />
              <CardContent className={classes.recommendation}>
                <Typography color="textSecondary">
                  {`RECOMMENDATION: ${parseInt(
                    artwork.recommendationUser
                      ? 100 * artwork.recommendationUser.score
                      : 0,
                    10,
                  )}`}
                </Typography>
                <div>
                  <LinearProgress
                    variant="determinate"
                    value={
                      artwork.recommendationUser
                        ? 100 * artwork.recommendationUser.score
                        : 0
                    }
                  />
                </div>
              </CardContent>
              <Divider />
              <CardActions className={classes.rating}>
                <IconButton
                  size="small"
                  aria-label="0 rate"
                  color={
                    artwork.ratingUser &&
                    artwork.ratingUser.user._id === user._id &&
                    artwork.ratingUser.rate === 0
                      ? 'secondary'
                      : 'primary'
                  }
                  onClick={() => handleSetRating(0)}
                >
                  <NotInterestedIcon />
                </IconButton>
                <Rating
                  name="rate"
                  value={
                    artwork.ratingUser &&
                    artwork.ratingUser.user &&
                    artwork.ratingUser.user._id === user._id
                      ? artwork.ratingUser.rate
                      : 0
                  }
                  onChange={(event, newValue) => handleSetRating(newValue)}
                />
              </CardActions>
              <Divider />
              <CardActions>
                <IconButton
                  size="medium"
                  value="prev"
                  onClick={() => prevNext('prev')}
                >
                  <ArrowBackIosRoundedIcon />
                </IconButton>
                <IconButton
                  size="medium"
                  value="next"
                  onClick={() => prevNext('next')}
                >
                  <ArrowForwardIosRoundedIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Toolbar>
        </AppBar>
      </Container>
    ) : (
      <>what</>
    );

  return <div>{content(artwork)}</div>;
}

Artwork.propTypes = {
  prevNext: PropTypes.func,
  artwork: PropTypes.object,
  user: PropTypes.object,
  handleUpdateRating: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // handleUpdateRating: rating => {
    //   console.log(`dispatch updateRating`, rating);
    //   dispatch(updateRating(rating));
    // },
  };
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Artwork);
