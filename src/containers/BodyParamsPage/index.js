import React, { Component } from "react";
import history from "../../utils/history";
import MaterialTable from "material-table";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import Button from "@material-ui/core/Button";

class Page extends Component {
  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const { readBodyParams } = this.props;
    readBodyParams();
  };

  render() {
    const {
      bodyParamsItems,
      createBodyParam,
      updateBodyParam,
      deleteBodyParam,
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
              title: <FormattedMessage {...commonMessages.name} />,
              field: "name",
            },

            {
              title: <FormattedMessage {...commonMessages.bodyValues} />,
              field: "values",
              render: rowData => rowData.values.map(e => e.name).join(", "),
              editComponent: props => {
                const values = props.value || [];
                return values.map(e => e.name).join(", ");
              },
            },
          ]}
          data={bodyParamsItems}
          actions={[
            {
              icon: "open_in_new",
              tooltip: <FormattedMessage {...messages.openActionTooltip} />,
              onClick: (event, rowData) => {
                history.replace(`/bodyparams/${rowData.id}`);
              },
            },
          ]}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                console.log(newData);
                createBodyParam({
                  ...newData,
                });
                resolve();
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                if (newData.name === oldData.name) {
                  resolve();
                  return;
                }

                updateBodyParam(oldData.id, { $set: { name: newData.name } });
                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                deleteBodyParam(oldData.id);
                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

export default storeItemsHOC(Page);
