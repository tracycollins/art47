/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { useRef, useCallback, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Image from 'material-ui-image';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
// import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
// import Link from '@material-ui/core/Link';
// import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
// import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import {
  selectUser,
  // selectLoading,
  selectLoaded,
} from 'app/pages/UserPage/slice/selectors';
import {
  selectLoaded as selectLoadedArtwork,
  selectCurrentArtwork,
  selectTopUnratedArtwork,
  selectArtworkByUser,
} from 'app/pages/ArtworksPage/slice/selectors';

import { ArtworkExcerpt } from 'app/pages/ArtworkExcerpt/Loadable';
import { artworksActions } from 'app/pages/ArtworksPage/slice';
import { userActions } from 'app/pages/UserPage/slice';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // margin: 'auto',
    marginTop: theme.spacing(10),
  },
  grid: {
    display: 'flex',
  },
  gridItemProfile: {
    // flex: 1,
  },
  gridItemArtworks: {
    flex: 1,
    marginLeft: theme.spacing(10),
  },
  gridItemArtworksTitle: {
    padding: theme.spacing(1),
    // color: theme.palette.primary.main,
  },
  topRecsArtworksTitle: {
    fontWeight: 400,
  },
  media: {
    display: 'block',
    width: 240,
    height: 240,
  },
  dropZone: {
    display: 'flex',
    height: '100%',
    margin: theme.spacing(1),
  },
  dropZoneMedia: {
    objectFit: 'constrain',
    height: '100%',
  },
  dropZoneText: {
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  table: {
    maxWidth: 200,
  },
  textField: {
    margin: theme.spacing(1),
    width: '40ch',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkList: {
    alignItems: 'top',
    justifyContent: 'top',
  },
  artworkListRoot: {
    display: 'flex',
  },
  appBar: {
    position: 'fixed',
    right: 72,
    color: theme.palette.primary.main,
  },
  profileCard: { width: 360 },
  artworkImage: { width: '100%', height: 360, objectFit: 'contain' },
  profileImage: { width: '100%', height: 360, objectFit: 'contain' },
  recommendation: {
    marginBottom: theme.spacing(1),
  },
  iconButton: {},
  info: {},
}));

