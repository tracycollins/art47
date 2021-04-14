/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
// import React, { useRef, useEffect, useState, useCallback } from 'react';
import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import { useUserSlice } from 'app/pages/UserPage/slice';
// import { useHistory } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';
// import { selectUser } from './slice/selectors';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import { selectUser } from 'app/pages/UserPage/slice/selectors';

const DEBUG_MODE = false;

const useStyles = makeStyles(theme => ({
  // root: {
  //   maxWidth: 345,
  // },
  root: {
    // width: '100%',
    // height: '100%',
    // objectFit: 'cover',
    // overflow: 'hidden',
    display: 'flex',
    // flexWrap: 'wrap',
    // flexDirection: 'row',
  },
  media: {
    width: 200,
    height: 200,
    margin: theme.spacing(1),
  },
  dropZone: {
    margin: theme.spacing(1),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // align: 'center',
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
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    margin: theme.spacing(1),
    width: '25ch',
  },
  profile: {
    width: '50%',
    margin: theme.spacing(1),
  },
  profileForm: {
    width: '50%',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  avatar: {},
}));

export function UserPage() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const user = useSelector(selectUser);

  const onDrop = useCallback(acceptedFiles => {
    console.log(`DROPPED FILES: ${acceptedFiles.length}`);
    // acceptedFiles.forEach(file => {
    const file = acceptedFiles[0];
    dispatch(
      actions.uploadFile({
        dataType: 'image',
        type: 'profileImage',
        file: file,
      }),
    );

    // reader.onabort = () => console.log('file reading was aborted');
    // reader.onerror = () => console.log('file reading has failed');
    // reader.onload = () => {
    //   // Do whatever you want with the file contents
    //   const binaryStr = reader.result;
    //   // console.log(binaryStr);
    //   dispatch(
    //     actions.uploadFile({
    //       dataType: 'image',
    //       type: 'profileImage',
    //       file: file,
    //       fileName: 'profile.jpg',
    //       filePath: file.path,
    //       fileSize: file.size,
    //       data: binaryStr,
    //     }),
    //   );
    // };
    // reader.readAsArrayBuffer(file);
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const form = useRef(null);
  const { actions } = useUserSlice();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [editProfile, setEditProfile] = React.useState(false);

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
    dispatch(actions.updateUser({ user: newUser }));
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
      <Typography color="textSecondary" key={linkType}>
        {icon}
        <Link href={url} target="_blank" rel="noreferrer">
          {text}
        </Link>
      </Typography>
    );
  };

  const userLinkTypes = ['userUrl', 'twitter', 'instagram', 'facebook'];
  const userLinks = () =>
    userLinkTypes.map(linkType => {
      return createLink({ user, linkType });
    });

  let profileImage =
    user.image && user.image.url ? user.image.url : '/art47_logo.png';

  useEffect(() => {
    if (user.image && user.image.url) {
      profileImage = user.image.url;
    } else if (user && user.picture) {
      profileImage = user.picture;
    }
  }, [user]);

  const userProfile = () => (
    <Container>
      <Card className={classes.profile}>
        <CardMedia
          className={classes.media}
          image={profileImage}
          // title={user ? `NAME: ${user.name}` : ''}
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {user ? `${user.firstName} ${user.lastName}` : ''}
          </Typography>
          <Typography variant="h6" component="h3">
            {user ? `aka: ${user.nickname}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? user.email : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? user.location : ''}
          </Typography>
          <Typography color="textSecondary">{user ? user.bio : ''}</Typography>
          {userLinks()}
          <Typography color="textSecondary">
            {user && DEBUG_MODE ? `ID: ${user.id}` : ''}
          </Typography>
          <Typography color="textSecondary">
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
    </Container>
  );

  const userProfileForm = () => (
    <Container>
      <Card className={classes.profile}>
        <CardMedia
          className={classes.media}
          // image={user ? user.picture : '/art47_logo.png'}
          image={profileImage}
        />
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
              {`Drag 'n' drop a profile image here, or click to select files`}
            </Typography>
          )}
        </CardMedia>
      </Card>
      <form
        ref={form}
        className={classes.profileForm}
        noValidate
        autoComplete="off"
        onSubmit={handleFormSubmit}
      >
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
          id="user-nickname"
          label="nickname"
          name="nickname"
          defaultValue={user.nickname}
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
        <Divider />
        <ButtonGroup>
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

  return (
    <Container style={{ marginTop: '3em' }}>{content(editProfile)}</Container>
  );
}
