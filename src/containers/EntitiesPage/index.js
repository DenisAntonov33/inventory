import React, { Component } from "react";
import MaterialTable from "material-table";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import Button from "@material-ui/core/Button";

class EntityPage extends Component {
  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const { readBodyParams, readEntities } = this.props;

    readBodyParams();
    readEntities();
  };

  render() {
    const {
      bodyParamsItems,
      entitiesItems,
      createEntity,
      updateEntity,
      deleteEntity,
    } = this.props;

    const formattedBodyParams = bodyParamsItems.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});

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
              title: <FormattedMessage {...commonMessages.name} />,
              field: "name",
            },
            {
              title: <FormattedMessage {...commonMessages.certificateNumber} />,
              field: "certificate",
            },
            {
              title: <FormattedMessage {...commonMessages.replacementPeriod} />,
              field: "replacementPeriod",
              type: "numeric",
            },
            {
              title: <FormattedMessage {...commonMessages.bodyParam} />,
              field: "bodyParam",
              lookup: formattedBodyParams,
              render: rowData =>
                rowData.bodyParam ? rowData.bodyParam.name : "",
            },
          ]}
          data={entitiesItems}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createEntity({
                  ...newData,
                  replacementPeriod: +newData.replacementPeriod,
                  bodyParam: newData.bodyParam,
                });
                resolve();
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                console.log(newData);

                const args = Object.keys(newData).reduce((acc, curr) => {
                  if (newData[curr] !== oldData[curr])
                    acc[curr] = newData[curr];
                  if (curr === "replacementPeriod") acc[curr] = +acc[curr];
                  if (curr === "bodyParam")
                    acc[curr] =
                      typeof acc[curr] === "object" ? acc[curr].id : acc[curr];
                  return acc;
                }, {});

                updateEntity(oldData.id, { $set: args });
                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                deleteEntity(oldData.id);
                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

export default storeItemsHOC(EntityPage);
