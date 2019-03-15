import React, { Component } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";

import "./index.css";

import { ACCESS_TOKEN_KEY } from "../../services/constants";
import LoginPage from "../LoginPage";
import SignupPage from "../SignupPage";
import DashboardPage from "../DashboardPage";

function PrivateRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
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
        <div className="h100p">
          <PrivateRoute exact path="/" component={DashboardPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
