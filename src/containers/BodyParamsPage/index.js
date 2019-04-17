import React, { Component } from "react";
import { connect } from "react-redux";

import Modal from "../../components/Modal";

import { actions, selectors } from "../../store/modules/entities";
import BodyParamsForm from "./BodyParamForm";
import BodyParamsList from "./BodyParamsList";

import BodyValueForm from "./BodyValueForm";
import BodyValuesList from "./BodyValuesList";

const bodyParamsAlias = ["bodyParams"];
const bodyParamsActions = actions[bodyParamsAlias];
const bodyParamsSelectors = selectors[bodyParamsAlias];

class EntityPage extends Component {
  state = {
    isModalOpen: true,
    selectedItemId: null,
  };

  componentDidMount() {
    const { readBodyParams, bodyParamsIds, data } = this.props;
    const bodyParams = bodyParamsSelectors.getItems(bodyParamsIds, data);

    if (!bodyParams.length) readBodyParams();
  }

  submitHandler = values => {
    const { createBodyParam } = this.props;
    createBodyParam(values);
  };

  openItemModal = id => {
    if (!id) return;
    this.setState({ isModalOpen: true, selectedItemId: id });
  };

  closeItemModal = () => {
    this.setState({ isModalOpen: false, selectedItemId: null });
  };

  createValueHandler = (id, values) => {
    const { updateBodyParam } = this.props;
    const { name } = values;
    updateBodyParam(id, { $create: { values: { name } } });
  };

  removeValueHandler = (id, valueId) => {
    const { updateBodyParam } = this.props;
    updateBodyParam(id, { $pull: { values: { id: valueId } } });
  };

  removeHandler = id => {
    const { deleteBodyParam } = this.props;
    deleteBodyParam(id);
  };

  render() {
    const { isModalOpen, selectedItemId } = this.state;
    const { bodyParamsIds, data } = this.props;

    const bodyParams = bodyParamsSelectors.getItems(bodyParamsIds, data);

    const selectedItem = selectedItemId
      ? bodyParamsSelectors.getItemById(selectedItemId, data)
      : null;

    return (
      <div>
        <header>
          <h1>{bodyParamsAlias}</h1>
        </header>

        {selectedItemId && (
          <Modal isOpen={isModalOpen} onClose={this.closeItemModal}>
            <BodyValueForm
              submitHandler={values =>
                this.createValueHandler(selectedItemId, values)
              }
            />
            <BodyValuesList
              items={[...selectedItem.values]}
              removeHandler={id => this.removeValueHandler(selectedItemId, id)}
            />
          </Modal>
        )}

        <BodyParamsForm submitHandler={this.submitHandler} />
        <BodyParamsList
          items={bodyParams}
          updateHandler={this.openItemModal}
          removeHandler={this.removeHandler}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ lists, data }) => ({
  data,
  bodyParamsIds: lists[bodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createBodyParam: args => dispatch(bodyParamsActions.create(args)),
  readBodyParams: () => dispatch(bodyParamsActions.readMany()),
  readBodyParam: id => dispatch(bodyParamsActions.readById(id)),
  updateBodyParam: (id, args) =>
    dispatch(bodyParamsActions.updateById(id, args)),
  deleteBodyParam: id => dispatch(bodyParamsActions.deleteById(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
