/* eslint-disable no-underscore-dangle */
import React from 'react';
// import { push } from 'connected-react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import { useAuth0 } from '@auth0/auth0-react';
import { green } from '@material-ui/core/colors';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HelpIcon from '@material-ui/icons/Help';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppsIcon from '@material-ui/icons/Apps';
import PeopleIcon from '@material-ui/icons/People';
import StarsIcon from '@material-ui/icons/Stars';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
// import { makeSelectCurrentUser, makeSelectError } from 'app/selectors';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    overflow: 'hidden',
  },
  appBar: {
    flexGrow: 1,
    color: 'transparent',
    alignItems: 'center',
  },
  profile: {
    width: 400,
  },
  media: {
    overflow: 'hidden',
    width: 100,
    height: 100,
  },
  help: {
    margin: theme.spacing(3),
    width: 400,
  },
  drawer: { backgroundColor: 'primary' },
  toolBar: {},
  loginButton: {
    position: 'relative',
    width: '100px',
    float: 'right',
  },
  icon: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  drawerList: {
    width: 64,
    marginRight: 5,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
  },
  drawerListNav: {
    backgroundColor: 'primary',
  },
  fullList: {
    width: 'auto',
  },
}));

function Header({ history }) {
  const { loginWithRedirect, user, logout, isAuthenticated } = useAuth0();

  const classes = useStyles();
  const [profile, setProfile] = React.useState(false);
  const [displayHelp, setDisplayHelp] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(1);

  const handleMenuClick = (event, value) => {
    setSelectedTab(value);
    history.push(`/${value}`);
  };

  const toggleHelp = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDisplayHelp(open);
  };

  const toggleProfile = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setProfile(open);
  };

  const listIcon = (menuText, index) => {
    let currentIcon = <HomeRoundedIcon />;
    switch (menuText) {
      case 'profile':
        return (
          <>
            <ListItem
              button
              key={index}
              selected={selectedTab === menuText}
              onClick={
                isAuthenticated ? toggleProfile(true) : loginWithRedirect
              }
            >
              <ListItemIcon className={classes.icon} key={index}>
                <AccountCircleIcon
                  style={
                    isAuthenticated
                      ? { color: green[500] }
                      : { color: 'default' }
                  }
                />
              </ListItemIcon>
            </ListItem>
          </>
        );

      case 'help':
        return (
          <>
            <ListItem
              button
              key={index}
              selected={selectedTab === menuText}
              onClick={toggleHelp(true)}
            >
              <ListItemIcon className={classes.icon} key={index}>
                <HelpIcon />
              </ListItemIcon>
            </ListItem>
          </>
        );

      case 'home':
        currentIcon = <HomeRoundedIcon />;
        break;
      case 'artists':
        currentIcon = <PeopleIcon />;
        break;
      case 'artworks':
        currentIcon = <AppsIcon />;
        break;
      case 'thanks':
        currentIcon = <StarsIcon />;
        break;
      case 'info':
        currentIcon = <InfoIcon />;
        break;

      default:
    }
    return (
      <>
        <ListItem
          button
          key={index}
          selected={selectedTab === menuText}
          onClick={e => handleMenuClick(e, menuText)}
        >
          <ListItemIcon className={classes.icon} key={index}>
            {currentIcon}
          </ListItemIcon>
        </ListItem>
      </>
    );
  };

  const userProfile = () => (
    <Container>
      <Card className={classes.profile}>
        <CardMedia
          className={classes.media}
          image={isAuthenticated ? user.picture : '/art47_logo.png'}
          title={isAuthenticated ? user.name : ''}
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {isAuthenticated ? user.name : ''}
          </Typography>
          <Typography variant="h5" component="h3">
            {isAuthenticated ? user.nickname : ''}
          </Typography>
          <Typography color="textSecondary">
            {isAuthenticated ? user.email : ''}
          </Typography>
          <Typography color="textSecondary">
            {isAuthenticated ? `USER ID: ${user.sub}` : ''}
          </Typography>
          <Typography color="textSecondary">
            {isAuthenticated ? `USER DB ID: ${user._id}` : ''}
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

  const help = () => (
    <Container className={classes.help}>
      <Typography variant="h3" color="textSecondary">
        help
      </Typography>
      <Divider />
      <Typography variant="h6" color="textPrimary">
        navigation
      </Typography>
      <Typography variant="body1" color="textPrimary">
        {`You can navigate with the left &  right arrow keys when viewing individual artists or artworks.`}
      </Typography>
      <Divider />
      <Typography variant="h6" color="textPrimary">
        rating artwork
      </Typography>{' '}
      <Typography variant="body1" color="textPrimary">
        {`You must be logged in to rate artwork.`}
      </Typography>
      <Typography variant="body1" color="textPrimary">
        {`Click on the `}
        <AccountCircleIcon />
        {` to log in`}
      </Typography>
      <Divider />
      <Typography variant="body1" color="textPrimary">
        {`You can use the number keys (0-5) when rating artwork instead of clicking on the star icons.`}
      </Typography>
    </Container>
  );

  const drawerList = () => (
    <div className={classes.drawerList} role="presentation">
      <List component="nav" className={classes.drawerListNav}>
        {[
          'home',
          'profile',
          'artists',
          'artworks',
          'thanks',
          'info',
          'help',
        ].map((text, index) => (
          <div key={text}>{listIcon(text, index)}</div>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        open
        anchor="right"
        variant="permanent"
      >
        {drawerList()}
      </Drawer>
      <Drawer anchor="right" open={profile} onClose={toggleProfile(false)}>
        {userProfile()}
      </Drawer>
      <Drawer anchor="left" open={displayHelp} onClose={toggleHelp(false)}>
        {help()}
      </Drawer>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  // currentUser: makeSelectCurrentUser(),
  // error: makeSelectError(),
});

Header.propTypes = {
  history: PropTypes.object,
};

// export default connect(
//   null,
//   { push },
// )(Header);

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Header);
