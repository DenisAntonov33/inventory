import React, { Component } from "react";
import { connect } from "react-redux";
import { DateTime } from "luxon";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import MaterialTable from "material-table";
import { pullAllWith, isEqual } from "lodash";
import Button from "@material-ui/core/Button";

import {
  CreateRequisitionRequest,
  CreateRequisitionSuccess,
} from "../../store/modules/requisition/actions";

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
    const {
      requisition,
      setRequisitionItems,

      getBodyValuesItem,
      getEmployeesItem,
      getPositionsItem,
      getEntitiesItem,
    } = this.props;

    return (
      <div>
        <header className="page__header">
          <h1>
            <FormattedMessage {...messages.pageTitle} />
          </h1>
          <Button
            variant="contained"
            color="primary"
            onClick={this.refreshData}
          >
            <FormattedMessage {...commonMessages.refreshButton.label} />
          </Button>
        </header>

        <MaterialTable
          title=""
          columns={[
            {
              title: <FormattedMessage {...commonMessages.date} />,
              field: "date",
              type: "date",
              readonly: true,
              render: rowData =>
                DateTime.fromMillis(rowData.date).toFormat("dd.LL.yyyy"),
            },
            {
              title: <FormattedMessage {...commonMessages.employee} />,
              field: "employee",
              readonly: true,
              render: rowData => getEmployeesItem(rowData.employee).name,
            },
            {
              title: <FormattedMessage {...commonMessages.positions} />,
              field: "positions",
              readonly: true,
              render: rowData =>
                rowData.positions.map(e => getPositionsItem(e).name).join(", "),
            },
            {
              title: <FormattedMessage {...commonMessages.entity} />,
              field: "entity",
              readonly: true,
              render: rowData => getEntitiesItem(rowData.entity).name,
            },
            {
              title: <FormattedMessage {...commonMessages.bodyValue} />,
              field: "bodyValue",
              readonly: true,
              render: rowData => getBodyValuesItem(rowData.bodyValue).name,
            },
            {
              title: <FormattedMessage {...commonMessages.count} />,
              field: "count",
              type: "numeric",
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

const mapStateToProps = ({ requisition }) => ({
  requisition: requisition.data,
});

const mapDispatchToProps = dispatch => ({
  createRequisition: () => dispatch(CreateRequisitionRequest()),
  setRequisitionItems: items => dispatch(CreateRequisitionSuccess(items)),
});

export default storeItemsHOC(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntityPage)
);
