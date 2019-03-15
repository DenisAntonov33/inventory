import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import LoginForm from "../../components/LoginForm";
import { login } from "../../services/orm";

class Instance extends Component {
  submitLoginHandler = args => {
    const data = login(args);

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
        <LoginForm submitHandler={this.submitLoginHandler} />
        <Button component={Link} to="/signup">
          Signup
        </Button>
      </div>
    );
  }
}

export default Instance;
