import React, { Component } from "react";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "../../store";
import { getToken } from "../../utils/localStorageService";
import PublicWrapper from "../../components/PublicWrapper";
import PrivateWrapper from "../../components/PrivateWrapper";
import LoginPage from "../LoginPage";
import SignupPage from "../SignupPage";
import DashboardPage from "../DashboardPage";
import ProfilePage from "../ProfilePage";
import BodyParamsPage from "../BodyParamsPage";
import BodyParamsItemPage from "../BodyParamsItemPage";
import EntitiesPage from "../EntitiesPage";
import PositionsPage from "../PositionsPage";
import EmployeesPage from "../EmployeesPage";
import EmployeesItemPage from "../EmployeesItemPage";

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
  const token = getToken();
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
              state: { from: props.location },
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
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <PrivateRoute exact path="/" component={DashboardPage} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute
              path="/bodyparams/:id"
              component={BodyParamsItemPage}
            />
            <PrivateRoute exact path="/bodyparams" component={BodyParamsPage} />
            <PrivateRoute exact path="/entities" component={EntitiesPage} />
            <PrivateRoute exact path="/positions" component={PositionsPage} />
            <PrivateRoute
              exact
              path="/employees/:id"
              component={EmployeesItemPage}
            />
            <PrivateRoute exact path="/employees" component={EmployeesPage} />
            <PublicRoute
              path="/login"
              title="Login page"
              component={LoginPage}
            />
            <PublicRoute
              path="/signup"
              title="Signup page"
              component={SignupPage}
            />
            <Route to="*" component={() => <Redirect to="/" />} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
