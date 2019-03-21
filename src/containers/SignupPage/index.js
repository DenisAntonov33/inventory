import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import SignupForm from "./form";
import { signup } from "../../services/api";

class Instance extends Component {
  submitHandler = args => {
    const data = signup(args);
    console.log("signup", data);

    const { status } = data;
    if (status !== 200) return;

    const {
      data: { token },
    } = data;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <SignupForm submitHandler={this.submitHandler} />
        <div className="footer">
          <Button component={Link} to="/login">
            Login
          </Button>
        </div>
      </div>
    );
  }
}

export default Instance;
