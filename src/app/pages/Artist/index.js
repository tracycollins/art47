/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import { useHotkeys } from 'react-hotkeys-hook';
import Image from 'material-ui-image';
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
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { useHistory } from 'react-router-dom';

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
    // height: 0.25 * window.innerHeight,
  },
  recommendation: {
    marginBottom: theme.spacing(1),
  },
  info: {
    backgroundColor: 'transparent',
    width: 0.35 * window.innerWidth,
  },
  artistInfo: {
    marginBottom: theme.spacing(1),
  },
}));

export function Artist({ artist, prevNext }) {
  const history = useHistory();
  const classes = useStyles();

  useHotkeys('up', () => history.push(`/artists`), [artist]);
  useHotkeys('left', () => prevNext('prev', artist.id), [artist]);
  useHotkeys('right', () => prevNext('next', artist.id), [artist]);
  useHotkeys('n', () => prevNext('next', artist.id), [artist]);
  useHotkeys('p', () => prevNext('prev', artist.id), [artist]);

  const handleArtistSiteClick = (event, name) => {
    event.preventDefault();
    console.log(`handleArtistSiteClick name: ${name}`);
    switch (name) {
      case 'artist':
        if (artist.artistUrl) window.open(artist.artistUrl, '_blank');
        break;

      case 'instagram':
        if (artist.instagramUsername)
          window.open(
            `https://instagram.com/${artist.instagramUsername.replace(
              '@',
              '',
            )}`,
            '_blank',
          );
        break;

      case 'twitter':
        if (artist.twitterUsername)
          window.open(
            `https://twitter.com/${artist.twitterUsername.replace('@', '')}`,
            '_blank',
          );
        break;

      case 'facebook':
        if (artist.facebookUrl) window.open(artist.facebookUrl, '_blank');
        break;

      case 'search':
        window.open(
          `https://en.wikipedia.org/wiki/${artist.displayName}`,
          '_blank',
        );
        break;

      default:
        break;
    }
  };

  const content = () =>
    artist ? (
      <Container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className={classes.root}
      >
        <Card style={{ backgroundColor: 'white' }} className={classes.info}>
          <CardActionArea>
            <Image
              style={{ backgroundColor: 'white' }}
              className={classes.image}
              src={artist.image ? artist.image.url : null}
              alt={artist.displayName}
              imageStyle={{
                objectFit: 'contain',
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {artist.displayName}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                disabled={artist.artistUrl === undefined}
                onClick={event => handleArtistSiteClick(event, 'artist')}
                aria-label="artist's web site"
              >
                <AccountBoxIcon />
              </IconButton>
              <IconButton
                disabled={artist.instagramUsername === undefined}
                onClick={event => handleArtistSiteClick(event, 'instagram')}
                aria-label="artist's instagram"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                disabled={artist.twitterUsername === undefined}
                onClick={event => handleArtistSiteClick(event, 'twitter')}
                aria-label="artist's twitter"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                disabled={artist.facebookUrl === undefined}
                onClick={event => handleArtistSiteClick(event, 'facebook')}
                aria-label="artist's facebook"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                onClick={event => handleArtistSiteClick(event, 'search')}
                aria-label="search for artist"
              >
                <SearchIcon />
              </IconButton>
            </CardActions>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {artist.bio}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <AppBar className={classes.appBar} elevation={0} position="fixed">
          <Toolbar className={classes.toolBar}>
            <IconButton
              size="medium"
              value="prev"
              onClick={() => prevNext('prev', artist.id)}
            >
              <ArrowBackIosRoundedIcon />
            </IconButton>
            <IconButton
              size="medium"
              value="next"
              onClick={() => prevNext('next', artist.id)}
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Container>
    ) : (
      <>what</>
    );

  return <div>{content(artist)}</div>;
}
