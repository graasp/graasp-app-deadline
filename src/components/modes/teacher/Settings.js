import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import MomentUtils from '@date-io/moment';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { closeSettings, patchAppInstance } from '../../../actions';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DEADLINE_MESSAGE,
} from '../../../constants/constants';
import { DEFAULT_LANG } from '../../../config/settings';

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
      initialDateTime: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchCloseSettings: PropTypes.func.isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
    }).isRequired,
    lang: PropTypes.string.isRequired,
  };

  state = {
    selectedDate: null,
  };

  componentDidMount() {
    this.updateLanguage();
  }

  componentDidUpdate({ settings: prevSettings, lang: prevLang }) {
    const { settings, activity, lang } = this.props;
    const { selectedDate } = this.state;

    if (lang !== prevLang) {
      this.updateLanguage();
    }

    if (!activity && settings?.initialDateTime) {
      // update selected date with new fetched value
      if (
        !selectedDate ||
        prevSettings?.initialDateTime !== settings?.initialDateTime
      ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ selectedDate: settings?.initialDateTime });
      }
    }
  }

  updateLanguage = () => {
    const { lang } = this.props;
    // import corresponding moment locale depending on language
    // eslint-disable-next-line no-unused-expressions
    import(`moment/locale/${lang}`);
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

  handleDateChange = selectedDate => {
    this.setState({ selectedDate });
    this.saveSettings({
      initialDateTime: new Date(selectedDate).toISOString(),
    });
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
    const { t, settings } = this.props;
    const { headerVisible } = settings;

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
      <Grid container spacing={3}>
        <Grid item>
          <FormControlLabel
            control={switchControl}
            label={t('Show Header to Students')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t('Timeout Message')}
            placeholder={t('Show message when timer runs out')}
            variant="outlined"
            fullWidth
            value={deadlineMessage || t(DEFAULT_DEADLINE_MESSAGE)}
            onChange={this.handleDeadlineMessageChanged}
          />
        </Grid>
        <Grid container justify="space-around">
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
            <Grid item xs={6}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                label={t('Date')}
                format={DEFAULT_DATE_FORMAT}
                value={selectedDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': t('change date'),
                }}
                minDate={Date.now()}
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardTimePicker
                ampm={false}
                label={t('Time')}
                value={selectedDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': t('change time'),
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
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

const mapStateToProps = ({ layout, appInstance, context }) => ({
  open: layout.settings.open,
  settings: appInstance.content.settings,
  activity: Boolean(appInstance.activity.length),
  lang: context.lang || DEFAULT_LANG,
});

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
