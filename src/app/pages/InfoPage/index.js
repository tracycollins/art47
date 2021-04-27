import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Markdown from 'react-markdown';

import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';

import '@fontsource/bungee'; // Defaults to weight 400.
import { title, text } from './info_txt.js';

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

let themeText = createMuiTheme({
  typography: {
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
themeText = responsiveFontSizes(themeText);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    display: 'block',
    width: '70%',
    padding: theme.spacing(1),
    marginLeft: 'auto',
  },
}));

export function InfoPage() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={themeText}>
      <Paper elevation={0} className={classes.root}>
        <ThemeProvider theme={themeBungee}>
          <Typography className={classes.title}>
            <Markdown source={title} />
          </Typography>
        </ThemeProvider>
        <Typography className={classes.text}>
          <Markdown source={text} />
        </Typography>
      </Paper>
    </ThemeProvider>
  );
}
