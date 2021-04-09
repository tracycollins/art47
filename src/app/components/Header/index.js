/* eslint-disable no-underscore-dangle */
import React from 'react';
// import { useDispatch } from 'react-redux';
// import { useUserSlice } from 'app/pages/UserPage/slice';
import { useHistory } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { green } from '@material-ui/core/colors';
// import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
// import Button from '@material-ui/core/Button';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import TextField from '@material-ui/core/TextField';
// import TextArea from '@material-ui/core/TextArea';
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
// import { selectUser } from 'app/pages/UserPage/slice/selectors';

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
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
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
  const { isAuthenticated } = useAuth0();
  let history = useHistory();
  const classes = useStyles();

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
      <Drawer anchor="left" open={displayHelp} onClose={toggleHelp(false)}>
        {help()}
      </Drawer>
    </div>
  );
}
