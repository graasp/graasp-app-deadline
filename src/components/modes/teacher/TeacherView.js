import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './TeacherView.css';
import {
  patchAppInstanceResource,
  postAppInstanceResource,
  deleteAppInstanceResource,
  openSettings,
} from '../../../actions';
import { getUsers } from '../../../actions/users';
import Settings from './Settings';

export class TeacherView extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchOpenSettings: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      table: PropTypes.string,
      main: PropTypes.string,
      button: PropTypes.string,
      message: PropTypes.string,
      fab: PropTypes.string,
    }).isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    // inside the shape method you should put the shape
    // that the resources your app uses will have

    // appInstanceResources: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     // we need to specify number to avoid warnings with local server
    //     _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    //     appInstanceId: PropTypes.string,
    //     data: PropTypes.object,
    //   }),
    // ),
    // this is the shape of the select options for students
    // studentOptions: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     label: PropTypes.string,
    //     value: PropTypes.string,
    //   }),
    // ).isRequired,
  };

  // static defaultProps = {
  //   appInstanceResources: [],
  // };

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

  constructor(props) {
    super(props);
    const { dispatchGetUsers } = this.props;
    dispatchGetUsers();
  }

  render() {
    // extract properties from the props object
    const {
      // this property allows us to do styling and is injected by withStyles
      classes,
      // this property allows us to do translations and is injected by i18next
      t,
      // these properties are injected by the redux mapStateToProps method
      dispatchOpenSettings,
    } = this.props;
    return (
      <>
        {/* <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Paper className={classes.message}>
              {t(
                'This is the teacher view. Switch to the student view by clicking on the URL below.',
              )}
              <a href={addQueryParamsToUrl({ mode: 'student' })}>
                <pre>
                  {`${window.location.host}/${addQueryParamsToUrl({
                    mode: 'student',
                  })}`}
                </pre>
              </a>
            </Paper>
            <Typography variant="h5" color="inherit">
              {t('View the Students in the Sample Space')}
            </Typography>
            <Select
              className="StudentSelect"
              value={selectedStudent}
              options={studentOptions}
              onChange={this.handleChangeStudent}
              isClearable
            />
            <hr />
            <Typography variant="h6" color="inherit">
              {t(
                'This table illustrates how an app can save resources on the server.',
              )}
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>App Instance</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderAppInstanceResources(appInstanceResources, this.props)}
                </TableBody>
              </Table>
            </Paper>
            <Button
              color="primary"
              className={classes.button}
              variant="contained"
              onClick={() => generateRandomAppInstanceResource(this.props)}
            >
              {t('Save a Random App Instance Resource via the API')}
            </Button>
          </Grid>
        </Grid> */}
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
const mapStateToProps = ({ users, appInstanceResources }) => ({
  // we transform the list of students in the database
  // to the shape needed by the select component
  studentOptions: users.content.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
  appInstanceResources: appInstanceResources.content,
});

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchOpenSettings: openSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
