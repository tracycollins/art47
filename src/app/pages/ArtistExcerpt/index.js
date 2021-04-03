import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { selectArtistById } from "./artistsSlice";

const useStyles = makeStyles(theme => ({
  gridListTile: {
    padding: theme.spacing(1),
    // margin: theme.spacing(1),
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
    display ? (
      <GridListTileBar
        title={artist.title}
        subtitle={
          <>
            <Typography variant="subtitle2">
              {artist.artist.displayName}
            </Typography>
            <Rating
              readOnly
              precision={0.5}
              size="small"
              name="rate"
              value={artist.ratingAverage ? artist.ratingAverage : 0}
            />
          </>
        }
      />
    ) : (
      <></>
    );

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
            alt={artist.title}
          />
          {title(displayTitle)}
        </Link>
      </GridListTile>
    </>
  );
}
