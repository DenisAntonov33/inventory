import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./index.css";

import { LoginForm } from "../../components/LoginForm";
import { login } from "../../services/orm";

class App extends Component {
  submitLoginHandler = args => {
    const data = login(args);
    console.log(data);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Login Page</h1>
        </header>

        <LoginForm submitHandler={this.submitLoginHandler} />

        <Link to="/">Home</Link>
        <Link to="/signup">Signup</Link>
      </div>
    );
  }
}

export default App;
