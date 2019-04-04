import React, { Component } from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../store/modules/entities";

import bodyParamsForm from "./bodyParamsForm";
import EntityList from "./entityList";

const formsComponents = {
  bodyValues: "",
  bodyParams: bodyParamsForm,
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

  removeHandler = id => {
    const { alias, removeEntity } = this.props;
    removeEntity(alias, id);
  };

  render() {
    const { alias, lists, data } = this.props;
    const Form = formsComponents[alias];

    const items = selectors[alias].getItems(lists[alias], data);

    return (
      <div>
        <header>
          <h1>{alias}</h1>
        </header>
        <Form submitHandler={this.submitHandler} />
        <div>
          <EntityList
            alias={alias}
            items={items}
            removeHandler={this.removeHandler}
          />
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
  removeEntity: (alias, id) => dispatch(actions[alias].deleteById(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instance);
