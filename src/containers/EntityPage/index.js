import React, { Component } from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../store/modules/entities";

import BodyParamsForm from "./forms/BodyParams";
import EntitiesForm from "./forms/Entities";

import EntityList from "./EntityList";

const Forms = {
  bodyParams: BodyParamsForm,
  entities: EntitiesForm,
  positions: "",
  employees: "",
  history: "",
};

class EntityPage extends Component {
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
    const items = selectors[alias].getItems(lists[alias], data);
    const Form = Forms[alias];

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
)(EntityPage);