export function UserPage() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const user = useSelector(selectUser);
  const artwork = useSelector(selectCurrentArtwork);
  const dispatch = useDispatch();
  const form = useRef(null);
  const artworkForm = useRef(null);
  const classes = useStyles();
  const loadedUser = useSelector(selectLoaded);
  const loadedArtwork = useSelector(selectLoadedArtwork);
  const artworks = useSelector(selectTopUnratedArtwork);
  const artistArtworks = useSelector(selectArtworkByUser);

  const onDropProfile = useCallback(acceptedFiles => {
    console.log(`DROPPED PROFILE FILES: ${acceptedFiles.length}`);
    const file = acceptedFiles[0];
    dispatch(
      userActions.uploadFile({
        dataType: 'image',
        type: 'profileImage',
        file: file,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  const dropZoneProfile = useDropzone({
    onDrop: onDropProfile,
  });

  const onDropArtwork = useCallback(acceptedFiles => {
    console.log(`DROPPED ARTWORK FILES: ${acceptedFiles.length}`);
    const file = acceptedFiles[0];
    dispatch(
      artworksActions.uploadFile({
        dataType: 'image',
        type: 'artworkImage',
        file: file,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  const dropZoneArtwork = useDropzone({
    onDrop: onDropArtwork,
  });

  const [addArtwork, setAddArtwork] = React.useState(false);
  const [artworkImage, setArtworkImage] = React.useState(
    artwork && artwork.image && artwork.image.url
      ? artwork.image.url
      : '/art47_logo.png',
  );

  const [editProfile, setEditProfile] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(
    user.image && user.image.url ? user.image.url : '/art47_logo.png',
  );

  useEffect(() => {
    if (isAuthenticated && loadedUser) {
      dispatch(userActions.getUserTopUnratedRecArtworks({ user }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadedUser, isAuthenticated]);

  useEffect(() => {
    if (user.image && user.image.url) {
      setProfileImage(user.image.url);
    } else if (user && user.picture) {
      setProfileImage(user.picture);
    } else {
      setProfileImage(`/art47_logo.png`);
    }
  }, [loadedUser, user, isAuthenticated]);

  useEffect(() => {
    if (artwork && artwork.image && artwork.image.url) {
      setArtworkImage(artwork.image.url);
    } else {
      setArtworkImage(`/art47_logo.png`);
    }
  }, [loadedArtwork, artwork, isAuthenticated]);

  const handleAddArtwork = () => {
    setAddArtwork(true);
  };

  const handleAddArtworkSubmit = e => {
    e.preventDefault();
    const formData = new FormData(artworkForm.current);
    const formArtwork = {};
    formData.forEach(
      (value, key) => (formArtwork[key] = value !== '' ? value : null),
    );
    const newArtwork = Object.assign({}, addArtworkForm);
    console.log({ newArtwork });
    dispatch(artworksActions.addArtwork({ artwork: newArtwork, user: user }));
    setAddArtwork(false);
  };

  const handleEditUser = () => {
    setEditProfile(true);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const formUser = {};
    formData.forEach(
      (value, key) => (formUser[key] = value !== '' ? value : null),
    );
    const newUser = Object.assign({}, user, formUser);
    dispatch(userActions.updateUser({ user: newUser }));
    dispatch(userActions.getUserTopUnratedRecArtworks({ user }));
    setEditProfile(false);
  };

  const handleFormCancel = () => {
    setEditProfile(false);
  };

  const handleAddArtworkFormCancel = () => {
    setAddArtwork(false);
  };

  const handleFormDelete = () => {
    // need confirmation modal
    setEditProfile(false);
  };

  const handleUserSiteClick = (event, name) => {
    event.preventDefault();
    let url;
    switch (name) {
      case 'user':
        if (user.userUrl) {
          if (user.userUrl.startsWith('http')) {
            url = user.userUrl;
          } else {
            url = `https://${user.userUrl}`;
          }
          window.open(url, '_blank');
        }
        break;

      case 'instagram':
        if (user.instagramUsername)
          window.open(
            `https://instagram.com/${user.instagramUsername.replace('@', '')}`,
            '_blank',
          );
        break;

      case 'twitter':
        if (user.twitterUsername)
          window.open(
            `https://twitter.com/${user.twitterUsername.replace('@', '')}`,
            '_blank',
          );
        break;

      case 'facebook':
        if (user.facebookUsername)
          window.open(
            `https://facebook.com/${user.facebookUsername}`,
            '_blank',
          );
        break;

      case 'search':
        window.open(
          `https://en.wikipedia.org/wiki/${user.displayName}`,
          '_blank',
        );
        break;

      default:
        break;
    }
  };
  const defaultArtworkImageUrl = '/art47_logo.png';

  const artworksDisplay = artworks => {
    console.log(`artworksDisplay | artworks: ${artworks.length}`);
    if (artworks.length === 0) {
      return <img key={0} alt="default" src={defaultArtworkImageUrl} />;
    }
    return artworks.map(artwork => {
      return <ArtworkExcerpt key={artwork.id} user={user} artwork={artwork} />;
    });
  };

  const userProfileForm = () => (
    <Container className={classes.root}>
      <Grid container className={classes.profileRoot}>
        <Grid item xs className={classes.gridItemProfile}>
          <Card className={classes.dropZone} elevation={0}>
            <CardMedia
              className={classes.profileImage}
              image={profileImage}
              {...dropZoneProfile.getRootProps()}
            >
              <input
                name={'profileImage'}
                {...dropZoneProfile.getInputProps()}
              />
              {dropZoneProfile.isDragActive ? (
                <Typography
                  className={classes.dropZoneText}
                  variant="h5"
                  component="h2"
                >
                  {`DROP HERE!`}
                </Typography>
              ) : (
                <Typography className={classes.dropZoneText}>
                  {`Drag 'n' drop a profile image here (jpg or png), or click to select a file`}
                </Typography>
              )}
            </CardMedia>
          </Card>
        </Grid>
        <Grid item xs className={classes.gridItemArtworks}>
          <form
            ref={form}
            className={classes.profileForm}
            noValidate
            autoComplete="off"
            onSubmit={handleFormSubmit}
          >
            <div className={classes.profileFormInput}>
              <TextField
                className={classes.textField}
                id="user-name-first"
                label="first name"
                name="firstName"
                defaultValue={user.firstName}
              />
              <TextField
                className={classes.textField}
                id="user-name-last"
                label="last name"
                name="lastName"
                defaultValue={user.lastName}
              />
              <TextField
                className={classes.textField}
                id="user-username"
                label="userName"
                name="userName"
                defaultValue={user.userName}
              />
              <TextField
                className={classes.textField}
                id="user-email"
                label="email"
                name="email"
                defaultValue={user.email}
              />
              <TextField
                className={classes.textField}
                id="user-location"
                label="location"
                name="location"
                defaultValue={user.location}
              />
              <TextField
                className={classes.textField}
                id="user-bio"
                label="bio"
                name="bio"
                defaultValue={user.bio}
              />
              <TextField
                className={classes.textField}
                id="user-url"
                label="user-url"
                name="userUrl"
                defaultValue={user.userUrl}
              />
              <TextField
                className={classes.textField}
                id="user-twitter"
                label="twitter username"
                name="twitterUsername"
                defaultValue={user.twitterUsername}
              />
              <TextField
                className={classes.textField}
                id="user-facebook"
                label="facebook username"
                name="facebookUsername"
                defaultValue={user.facebookUsername}
              />
              <TextField
                className={classes.textField}
                id="user-instagram-username"
                label="instagram username"
                name="instagramUsername"
                defaultValue={user.instagramUsername}
              />
              <TextField
                className={classes.textField}
                label="OAUTH ID"
                disabled
                defaultValue={user.oauthID}
              />
            </div>
            <ButtonGroup className={classes.buttonGroup}>
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
              >
                SAVE
              </Button>
              <Button
                className={classes.button}
                onClick={handleFormCancel}
                variant="contained"
              >
                CANCEL
              </Button>
              <Button
                className={classes.button}
                onClick={handleFormDelete}
                variant="contained"
                color="secondary"
              >
                DELETE
              </Button>
            </ButtonGroup>
          </form>
        </Grid>
      </Grid>
    </Container>
  );

  const userProfile = artworks => (
    <Container className={classes.root}>
      <Grid container className={classes.profileRoot}>
        <Grid item className={classes.gridItemProfile}>
          <Card
            className={classes.profileCard}
            style={{ backgroundColor: 'white' }}
            elevation={0}
          >
            <CardMedia
              className={classes.profileImage}
              component="img"
              alt="profile"
              image={profileImage}
              title="profile"
            />
            <CardContent>
              <Typography variant="h5" component="h2">
                {user ? `${user.firstName} ${user.lastName}` : ''}
              </Typography>
              <Typography variant="h6" component="h3">
                {user ? `username: ${user.userName}` : ''}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography>{user ? user.email : ''}</Typography>
              <Typography>{user ? user.location : ''}</Typography>
            </CardContent>
            <IconButton
              className={classes.iconButton}
              disabled={user.userUrl === undefined}
              onClick={event => handleUserSiteClick(event, 'user')}
              aria-label="user's web site"
            >
              <AccountBoxIcon className={classes.iconButton} />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              disabled={user.instagramUsername === undefined}
              onClick={event => handleUserSiteClick(event, 'instagram')}
              aria-label="user's instagram"
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              disabled={user.twitterUsername === undefined}
              onClick={event => handleUserSiteClick(event, 'twitter')}
              aria-label="user's twitter"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              disabled={user.facebookUsername === undefined}
              onClick={event => handleUserSiteClick(event, 'facebook')}
              aria-label="user's facebook"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              onClick={event => handleUserSiteClick(event, 'search')}
              aria-label="search for user"
            >
              <SearchIcon />
            </IconButton>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {user.bio}
              </Typography>
            </CardContent>
            <CardActions>
              {user && isAuthenticated ? (
                <>
                  <Button
                    onClick={handleEditUser}
                    variant="contained"
                    color="primary"
                  >
                    UPDATE
                  </Button>
                  <Button
                    onClick={logout}
                    variant="contained"
                    color="secondary"
                  >
                    LOGOUT
                  </Button>
                </>
              ) : (
                <Button
                  onClick={loginWithRedirect}
                  variant="contained"
                  color="primary"
                >
                  LOGIN
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        <Grid item className={classes.gridItemArtworks}>
          <div>
            {user && isAuthenticated ? (
              <>
                <Button
                  onClick={handleAddArtwork}
                  variant="contained"
                  color="primary"
                >
                  ADD ARTWORK
                </Button>
              </>
            ) : (
              <Button
                onClick={loginWithRedirect}
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button>
            )}{' '}
            <div className={classes.artworkList}>
              <GridList
                className={classes.gridList}
                component={'div'}
                cellHeight={200}
                spacing={5}
                cols={6}
              >
                {artworksDisplay(artistArtworks)}
              </GridList>
            </div>
          </div>
          <Typography
            className={classes.gridItemArtworksTitle}
            variant="h5"
            component="h2"
          >
            your artwork
          </Typography>
        </Grid>{' '}
        <Grid item className={classes.gridItemArtworks}>
          <div className={classes.artworkListRoot}>
            <div className={classes.artworkList}>
              <GridList
                className={classes.gridList}
                component={'div'}
                cellHeight={200}
                spacing={5}
                cols={6}
              >
                {artworksDisplay(artworks)}
              </GridList>
            </div>
          </div>
          <Typography
            className={classes.gridItemArtworksTitle}
            variant="h5"
            component="h2"
          >
            your top unrated recs
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );

  const addArtworkForm = () => (
    <Container className={classes.root}>
      <Grid container className={classes.artworkRoot}>
        <Grid item xs className={classes.gridItemArtwork}>
          <Card className={classes.dropZone} elevation={0}>
            <CardMedia
              className={classes.artworkImage}
              image={artworkImage}
              {...dropZoneArtwork.getRootProps()}
            >
              <input
                name={'artworkImage'}
                {...dropZoneArtwork.getInputProps()}
              />
              {dropZoneArtwork.isDragActive ? (
                <Typography
                  className={classes.dropZoneText}
                  variant="h5"
                  component="h2"
                >
                  {`DROP ARTWORK HERE!`}
                </Typography>
              ) : (
                <Typography className={classes.dropZoneText}>
                  {`Drag 'n' drop a artwork image here (jpg or png), or click to select a file`}
                </Typography>
              )}
            </CardMedia>
          </Card>
        </Grid>
        <Grid item xs>
          <form
            ref={artworkForm}
            className={classes.artworkForm}
            noValidate
            autoComplete="off"
            onSubmit={handleAddArtworkSubmit}
          >
            <div className={classes.addArtworkFormInput}>
              <TextField
                className={classes.textField}
                id="artwork-title"
                label="title"
                name="artworkTitle"
                defaultValue={`untitled_${Date.now()}`}
              />
            </div>
            <ButtonGroup className={classes.buttonGroup}>
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
              >
                SAVE
              </Button>
              <Button
                className={classes.button}
                onClick={handleAddArtworkFormCancel}
                variant="contained"
              >
                CANCEL
              </Button>
              <Button
                className={classes.button}
                onClick={handleFormDelete}
                variant="contained"
                color="secondary"
              >
                DELETE
              </Button>
            </ButtonGroup>
          </form>
        </Grid>
      </Grid>
    </Container>
  );

  const content = ({ editProfile, addArtwork, artworks }) => {
    if (editProfile) {
      return userProfileForm();
    } else if (addArtwork) {
      return addArtworkForm();
    } else {
      return userProfile(artworks);
    }
  };

  return (
    <div className={classes.root}>
      {content({ editProfile, addArtwork, artworks })}
    </div>
  );
}
