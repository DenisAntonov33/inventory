import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import LoginForm from "../../components/LoginForm";
import { login } from "../../services/orm";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  paper: {
    minWidth: 320,
    maxWidth: 400,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <header>
            <h1>Login Page</h1>
          </header>

          <LoginForm submitHandler={this.submitLoginHandler} />
          <Button component={Link} to="/signup">
            Signup
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
