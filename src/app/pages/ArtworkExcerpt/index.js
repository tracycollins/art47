import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { selectArtworkById } from "./artworksSlice";

const useStyles = makeStyles(theme => ({
  gridListTile: {
    padding: theme.spacing(1),
    // margin: theme.spacing(1),
  },
  image: {
    width: '160px',
    height: '160px',
  },
}));

export function ArtworkExcerpt({ key, user, artwork, cols }) {
  const defaultArtworkImageUrl = '/art47_logo.png';
  const classes = useStyles();

  const artworkImageUrl =
    artwork && artwork.image && artwork.image.url
      ? artwork.image.url.replace(/\.(jpeg|jpg|png)/, '-small.$1')
      : artwork && artwork.url
      ? artwork.url.replace(/\.(jpeg|jpg|png)/, '-small.$1')
      : defaultArtworkImageUrl;

  const [displayTitle, setDisplayTitle] = useState(false);

  const handleTitleShow = () => {
    setDisplayTitle(true);
  };
  const handleTitleHide = () => {
    setDisplayTitle(false);
  };

  const linkParams = {};
  linkParams.pathname = `/artworks/${artwork.id}`;

  const title = display =>
    display ? (
      <GridListTileBar
        title={artwork.title}
        subtitle={
          <>
            <Typography variant="subtitle2">
              {artwork.artist ? artwork.artist.displayName : ''}
            </Typography>
            <Rating
              readOnly
              precision={0.5}
              size="small"
              name="rate"
              value={artwork.ratingAverage ? artwork.ratingAverage : 0}
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
        key={artwork.id}
        cols={cols || 1}
        className={classes.gridListTile}
        onMouseEnter={handleTitleShow}
        onMouseLeave={handleTitleHide}
      >
        <Link to={linkParams}>
          <img
            className={classes.image}
            src={artworkImageUrl}
            alt={artwork.title}
          />
          {title(displayTitle)}
        </Link>
      </GridListTile>
    </>
  );
}
