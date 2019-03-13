import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./index.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Home page</h1>
        </header>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    );
  }
}

export default App;
