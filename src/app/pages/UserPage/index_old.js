/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'material-ui-image';

import { useDropzone } from 'react-dropzone';
// import { useUserSlice } from 'app/pages/UserPage/slice';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
// import Paper from '@material-ui/core/Paper';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { userActions } from 'app/pages/UserPage/slice';
import { statsActions } from 'app/pages/StatsPage/slice';

const DEBUG_MODE = false;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    // flexDirection: 'column',
    width: '100%',
  },
  profileRoot: {
    // display: 'flex',
    // flexDirection: 'column',
    width: '100%',
  },
  stats: {
    display: 'flex',
    width: '50%',
    margin: theme.spacing(1),
  },
  table: {
    // minWidth: 650,
    maxWidth: 200,
  },
  media: {
    display: 'block',
    width: 240,
    height: 240,
    margin: theme.spacing(1),
  },
  dropZone: {
    margin: theme.spacing(1),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  textField: {
    margin: theme.spacing(1),
    width: '40ch',
  },
  profile: {
    display: 'flex',
    // alignItems: 'center',
    // flexDirection: 'column',

    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    // justifyContent: 'right',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  profileFormInput: {
    // backgroundColor: '#eeeeee',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  profileImage: {},
  button: {
    marginRight: theme.spacing(1),
    // marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    // width: '100%',
    margin: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  avatar: {},
}));

export function UserPage() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const form = useRef(null);
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(selectUser);

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
    setEditProfile(false);
  };

  const handleFormCancel = () => {
    setEditProfile(false);
  };

  const handleFormDelete = () => {
    // need confirmation modal
    setEditProfile(false);
  };

  const createLink = ({ user, linkType }) => {
    let url = '';
    let text = '';
    let icon;
    switch (linkType) {
      case 'userUrl':
        if (user.userUrl) {
          if (user.userUrl.startsWith('http')) {
            url = user.userUrl;
          } else {
            url = `https://${user.userUrl}`;
          }
          text = user.userUrl;
          icon = <AccountBoxIcon />;
        }
        break;

      case 'instagram':
        if (user.instagramUsername) {
          url = `https://instagram.com/${user.instagramUsername}`;
          text = `${user.instagramUsername}`;
          icon = <InstagramIcon />;
        }
        break;

      case 'twitter':
        if (user.twitterUsername) {
          url = `https://twitter.com/${user.twitterUsername}`;
          text = `${user.twitterUsername}`;
          icon = <TwitterIcon />;
        }
        break;

      case 'facebook':
        if (user.facebookUsername) {
          url = `https://facebook.com/${user.facebookUsername}`;
          text = `${user.facebookUsername}`;
          icon = <FacebookIcon />;
        }
        break;

      default:
        return <div key={linkType}> </div>;
    }
    return (
      <Typography key={linkType}>
        {icon}
        <Link href={url} target="_blank" rel="noreferrer">
          {/* {text} */}
        </Link>
      </Typography>
    );
  };

  const userLinkTypes = ['userUrl', 'twitter', 'instagram', 'facebook'];
  const userLinks = () =>
    userLinkTypes.map(linkType => {
      return createLink({ user, linkType });
    });

  useEffect(() => {
    dispatch(statsActions.getStats());
  }, [dispatch]);

  useEffect(() => {
    if (user.image && user.image.url) {
      setProfileImage(user.image.url);
    } else if (user && user.picture) {
      setProfileImage(user.picture);
    } else {
      setProfileImage(`/art47_logo.png`);
    }
  }, [user]);

  const userProfile = () => (
    <Grid container className={classes.profileRoot}>
      <Grid item xs className={classes.profileImage}>
        <Image
          className={classes.media}
          src={profileImage}
          alt={'profile image'}
          imageStyle={{
            objectFit: 'contain',
          }}
        />
      </Grid>

      <Grid item xs className={classes.profile}>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </Typography>
            <Typography variant="h6" component="h3">
              {user ? `username: ${user.userName}` : ''}
            </Typography>
            <Divider />
            <Typography>{user ? user.email : ''}</Typography>
            <Typography>{user ? user.location : ''}</Typography>
            <Divider />
            <Typography>{user ? user.bio : ''}</Typography>
            <Divider />
            {userLinks()}
            <Typography>
              {user && DEBUG_MODE ? `ID: ${user.id}` : ''}
            </Typography>
            <Typography>
              {user && DEBUG_MODE ? `DB ID: ${user._id}` : ''}
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
                <Button onClick={logout} variant="contained" color="secondary">
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
    </Grid>
  );

  const userProfileForm = () => (
    <Container>
      <div className={classes.profile}>
        <CardMedia className={classes.profileImage} image={profileImage} />
        <CardMedia
          className={classes.media}
          image={'/art47_logo.png'}
          {...getRootProps()}
        >
          <input name={'profileImage'} {...getInputProps()} />
          {isDragActive ? (
            <Typography
              className={classes.dropZone}
              variant="h5"
              component="h2"
            >
              {`DROP HERE!`}
            </Typography>
          ) : (
            <Typography className={classes.dropZone}>
              {`Drag 'n' drop a profile image here(jpg or png), or click to select a file`}
            </Typography>
          )}
        </CardMedia>
      </div>
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
    </Container>
  );

  const content = editProfile =>
    editProfile ? userProfileForm() : userProfile();

  return <Container className={classes.root}>{content(editProfile)}</Container>;
}
