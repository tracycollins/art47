import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  gridListTile: {
    padding: theme.spacing(1),
  },
  image: {
    width: '200px',
    height: '200px',
  },
}));

export function ArtistExcerpt({ key, user, artist }) {
  const defaultArtistImageUrl = '/art47_logo.png';
  const classes = useStyles();

  const artistImageUrl =
    artist && artist.image && artist.image.url
      ? artist.image.url.replace(/\.(jpeg|jpg|png)/, '-small.$1')
      : defaultArtistImageUrl;

  const [displayTitle, setDisplayTitle] = useState(false);

  const handleTitleShow = () => {
    setDisplayTitle(true);
  };
  const handleTitleHide = () => {
    setDisplayTitle(false);
  };

  const linkParams = {};
  linkParams.pathname = `/artists/${artist.id}`;

  const title = display =>
    display ? <GridListTileBar title={artist.displayName} /> : <></>;

  return (
    <>
      <GridListTile
        key={artist.id}
        // cols={cols}
        className={classes.gridListTile}
        onMouseEnter={handleTitleShow}
        onMouseLeave={handleTitleHide}
      >
        <Link to={linkParams}>
          <img
            className={classes.image}
            src={artistImageUrl}
            alt={artist.displayName}
          />
          {title(displayTitle)}
        </Link>
      </GridListTile>
    </>
  );
}
