import React, { Component } from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../store/modules/entities";

const BodyValuesAlias = ["bodyValues"];
const BodyValuesActions = actions[BodyValuesAlias];
const BodyValuesSelectors = selectors[BodyValuesAlias];

const BodyParamsAlias = ["bodyParams"];
const BodyParamsActions = actions[BodyParamsAlias];
const BodyParamsSelectors = selectors[BodyParamsAlias];

const EntitiesAlias = ["entities"];
const EntitiesActions = actions[EntitiesAlias];
const EntitiesSelectors = selectors[EntitiesAlias];

const PositionsAlias = ["positions"];
const PositionsActions = actions[PositionsAlias];
const PositionsSelectors = selectors[PositionsAlias];

const EmployeesAlias = ["employees"];
const EmployeesActions = actions[EmployeesAlias];
const EmployeesSelectors = selectors[EmployeesAlias];

const StoreAlias = ["store"];
const StoreActions = actions[StoreAlias];
const StoreSelectors = selectors[StoreAlias];

const HistoryAlias = ["history"];
const HistoryActions = actions[HistoryAlias];
const HistorySelectors = selectors[HistoryAlias];

const mapStateToProps = ({ lists, data, requisition, requisitionStore }) => ({
  data,

  bodyParamsItems: BodyParamsSelectors.getItems(lists[BodyParamsAlias], data),
  entitiesItems: EntitiesSelectors.getItems(lists[EntitiesAlias], data),
  positionsItems: PositionsSelectors.getItems(lists[PositionsAlias], data),
  employeesItems: EmployeesSelectors.getItems(lists[EmployeesAlias], data),
  storeItems: StoreSelectors.getItems(lists[StoreAlias], data),
  historyItems: HistorySelectors.getItems(lists[HistoryAlias], data),

  requisition: requisition.data,
  requisitionStore: requisitionStore.data,
});

const mapDispatchToProps = dispatch => ({
  updateBodyValue: (id, args) =>
    dispatch(BodyValuesActions.updateById(id, args)),

  readBodyParams: () => dispatch(BodyParamsActions.readMany()),

  createBodyParam: args => dispatch(BodyParamsActions.create(args)),
  readBodyParam: id => dispatch(BodyParamsActions.readById(id)),
  updateBodyParam: (id, args) =>
    dispatch(BodyParamsActions.updateById(id, args)),
  deleteBodyParam: id => dispatch(BodyParamsActions.deleteById(id)),

  readEntities: () => dispatch(EntitiesActions.readMany()),

  createEntity: args => dispatch(EntitiesActions.create(args)),
  readEntity: id => dispatch(EntitiesActions.readById(id)),
  updateEntity: (id, args) => dispatch(EntitiesActions.updateById(id, args)),
  deleteEntity: id => dispatch(EntitiesActions.deleteById(id)),

  createPosition: args => dispatch(PositionsActions.create(args)),
  readPositions: () => dispatch(PositionsActions.readMany()),
  updatePosition: (id, args) => dispatch(PositionsActions.updateById(id, args)),
  deletePosition: id => dispatch(PositionsActions.deleteById(id)),

  readEmployees: () => dispatch(EmployeesActions.readMany()),

  createEmployee: args => dispatch(EmployeesActions.create(args)),
  readEmployee: id => dispatch(EmployeesActions.readById(id)),
  updateEmployee: (id, args) => dispatch(EmployeesActions.updateById(id, args)),
  deleteEmployee: id => dispatch(EmployeesActions.deleteById(id)),

  createStoreItem: args => dispatch(StoreActions.create(args)),
  readStore: () => dispatch(StoreActions.readMany()),
  updateStoreItem: (id, args) => dispatch(StoreActions.updateById(id, args)),
  deleteStoreItem: id => dispatch(StoreActions.deleteById(id)),

  createHistoryItem: args => dispatch(HistoryActions.create(args)),
  readHistory: args => dispatch(HistoryActions.readMany(args)),
  deleteHistoryItem: id => dispatch(HistoryActions.deleteById(id)),
});

const storeItemsHOC = WrappedComponent => {
  class StoreItemsContainer extends Component {
    render() {
      const { data } = this.props;
      const props = {
        getBodyValuesItem: id => BodyValuesSelectors.getItemById(id, data),
        getBodyParamsItem: id => BodyParamsSelectors.getItemById(id, data),
        getEntitiesItem: id => EntitiesSelectors.getItemById(id, data),
        getPositionsItem: id => PositionsSelectors.getItemById(id, data),
        getEmployeesItem: id => EmployeesSelectors.getItemById(id, data),
      };
      return <WrappedComponent {...this.props} {...props} />;
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(StoreItemsContainer);
};

export default storeItemsHOC;
