import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const Counter = ({ timeValue, timeUnit }) => {
  return (
    <Paper variant="outlined" align="center">
      <Typography color="primary" variant="h5">
        {timeValue}
      </Typography>
      {` ${timeUnit}`}
    </Paper>
  );
};

Counter.propTypes = {
  timeValue: PropTypes.element.isRequired,
  timeUnit: PropTypes.string.isRequired,
};

export default Counter;
