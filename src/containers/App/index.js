import React, { Component } from "react";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import { IntlProvider } from "react-intl-redux";
import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

import { store } from "../../store";
import { updateLocaleFromLocalStorage } from "../../store/modules/intl";
import { getToken } from "../../utils/localStorageService";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import PublicWrapper from "../../components/PublicWrapper";
import PrivateWrapper from "../../components/PrivateWrapper";
import LoginPage from "../LoginPage";
import SignupPage from "../SignupPage";
import HomePage from "../HomePage";
import ProfilePage from "../ProfilePage";
import BodyParamsPage from "../BodyParamsPage";
import BodyParamsItemPage from "../BodyParamsItemPage";
import EntitiesPage from "../EntitiesPage";
import PositionsPage from "../PositionsPage";
import EmployeesPage from "../EmployeesPage";
import EmployeesItemPage from "../EmployeesItemPage";
import HistoryPage from "../HistoryPage";
import StorePage from "../StorePage";
import RequisitionPage from "../RequisitionPage";
import RequisitionStorePage from "../RequisitionStorePage";

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

const theme = createMuiTheme({
  palette: {
    primary: orange,
  },
});

class App extends Component {
  render() {
    store.dispatch(updateLocaleFromLocalStorage());

    return (
      <Provider store={store}>
        <IntlProvider>
          <MuiThemeProvider theme={theme}>
            <HashRouter>
              <Switch>
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute path="/profile" component={ProfilePage} />
                <PrivateRoute
                  path="/bodyparams/:id"
                  component={BodyParamsItemPage}
                />
                <PrivateRoute
                  exact
                  path="/bodyparams"
                  component={BodyParamsPage}
                />
                <PrivateRoute exact path="/entities" component={EntitiesPage} />
                <PrivateRoute
                  exact
                  path="/positions"
                  component={PositionsPage}
                />
                <PrivateRoute
                  exact
                  path="/employees/:id"
                  component={EmployeesItemPage}
                />
                <PrivateRoute
                  exact
                  path="/employees"
                  component={EmployeesPage}
                />
                <PrivateRoute exact path="/history" component={HistoryPage} />
                <PrivateRoute exact path="/store" component={StorePage} />
                <PrivateRoute
                  exact
                  path="/requisition"
                  component={RequisitionPage}
                />
                <PrivateRoute
                  exact
                  path="/requisition-store"
                  component={RequisitionStorePage}
                />
                <PublicRoute
                  path="/login"
                  title={<FormattedMessage {...commonMessages.loginTitle} />}
                  component={LoginPage}
                />
                <PublicRoute
                  path="/signup"
                  title={<FormattedMessage {...commonMessages.signupTitle} />}
                  component={SignupPage}
                />
                <Route to="*" component={() => <Redirect to="/" />} />
              </Switch>
            </HashRouter>
          </MuiThemeProvider>
        </IntlProvider>
      </Provider>
    );
  }
}

export default App;
