import React, { Component } from "react";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import PublicWrapper from "../../components/PublicWrapper";
import PrivateWrapper from "../../components/PrivateWrapper";
import LoginPage from "../LoginPage";
import SignupPage from "../SignupPage";
import DashboardPage from "../DashboardPage";
import BodyParamsPage from "../BodyParamsPage";

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (
        <PublicWrapper {...rest} content={<Component {...props} />} />
      )}
    />
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <PrivateWrapper content={<Component {...props} />} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <PrivateRoute exact path="/" component={DashboardPage} />
          <PrivateRoute exact path="/bodyparams" component={BodyParamsPage} />
          <PublicRoute
            exact
            path="/login"
            title="Login page"
            component={LoginPage}
          />
          <PublicRoute
            exact
            path="/signup"
            title="Signup page"
            component={SignupPage}
          />
          <Route to="*" component={() => <Redirect to="/" />} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
