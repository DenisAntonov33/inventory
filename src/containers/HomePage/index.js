import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { FormattedMessage } from "react-intl";
import messages from "./messages";

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
          <h1>
            <FormattedMessage {...messages.pageTitle} />
          </h1>
        </header>

        <div className="row row--links">
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/requisition"
          >
            <FormattedMessage {...messages.createRequisitionButton.label} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/requisition-store"
          >
            <FormattedMessage
              {...messages.createRequisitionStoreButton.label}
            />
          </Button>
        </div>
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
