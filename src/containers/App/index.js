import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";

import "./index.css";

import HomePage from "../HomePage";
import LoginPage from "../LoginPage";
import SignupPage from "../SignupPage";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
