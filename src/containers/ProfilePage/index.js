import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { ReadUserRequest } from "../../store/modules/user/actions";

class Instance extends Component {
  componentDidMount() {
    const { user, readUser } = this.props;
    if (isEmpty(user)) readUser();
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <header>
          <h1>Home Page</h1>
          <p>Hi {user.name}</p>
        </header>
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
