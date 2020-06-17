import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DatePicker from 'react-datepicker';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { closeSettings, patchAppInstance } from '../../../actions';
import Loader from '../../common/Loader';
import 'react-datepicker/dist/react-datepicker.css';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  button: {
    margin: theme.spacing(),
  },
  textField: {
    marginTop: theme.spacing(3),
  },
});

class Settings extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      paper: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
      headerVisible: PropTypes.bool.isRequired,
      deadlineMessage: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchCloseSettings: PropTypes.func.isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
    }).isRequired,
  };

  state = {
    selectedDate: new Date(),
  };

  saveSettings = settingsToChange => {
    const { settings, dispatchPatchAppInstance } = this.props;
    const newSettings = {
      ...settings,
      ...settingsToChange,
    };
    dispatchPatchAppInstance({
      data: newSettings,
    });
  };

  handleDeadlineChanged = value => {
    this.setState({ selectedDate: value });
    this.saveSettings({ initialDateTime: new Date(value).toISOString() });
  };

  handleDeadlineMessageChanged = ({ target: { value: deadlineMessage } }) => {
    this.saveSettings({ deadlineMessage });
  };

  handleChangeHeaderVisibility = () => {
    const {
      settings: { headerVisible },
    } = this.props;
    const settingsToChange = {
      headerVisible: !headerVisible,
    };
    this.saveSettings(settingsToChange);
  };

  handleClose = () => {
    const { dispatchCloseSettings } = this.props;
    dispatchCloseSettings();
  };

  renderModalContent() {
    const { t, settings, activity } = this.props;
    const { headerVisible } = settings;

    if (activity) {
      return <Loader />;
    }

    const switchControl = (
      <Switch
        color="primary"
        checked={headerVisible}
        onChange={this.handleChangeHeaderVisibility}
        value="headerVisibility"
      />
    );

    const {
      settings: { deadlineMessage },
    } = this.props;
    const { selectedDate } = this.state;

    return (
      <>
        <FormControlLabel
          control={switchControl}
          label={t('Show Header to Students')}
        />
        <DatePicker
          selected={selectedDate}
          inline
          fixedHeight
          minDate={new Date()}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          id="completionDeadline"
          label="Select Due Date "
          onChange={this.handleDeadlineChanged}
        />
        <TextField
          id="timeoutMessage"
          label="Timeout message"
          placeholder="Show message when timer runs out"
          multiline
          variant="outlined"
          fullWidth="true"
          onBlur={this.handleDeadlineMessageChanged}
          defaultValue={deadlineMessage}
        />
      </>
    );
  }

  render() {
    const { open, classes, t } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h5" id="modal-title">
              {t('Settings')}
            </Typography>
            {this.renderModalContent()}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ layout, appInstance }) => {
  return {
    open: layout.settings.open,
    settings: appInstance.content.settings,
    activity: Boolean(appInstance.activity.length),
  };
};

const mapDispatchToProps = {
  dispatchCloseSettings: closeSettings,
  dispatchPatchAppInstance: patchAppInstance,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(styles)(TranslatedComponent);
