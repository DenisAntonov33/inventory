import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import SignupForm from "../../components/SignupForm";
import { signup } from "../../services/orm";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  paper: {
    minWidth: 350,
    maxWidth: 400,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <header>
            <h1>Signup Page</h1>
          </header>

          <SignupForm submitHandler={this.submitSignupHandler} />
          <Button component={Link} to="/">
            Login
          </Button>
        </Paper>
      </div>
    );
  }
}

Instance.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Instance);
