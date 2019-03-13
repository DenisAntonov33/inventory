import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./index.css";

import { SignupForm } from "../../components/SignupForm";
import { signup } from "../../services/orm";

class App extends Component {
  submitSignupHandler = args => {
    const data = signup(args);
    console.log(data);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Login Page</h1>
        </header>

        <SignupForm submitHandler={this.submitSignupHandler} />

        <Link to="/">Home</Link>
        <Link to="/signup">Signup</Link>
      </div>
    );
  }
}

export default App;
