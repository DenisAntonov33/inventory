import React, { Component } from "react";

import Form from "./form";

class Instance extends Component {
  submitHandler = values => {
    console.log(values);
  };

  render() {
    return (
      <div>
        <header>
          <h1>Body params page</h1>
        </header>
        <Form submitHandler={this.submitHandler} />
      </div>
    );
  }
}

export default Instance;
