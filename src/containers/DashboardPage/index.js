import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

import Button from "@material-ui/core/Button";

import { ReadUserRequest } from "../../store/modules/user/actions";

class Instance extends Component {
  componentDidMount() {
    const { user, readUser } = this.props;
    if (isEmpty(user)) readUser();
  }

  render() {
    return (
      <div>
        <header>
          <h1>Home Page</h1>
        </header>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/requisition"
        >
          Create requisition
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user.data });

const mapDispatchToProps = dispatch => ({
  readUser: () => dispatch(ReadUserRequest()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instance);
