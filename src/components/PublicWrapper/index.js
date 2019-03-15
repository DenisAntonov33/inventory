import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Instance);
