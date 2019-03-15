import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({});

class Instance extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <header>
          <h1>Home Page</h1>
        </header>
      </div>
    );
  }
}

Instance.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Instance);
