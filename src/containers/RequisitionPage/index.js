import React, { Component } from "react";
import { connect } from "react-redux";
import { DateTime } from "luxon";

import MaterialTable from "material-table";
import { pullAllWith, isEqual } from "lodash";
import Button from "@material-ui/core/Button";

import { actions, selectors } from "../../store/modules/entities";
import {
  CreateRequisitionRequest,
  CreateRequisitionSuccess,
} from "../../store/modules/requisition/actions";

const HistoryAlias = ["history"];
const HistoryActions = actions[HistoryAlias];

const StoreAlias = ["store"];
const StoreActions = actions[StoreAlias];

const EmployeesAlias = ["employees"];
const EmployeesActions = actions[EmployeesAlias];
const EmployeesSelectors = selectors[EmployeesAlias];

const PositionsAlias = ["positions"];
const PositionsActions = actions[PositionsAlias];
const PositionsSelectors = selectors[PositionsAlias];

const EntitiesAlias = ["entities"];
const EntitiesActions = actions[EntitiesAlias];
const EntitiesSelectors = selectors[EntitiesAlias];

const BodyParamsAlias = ["bodyParams"];
const BodyParamsActions = actions[BodyParamsAlias];

const BodyValuesAlias = ["bodyValues"];
const BodyValuesSelectors = selectors[BodyValuesAlias];

class EntityPage extends Component {
  componentDidMount() {
    const { createRequisition } = this.props;

    this.refreshData();
    createRequisition();
  }

  refreshData = () => {
    const {
      readStore,
      readEmployees,
      readPositions,
      readEntities,
      readBodyParams,
      setRequisitionItems,
    } = this.props;

    setRequisitionItems([]);

    readStore();
    readEmployees();
    readPositions();
    readEntities();
    readBodyParams();
  };

  pushHistory = () => {
    const { requisition, createHistoryItem } = this.props;

    requisition
      .filter(e => e.count > 0)
      .forEach(e => {
        createHistoryItem(e);
      });
  };

  render() {
    const { data, requisition, setRequisitionItems } = this.props;

    return (
      <div>
        <header className="page__header">
          <h1>Requisition Page</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={this.refreshData}
          >
            Refresh
          </Button>
        </header>

        <MaterialTable
          title="Editable Example"
          columns={[
            {
              title: "Date",
              field: "date",
              type: "date",
              readonly: true,
              render: rowData =>
                DateTime.fromMillis(rowData.date).toFormat("dd.LL.yyyy"),
            },
            {
              title: "Employee",
              field: "employee",
              readonly: true,
              render: rowData =>
                EmployeesSelectors.getItemById(rowData.employee, data).name,
            },
            {
              title: "Positions",
              field: "positions",
              readonly: true,
              render: rowData =>
                rowData.positions
                  .map(e => PositionsSelectors.getItemById(e, data).name)
                  .join(", "),
            },
            {
              title: "Entity",
              field: "entity",
              readonly: true,
              render: rowData =>
                EntitiesSelectors.getItemById(rowData.entity, data).name,
            },
            {
              title: "Body Value",
              field: "bodyValue",
              readonly: true,
              render: rowData =>
                BodyValuesSelectors.getItemById(rowData.bodyValue, data).name,
            },
            {
              title: "Count",
              field: "count",
              type: "number",
            },
          ]}
          data={requisition}
          editable={{
            // onRowAdd: newData =>
            //   new Promise(resolve => {
            //     setRequisitionItems([
            //       ...requisition,
            //       {
            //         ...newData,
            //         date: Date.parse(newData.date),
            //       },
            //     ]);

            //     resolve();
            //   }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                console.log(newData);

                const item = requisition.find(e => e.id === oldData.id);
                item.count = +newData.count;

                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                setRequisitionItems(
                  pullAllWith(requisition, [oldData], isEqual)
                );

                resolve();
              }),
          }}
        />
        <div className="page__footer">
          <Button
            variant="contained"
            color="primary"
            onClick={this.pushHistory}
          >
            Approve
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ lists, data, requisition }) => ({
  requisition: requisition.data,
  data,
  storeIds: lists[StoreAlias],
  employeesIds: lists[EmployeesAlias],
  entitiesIds: lists[EntitiesAlias],
  positionsIds: lists[PositionsAlias],
  bodyParamsIds: lists[BodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createRequisition: () => dispatch(CreateRequisitionRequest()),
  setRequisitionItems: items => dispatch(CreateRequisitionSuccess(items)),
  createHistoryItem: args => dispatch(HistoryActions.create(args)),
  readStore: () => dispatch(StoreActions.readMany()),
  readEmployees: () => dispatch(EmployeesActions.readMany()),
  readEntities: () => dispatch(EntitiesActions.readMany()),
  readPositions: () => dispatch(PositionsActions.readMany()),
  readBodyParams: () => dispatch(BodyParamsActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
