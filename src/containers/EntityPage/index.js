import React, { Component } from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../store/modules/entities";

import bodyParamsForm from "./bodyParamsForm";
import bodyParamsList from "./bodyParamsList";

const formsComponents = {
  bodyValues: "",
  bodyParams: bodyParamsForm,
  entities: "",
  positions: "",
  employees: "",
  history: "",
};

const listsComponents = {
  bodyValues: "",
  bodyParams: bodyParamsList,
  entities: "",
  positions: "",
  employees: "",
  history: "",
};

class Instance extends Component {
  componentDidMount() {
    const { alias, readEntities, lists, data } = this.props;
    const items = selectors[alias].getItems(lists[alias], data);

    if (!items.length) readEntities(alias);
  }

  submitHandler = values => {
    const { alias, createEntity } = this.props;
    createEntity(alias, values);
  };

  render() {
    const { alias, lists, data } = this.props;
    const Form = formsComponents[alias];
    const List = listsComponents[alias];

    const items = selectors[alias].getItems(lists[alias], data);

    return (
      <div>
        <header>
          <h1>{alias}</h1>
        </header>
        <Form submitHandler={this.submitHandler} />
        <div>
          <List items={items} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
  lists: state.lists,
});

const mapDispatchToProps = dispatch => ({
  createEntity: (alias, args) => dispatch(actions[alias].create(args)),
  readEntities: alias => dispatch(actions[alias].readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instance);
