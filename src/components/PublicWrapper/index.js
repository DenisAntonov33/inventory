import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import bg from "../../assets/login.jpg";

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    background: `url(${bg}) no-repeat`,
    backgroundSize: "contain",
    backgroundPosition: "center center",
  },
  paper: {
    minWidth: 350,
    maxWidth: 400,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: "rgba(255,255,255, .5)",
  },
});

class Instance extends Component {
  render() {
    const { classes } = this.props;
    const { title, content } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <header>
            <h1>{title}</h1>
          </header>
          {content}
        </Paper>
      </div>
    );
  }
}

Instance.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Instance);
