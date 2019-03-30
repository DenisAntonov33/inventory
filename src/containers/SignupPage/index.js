import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";

import LoginForm from "./form";
import { SignupRequest } from "../../store/modules/user/actions";

class Instance extends Component {
  submitHandler = ({ name, password, password1 }) => {
    this.props.signup(name, password, password1);
  };

  render() {
    return (
      <div>
        <LoginForm submitHandler={this.submitHandler} />
        <div className="footer">
          <Button component={Link} to="/login">
            Login
          </Button>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  signup: (name, password, password1) => {
    dispatch(SignupRequest(name, password, password1));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(Instance);
