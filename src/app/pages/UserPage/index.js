/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { useRef, useCallback, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Image from 'material-ui-image';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
// import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
// import Link from '@material-ui/core/Link';
// import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
  selectLoading,
  selectLoaded,
} from 'app/pages/UserPage/slice/selectors';
import { selectTopUnratedArtwork } from 'app/pages/ArtworksPage/slice/selectors';

import { ArtworkExcerpt } from 'app/pages/ArtworkExcerpt/Loadable';
import { userActions } from 'app/pages/UserPage/slice';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  grid: {
    margin: theme.spacing(1),
    display: 'flex',
  },
  gridItem: {
    flex: 3,
    margin: theme.spacing(1),
  },
  gridItemArtworks: {
    flex: 5,
  },
  topRecsArtworksTitle: {
    fontWeight: 400,
    margin: theme.spacing(1),
  },
  media: {
    display: 'block',
    width: 240,
    height: 240,
    margin: theme.spacing(1),
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
    margin: theme.spacing(1),
  },
  gridList: {
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'top',
    marginTop: theme.spacing(1),
    maxHeight: 0.85 * window.innerHeight,
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
  image: {},
  recommendation: {
    marginBottom: theme.spacing(1),
  },
  iconButton: {},
  info: {},
}));

export function UserPage() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const form = useRef(null);

  const classes = useStyles();
  // const loading = useSelector(selectLoading);
  const loadedUser = useSelector(selectLoaded);
  // const loadedArtwork = useSelector(selectArtworkLoaded);
  const artworks = useSelector(selectTopUnratedArtwork);

  console.log(`artworks: ${artworks.length}`);

  const onDrop = useCallback(acceptedFiles => {
    console.log(`DROPPED FILES: ${acceptedFiles.length}`);
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [editProfile, setEditProfile] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(
    user.image && user.image.url ? user.image.url : '/art47_logo.png',
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(userActions.getUserTopUnratedRecArtworks({ user }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectLoading, isAuthenticated]);

  useEffect(() => {
    if (user.image && user.image.url) {
      setProfileImage(user.image.url);
    } else if (user && user.picture) {
      setProfileImage(user.picture);
    } else {
      setProfileImage(`/art47_logo.png`);
    }
  }, [loadedUser, user, isAuthenticated]);

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
    <Grid container className={classes.profileRoot}>
      <Grid item xs className={classes.profile}>
        <Card className={classes.dropZone} elevation={0}>
          <CardMedia
            className={classes.dropZoneMedia}
            image={profileImage}
            {...getRootProps()}
          >
            <input name={'profileImage'} {...getInputProps()} />
            {isDragActive ? (
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
      <Grid item xs className={classes.profile}>
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
  );

  const userProfile = artworks => (
    <Container className={classes.root}>
      <Grid container className={classes.grid}>
        <Grid item className={classes.gridItem}>
          <Card style={{ backgroundColor: 'white' }}>
            <Image
              style={{ backgroundColor: 'white' }}
              className={classes.image}
              src={profileImage}
              alt={user.displayName}
              imageStyle={{
                objectFit: 'contain',
              }}
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
          <Typography variant="h6" className={classes.topRecsArtworksTitle}>
            Your Top Unrated Recs
          </Typography>

          <div className={classes.artworkListRoot}>
            <div className={classes.artworkList}>
              <GridList
                className={classes.gridList}
                component={'div'}
                cellHeight={200}
                cellWidth={200}
                spacing={5}
                cols={6}
              >
                {artworksDisplay(artworks)}
              </GridList>
            </div>
          </div>
        </Grid>
      </Grid>

      <AppBar className={classes.appBar} elevation={0} position="fixed">
        <Toolbar className={classes.toolBar}></Toolbar>
      </AppBar>
    </Container>
  );

  const content = ({ editProfile, artworks }) =>
    editProfile ? userProfileForm() : userProfile(artworks);

  return (
    <Container className={classes.root}>
      {content({ editProfile, artworks })}
    </Container>
  );
}
