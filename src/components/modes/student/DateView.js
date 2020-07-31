import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  dateHeader: {
    background: '#5050d2',
    color: '#fff',
  },
}));

const DateView = ({ dateTime }) => {
  const classes = useStyles();
  const [weekDay, month, day, , time, timeZone] = dateTime.split(' ');
  // console.log(weekDay,"/", month, "/", day, "/", year,"/", time, "/", timeZone);

  return (
    <Grid container className={classes.gridRow} spacing={1}>
      <Grid xs={12} item>
        <Paper align="center">
          <Typography variant="overline">Completion Deadline</Typography>
          <Grid xs className={classes.dateHeader}>
            <Typography variant="h5">{` ${time} ${timeZone}`}</Typography>
          </Grid>
          <Grid xs>
            <Typography variant="h2" color="primary">
              {`${weekDay}, ${month}  ${day}`}
            </Typography>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

DateView.propTypes = {
  dateTime: PropTypes.shape.isRequired,
};

export default DateView;
