import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

import Button from "@material-ui/core/Button";

import LoginForm from "./form";
import { LoginRequest } from "../../store/modules/user/actions";

class Instance extends Component {
  submitHandler = ({ name, password }) => {
    console.log(name, password);

    this.props.login(name, password);
  };

  render() {
    return (
      <div>
        <LoginForm submitHandler={this.submitHandler} />
        <div className="footer">
          <Button component={Link} to="/signup">
            <FormattedMessage {...commonMessages.signup} />
          </Button>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  login: (name, password) => {
    dispatch(LoginRequest(name, password));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(Instance);
