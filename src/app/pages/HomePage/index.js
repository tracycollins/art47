import React from 'react';
import Typography from '@material-ui/core/Typography';

import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';

// import reducer from './reducer';
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

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    // height: "100%",
    // height: "400px",
    height: 'auto',
    // marginTop: "8%",
    display: 'flex',
    marginTop: '20%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: "hidden",
  },
}));

// const key = 'home';

export function HomePage() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={themeBungee}>
      <div className={classes.root}>
        <Typography variant="h1" color="textPrimary">
          A47
        </Typography>
        <Typography variant="h3" color="textSecondary">
          discover favorites
        </Typography>
      </div>
    </ThemeProvider>
  );
}
