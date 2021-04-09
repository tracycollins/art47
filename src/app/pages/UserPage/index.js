/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
// import React, { useRef, useEffect, useState, useCallback } from 'react';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useUserSlice } from 'app/pages/UserPage/slice';
// import { useHistory } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';
// import { selectUser } from './slice/selectors';

import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import { selectUser } from 'app/pages/UserPage/slice/selectors';

const useStyles = makeStyles(theme => ({
  // root: {
  //   maxWidth: 345,
  // },
  root: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  media: {
    width: 100,
    height: 100,
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
  const {
    loginWithRedirect,
    // user,
    logout,
    isAuthenticated,
    isLoading,
  } = useAuth0();
  const user = useSelector(selectUser);

  const form = useRef(null);
  const { actions } = useUserSlice();
  const dispatch = useDispatch();
  const classes = useStyles();

  console.log({ isLoading });
  console.log({ user });

  const [editProfile, setEditProfile] = React.useState(false);

  const handleEditUser = () => {
    console.log(`handleEditUser`);
    setEditProfile(true);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log(`handleFormSubmit`);
    const formData = new FormData(form.current);
    const formUser = {};
    formData.forEach(
      (value, key) => (formUser[key] = value !== '' ? value : null),
    );
    console.log({ formUser });
    const newUser = Object.assign({}, user, formUser);
    console.log({ newUser });
    dispatch(actions.updateUser({ user: newUser }));
    setEditProfile(false);
  };

  const handleFormCancel = () => {
    console.log(`handleFormCancel`);
    setEditProfile(false);
  };

  const handleFormDelete = () => {
    console.log(`handleFormDelete`);
    // need confirmation modal
    setEditProfile(false);
  };

  const userProfile = () => (
    <Container>
      <Card className={classes.profile}>
        <CardMedia
          className={classes.media}
          image={user ? user.picture : '/art47_logo.png'}
          // title={user ? `NAME: ${user.name}` : ''}
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {user ? `${user.firstName} ${user.lastName}` : ''}
          </Typography>
          {/* <Typography variant="h5" component="h2">
            {user ? `name: ${user.name}` : ''}
          </Typography>{' '} */}
          <Typography variant="h5" component="h3">
            {user ? `nickname: ${user.nickname}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? user.email : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? user.location : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? `website: ${user.userUrl}` : ''}
          </Typography>{' '}
          <Typography color="textSecondary">
            {user ? `bio: ${user.bio}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? `twitter: @${user.twitterUsername}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? `instagram: ${user.instagramUsername}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? `facebook: ${user.facebookUrl}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? `ID: ${user.id}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {user ? `DB ID: ${user._id}` : ''}
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
          id="user-facebook-url"
          label="facebook url"
          name="facebookUrl"
          defaultValue={user.facebookUrl}
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

  useEffect(() => {
    console.log({ user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, isAuthenticated]);

  return (
    <Container style={{ marginTop: '3em' }}>{content(editProfile)}</Container>
  );
}
