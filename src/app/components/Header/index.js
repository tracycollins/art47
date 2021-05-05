/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { green } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
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
import StorageIcon from '@material-ui/icons/Storage';
// import { makeStyles } from '@material-ui/core/styles';

import {
  makeStyles,
  // createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';

import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

import '@fontsource/bungee'; // Defaults to weight 400.

let themeBungee = createMuiTheme({
  typography: {
    fontFamily: ['Bungee'].join(','),
    h1: {
      fontSize: 120,
    },
    h2: {
      fontSize: 40,
    },
    h3: {
      fontSize: 20,
    },
  },
});
themeBungee = responsiveFontSizes(themeBungee);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  textField: {
    margin: theme.spacing(1),
    width: '25ch',
  },
  appBar: {
    flexGrow: 1,
    color: 'transparent',
    alignItems: 'center',
  },
  profile: {
    width: 400,
  },
  profileForm: {
    width: 400,
    margin: theme.spacing(1),
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
  button: {
    margin: theme.spacing(1),
  },
  fullList: {
    width: 'auto',
  },
}));

export function Header() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  let history = useHistory();
  const classes = useStyles();

  const [displayHelp, setDisplayHelp] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverText, setPopoverText] = React.useState('');

  const handlePopoverOpen = (event, menuText) => {
    setPopoverText(menuText);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event, menuText) => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  const handleMenuClick = (event, value) => {
    setSelectedTab(value);
    if (value === 'profile') {
      if (!isAuthenticated) {
        loginWithRedirect();
        return;
      }
    }
    history.push(`/${value}`);
  };

  const toggleHelp = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDisplayHelp(open, anchorEl);
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
              onClick={e => handleMenuClick(e, menuText)}
              aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={e => handlePopoverOpen(e, menuText)}
              onMouseLeave={e => handlePopoverClose(e, menuText)}
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
              aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={e => handlePopoverOpen(e, menuText)}
              onMouseLeave={e => handlePopoverClose(e, menuText)}
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
      case 'stats':
        currentIcon = <StorageIcon />;
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
          aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={e => handlePopoverOpen(e, menuText)}
          onMouseLeave={e => handlePopoverClose(e, menuText)}
        >
          <ListItemIcon className={classes.icon} key={index}>
            {currentIcon}
          </ListItemIcon>
        </ListItem>
      </>
    );
  };

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
          'stats',
          'help',
        ].map((text, index) => (
          <div key={text}>{listIcon(text, index)}</div>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={themeBungee}>
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          open
          anchor="right"
          variant="permanent"
        >
          {drawerList()}
        </Drawer>
        <Drawer anchor="left" open={displayHelp} onClose={toggleHelp(false)}>
          {help()}
        </Drawer>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={popoverOpen}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>{popoverText}</Typography>
        </Popover>
      </div>
    </ThemeProvider>
  );
}
