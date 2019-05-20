import React, { Component } from "react";
import { connect } from "react-redux";
import ReactToPrint from "react-to-print";
import { cloneDeep } from "lodash";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";
import SRCardToPrint from "../../components/SRCardToPrint";

import MaterialTable from "material-table";
import { pullAllWith, isEqual } from "lodash";
import Button from "@material-ui/core/Button";

import {
  CreateRequisitionStoreRequest,
  CreateRequisitionStoreSuccess,
} from "../../store/modules/requisition-store/actions";

class EntityPage extends Component {
  componentDidMount() {
    const { createRequisitionStore } = this.props;

    this.refreshData();
    createRequisitionStore();
  }

  refreshData = () => {
    const {
      readStore,
      readEntities,
      readBodyParams,
      setRequisitionStoreItems,
    } = this.props;

    setRequisitionStoreItems([]);

    readStore();
    readEntities();
    readBodyParams();
  };

  pushToStore = () => {
    const { requisitionStore, createStoreItem } = this.props;

    cloneDeep(requisitionStore)
      .filter(e => e.count > 0)
      .forEach(e => {
        delete e.nessesaryCount;
        createStoreItem(e);
      });
  };

  render() {
    const {
      requisitionStore,
      setRequisitionStoreItems,
      getBodyValuesItem,
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
              title: <FormattedMessage {...commonMessages.entity} />,
              field: "entity",
              readonly: true,
              render: rowData => getEntitiesItem(rowData.entity).name,
            },
            {
              title: <FormattedMessage {...commonMessages.bodyValue} />,
              field: "bodyValue",
              readonly: true,
              render: rowData =>
                rowData.bodyValue
                  ? getBodyValuesItem(rowData.bodyValue).name
                  : "-",
            },
            {
              title: <FormattedMessage {...commonMessages.nessesaryCount} />,
              field: "nessesaryCount",
              readonly: true,
              type: "numeric",
            },
            {
              title: <FormattedMessage {...commonMessages.count} />,
              field: "count",
              type: "numeric",
            },
          ]}
          data={requisitionStore}
          editable={{
            // onRowAdd: newData =>
            //   new Promise(resolve => {
            //     setRequisitionStoreItems([
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
                const item = requisitionStore.find(
                  e =>
                    e.entity === oldData.entity &&
                    e.bodyValue === oldData.bodyValue
                );

                item.count = +newData.count;

                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                setRequisitionStoreItems(
                  pullAllWith(requisitionStore, [oldData], isEqual)
                );

                resolve();
              }),
          }}
        />

        <div className="row row--buttons row--end">
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                <FormattedMessage {...commonMessages.printButton.label} />
              </Button>
            )}
            content={() => this.componentRef}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={this.pushToStore}
          >
            <FormattedMessage {...commonMessages.approve} />
          </Button>
        </div>

        <SRCardToPrint
          ref={el => (this.componentRef = el)}
          data={requisitionStore.map(e => ({
            ...e,
            bodyValue: getBodyValuesItem(e.bodyValue),
            entity: getEntitiesItem(e.entity),
          }))}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ requisitionStore }) => ({
  requisition: requisitionStore.data,
});

const mapDispatchToProps = dispatch => ({
  createRequisitionStore: () => dispatch(CreateRequisitionStoreRequest()),
  setRequisitionStoreItems: items =>
    dispatch(CreateRequisitionStoreSuccess(items)),
});

export default storeItemsHOC(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EntityPage)
);
