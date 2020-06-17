import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Timer from 'react-compound-timer';
import { Grid, Typography, Container } from '@material-ui/core';
import Counter from './Counter';
import DateView from './DateView';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
    dividerFullWidth: {
      margin: `5px 0 0 ${theme.spacing(2)}px`,
    },
  },
}));

export const StudentView = ({ t, deadlineMessage, initialDateTime }) => {
  const classes = useStyles();
  const d = new Date(initialDateTime);
  const dateTimeLocal = d.toString();
  let dateTimeInMille = new Date(dateTimeLocal) - new Date();
  const isElapsed = dateTimeInMille < 0;
  const pendingDeadlineConfigMsg =
    'You do not have a deadline to complete this activity.';
  dateTimeInMille = !isElapsed ? dateTimeInMille : 0;

  return (
    <div>
      {!initialDateTime ? (
        <Typography variant="body1" align="center">
          {pendingDeadlineConfigMsg}
        </Typography>
      ) : (
        <Timer initialTime={dateTimeInMille} direction="backward">
          {() => {
            return (
              <Container xs={8} spacing={3}>
                <Grid item align="center">
                  <DateView dateTime={dateTimeLocal} />
                </Grid>
                <Grid className={classes.gridRow} container spacing={1}>
                  <Grid item xs>
                    <Counter
                      container
                      timeValue={<Timer.Days />}
                      timeUnit={t('Days')}
                    />
                  </Grid>
                  <Grid item xs>
                    <Counter
                      timeValue={<Timer.Hours />}
                      timeUnit={t('Hours')}
                    />
                  </Grid>
                  <Grid item xs>
                    <Counter
                      timeValue={<Timer.Minutes />}
                      timeUnit={t('Minutes')}
                    />
                  </Grid>
                  <Grid item xs>
                    <Counter
                      timeValue={<Timer.Seconds />}
                      timeUnit={t('Seconds')}
                    />
                  </Grid>
                </Grid>
                <Grid variant="outlined" item xs align="center">
                  <Typography variant="subtitle2">
                    {isElapsed && deadlineMessage}
                  </Typography>
                </Grid>
              </Container>
            );
          }}
        </Timer>
      )}
    </div>
  );
};

StudentView.propTypes = {
  t: PropTypes.func.isRequired,
  initialDateTime: PropTypes.number.isRequired,
  deadlineMessage: PropTypes.string.isRequired,
};

const mapStateToProps = ({ appInstance, context }) => {
  const { userId, tool } = context;
  return {
    initialDateTime: appInstance.content.settings.initialDateTime,
    deadlineMessage: appInstance.content.settings.deadlineMessage,
    tool,
    userId,
  };
};

const ConnectedComponent = connect(mapStateToProps)(StudentView);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;
