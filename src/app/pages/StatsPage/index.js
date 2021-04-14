/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';
import { useStatsSlice } from 'app/pages/StatsPage/slice';
// import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { selectStats } from 'app/pages/StatsPage/slice/selectors';
import { selectUser } from 'app/pages/UserPage/slice/selectors';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    width: '100%',
  },
  table: {
    // minWidth: 650,
    maxWidth: 200,
  },
  media: {
    width: 240,
    height: 240,
    margin: theme.spacing(1),
  },
  dropZone: {
    margin: theme.spacing(1),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  textField: {
    margin: theme.spacing(1),
    width: '40ch',
  },
  profile: {
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    // justifyContent: 'right',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  profileFormInput: {
    // backgroundColor: '#eeeeee',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  profileImage: {
    width: 0.25 * window.innerHeight,
    height: 0.25 * window.innerHeight,
    margin: theme.spacing(1),
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
    // marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    // width: '100%',
    margin: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  avatar: {},
}));

function createData(entity, total) {
  return { entity, total };
}

export function StatsPage() {
  const user = useSelector(selectUser);
  const stats = useSelector(selectStats);
  const { actions } = useStatsSlice();
  const dispatch = useDispatch();
  const classes = useStyles();

  console.log({ stats });
  console.log({ user });

  useEffect(() => {
    console.log(`dispatch getStats`);
    dispatch(actions.getStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowsGlobalStats = [
    createData('Artists', stats.artists.total),
    createData('Artworks', stats.artworks.total),
    createData('Users', stats.users.total),
    createData('Ratings', stats.ratings.total),
  ];

  const rowsUserStats = [
    createData('Rated', user.rated),
    createData('Unrated', user.unrated.length),
  ];

  const statsTable = () => (
    <div className={classes.stats}>
      <TableContainer elevation={0} component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">
                User Stats
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsUserStats.map(row => (
              <TableRow key={row.entity}>
                <TableCell component="th" scope="row">
                  {row.entity}
                </TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <TableContainer elevation={0} component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">
                Global Stats
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsGlobalStats.map(row => (
              <TableRow key={row.entity}>
                <TableCell component="th" scope="row">
                  {row.entity}
                </TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const content = () => statsTable();
  return <Container className={classes.root}>{content()}</Container>;
}
