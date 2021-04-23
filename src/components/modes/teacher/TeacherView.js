import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { Grid, IconButton } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Delete as DeleteIcon } from '@material-ui/icons';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import './TeacherView.css';
import { patchAppInstance, openSettings } from '../../../actions';
import ConfirmDialog from '../../common/ConfirmDialog';
import Settings from './Settings';

export class TeacherView extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchOpenSettings: PropTypes.func.isRequired,
    initialDateTime: PropTypes.string.isRequired,
    deadlineMessage: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      table: PropTypes.string,
      main: PropTypes.string,
      button: PropTypes.string,
      message: PropTypes.string,
      fab: PropTypes.string,
    }).isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
  };

  static styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    main: {
      textAlign: 'center',
      margin: theme.spacing(),
    },
    fab: {
      margin: theme.spacing(),
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  });

  state = {
    confirmDialogOpen: false,
  };

  handleToggleConfirmDialog = () => {
    const { confirmDialogOpen } = this.state;
    this.setState({
      confirmDialogOpen: !confirmDialogOpen,
    });
  };

  handleConfirmDelete = () => {
    const { dispatchPatchAppInstance } = this.props;
    dispatchPatchAppInstance({
      data: {},
    });
    this.handleToggleConfirmDialog();
  };

  render() {
    // extract properties from the props object
    const {
      // this property allows us to do styling and is injected by withStyles
      classes,
      // this property allows us to do translations and is injected by i18next
      t,
      // these properties are injected by the redux mapStateToProps method
      dispatchOpenSettings,
      initialDateTime,
      deadlineMessage,
    } = this.props;
    const { confirmDialogOpen } = this.state;
    const dateTime =
      initialDateTime && new Date(initialDateTime).toLocaleString();

    return (
      <>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Paper className={classes.root}>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Due Date')}</TableCell>
                      <TableCell>{t('Timeout Message')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">{dateTime}</TableCell>
                      <TableCell align="left">
                        {!initialDateTime ? '' : deadlineMessage}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={this.handleToggleConfirmDialog}
                          disabled={_.isEmpty(initialDateTime)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <ConfirmDialog
                          open={confirmDialogOpen}
                          title={t('Delete Time')}
                          text={t(
                            "By clicking 'Delete', you will be deleting student's time. This action cannot be undone.",
                          )}
                          handleClose={this.handleToggleConfirmDialog}
                          handleConfirm={this.handleConfirmDelete}
                          confirmText={t('Delete')}
                          cancelText={t('Cancel')}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
        <Settings />
        <Fab
          color="primary"
          aria-label={t('Settings')}
          className={classes.fab}
          onClick={dispatchOpenSettings}
        >
          <SettingsIcon />
        </Fab>
      </>
    );
  }
}

// get the app instance resources that are saved in the redux store
const mapStateToProps = ({ appInstance }) => ({
  // we transform the list of students in the database
  // to the shape needed by the select component
  appInstance,
  initialDateTime: appInstance.content.settings.initialDateTime,
  deadlineMessage: appInstance.content.settings.deadlineMessage,
});

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchPatchAppInstance: patchAppInstance,
  dispatchOpenSettings: openSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
