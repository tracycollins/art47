/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';
// import { selectUser } from './slice/selectors';

import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
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
  avatar: {},
}));

export function UserPage() {
  const {
    loginWithRedirect,
    user,
    logout,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  const classes = useStyles();

  console.log({ isLoading });
  console.log({ user });

  const content = () => (
    <Container>
      <Card>
        <CardMedia
          className={classes.media}
          image={isAuthenticated ? user.picture : '/art47_logo.png'}
          title={isAuthenticated ? user.name : ''}
        />{' '}
        <CardContent>
          <Typography variant="h5" component="h2">
            {isAuthenticated ? user.name : ''}
          </Typography>
          <Typography variant="h5" component="h3">
            {isAuthenticated ? user.nickname : ''}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {isAuthenticated ? user.email : ''}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            USER ID: {isAuthenticated ? user.sub : 'not logged in'}
          </Typography>{' '}
          <Typography color="textSecondary" gutterBottom>
            USER DB ID: {isAuthenticated ? user._id : 'not logged in'}
          </Typography>
        </CardContent>
        <CardActions>
          {isAuthenticated ? (
            <Button onClick={logout} variant="contained" color="secondary">
              LOGOUT
            </Button>
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

  return <Container style={{ marginTop: '3em' }}>{content()}</Container>;
}
