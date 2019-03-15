import React, { Component } from "react";

import BodyParamForm from "../../components/BodyParamForm";

class Instance extends Component {
  submitHandler = values => {};

  render() {
    return (
      <div>
        <header>
          <h1>Body params page</h1>
        </header>
        <BodyParamForm submitHandler={this.submitHandler} />
      </div>
    );
  }
}

export default Instance;
