import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { ReadUserRequest } from "../../store/modules/user/actions";

import { FormattedMessage } from "react-intl";
import messages from "./messages";
import { updateLocale } from "../../store/modules/intl";

import ProfileForm from "./form";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { UpdateUserRequest } from "../../store/modules/user/actions";

class Instance extends Component {
  componentDidMount() {
    const { user, readUser } = this.props;
    if (isEmpty(user)) readUser();
  }

  submitHandler = values => {
    const { updateUser } = this.props;
    updateUser({ $set: { ...values } });
  };

  render() {
    const { user, currentLocale, locales, updateIntl } = this.props;
    return (
      <div>
        <header>
          <h1>
            <FormattedMessage {...messages.pageTitle} />
          </h1>
        </header>
        <FormControl>
          <InputLabel htmlFor="age-simple">
            <FormattedMessage {...messages.languageSelect} />
          </InputLabel>
          <Select
            value={currentLocale}
            onChange={e => updateIntl(e.target.value, locales[e.target.value])}
            inputProps={{
              name: "age",
              id: "age-simple",
            }}
          >
            {Object.keys(locales).map(locale => (
              <MenuItem key={locale} value={locale}>
                {locale}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ProfileForm data={user} submitHandler={this.submitHandler} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  currentLocale: state.intl.locale,
  locales: state.locales,
});

const mapDispatchToProps = dispatch => ({
  readUser: () => dispatch(ReadUserRequest()),
  updateIntl: (locale, messages) =>
    dispatch(updateLocale({ locale, messages })),
  updateUser: args => dispatch(UpdateUserRequest(args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instance);
