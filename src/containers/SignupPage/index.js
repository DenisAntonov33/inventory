import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import SignupForm from "../../components/SignupForm";
import { signup } from "../../services/orm";

class Instance extends Component {
  submitSignupHandler = args => {
    const data = signup(args);

    const { status } = data;
    if (status !== 200) return;

    const {
      data: { token }
    } = data;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <SignupForm submitHandler={this.submitLoginHandler} />
        <Button component={Link} to="/login">
          Login
        </Button>
      </div>
    );
  }
}

export default Instance;
