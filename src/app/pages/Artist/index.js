/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { useHotkeys } from 'react-hotkeys-hook';
import Image from 'material-ui-image';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { selectUser } from 'app/pages/UserPage/slice/selectors';
import { ArtworkExcerpt } from 'app/pages/ArtworkExcerpt/Loadable';
import {
  // selectLoaded,
  selectLoading,
} from 'app/pages/ArtworksPage/slice/selectors';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  grid: {
    margin: theme.spacing(1),
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  gridItem: {
    flex: 3,
    margin: theme.spacing(1),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  gridItemArtworks: {
    flex: 5,
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
    // width: '100%',
    alignItems: 'top',
    justifyContent: 'top',
    marginTop: theme.spacing(1),
    maxHeight: 0.85 * window.innerHeight,
    // height: 0.5 * window.innerHeight,
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
  info: {
    margin: theme.spacing(1),
  },
}));

export function Artist({ artist, prevNext }) {
  const history = useHistory();
  const classes = useStyles();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  // const loaded = useSelector(selectLoaded);

  useHotkeys('up', () => history.push(`/artists`), [artist]);
  useHotkeys('left', () => prevNext('prev', artist.id), [artist]);
  useHotkeys('right', () => prevNext('next', artist.id), [artist]);
  useHotkeys('n', () => prevNext('next', artist.id), [artist]);
  useHotkeys('p', () => prevNext('prev', artist.id), [artist]);

  const handleArtistSiteClick = (event, name) => {
    event.preventDefault();
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
        if (artist.facebookUsername)
          window.open(
            `https://facebook.com/${artist.facebookUsername}`,
            '_blank',
          );
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
  const defaultArtworkImageUrl = '/art47_logo.png';

  const artworksDisplay = () => {
    if (!artist || !artist.artworks || artist.artworks.length === 0) {
      return <img key={0} alt="default" src={defaultArtworkImageUrl} />;
    }
    return artist.artworks.map(artwork => {
      // console.log({ artwork });
      return <ArtworkExcerpt key={artwork.id} user={user} artwork={artwork} />;
    });
  };

  const content = () =>
    artist ? (
      <Container
        // xl={12}
        // lg={12}
        // md={12}
        // sm={12}
        // xs={12}
        className={classes.root}
      >
        <Grid container className={classes.grid}>
          <Grid item className={classes.gridItem}>
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
                    disabled={artist.facebookUsername === undefined}
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
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {artist.bio}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item className={classes.gridItemArtworks}>
            {artist.artworks.length === 0 ? (
              <></>
            ) : (
              <div className={classes.artworkListRoot}>
                <div className={classes.artworkList}>
                  <GridList
                    className={classes.gridList}
                    component={'div'}
                    cellHeight={200}
                    spacing={5}
                    cols={5}
                  >
                    {artworksDisplay()}
                    <div className={classes.progress}>
                      {loading ? <CircularProgress /> : <></>}
                    </div>
                  </GridList>
                </div>
              </div>
            )}
          </Grid>
        </Grid>

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

  // return <div>{content(artist)}</div>;
  return content(artist);
}
