import React, { Component } from "react";

import history from "../../utils/history";
import MaterialTable from "material-table";
import { pull } from "lodash";

import storeItemsHOC from "../StoreItemsHOC";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

class EntityPage extends Component {
  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const { readEmployees, readPositions, readBodyParams } = this.props;

    readEmployees();
    readPositions();
    readBodyParams();
  };

  render() {
    const {
      createEmployee,
      updateEmployee,
      deleteEmployee,
      employeesItems,
      positionsItems,
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
          localization={{
            body: {
              emptyDataSourceMessage: (
                <FormattedMessage {...commonMessages.emptyDataSourceMessage} />
              ),
            },
          }}
          title=""
          columns={[
            {
              title: <FormattedMessage {...commonMessages.name} />,
              field: "name",
            },
            {
              title: <FormattedMessage {...commonMessages.positions} />,
              field: "positions",
              editComponent: props => {
                const isInitial =
                  props.value && typeof props.value[0] === "object";

                const selectedValues = isInitial
                  ? props.value.map(e => e.id)
                  : props.value || [];

                return (
                  <FormControl component="fieldset">
                    <FormGroup>
                      {positionsItems.map(e => {
                        return (
                          <FormControlLabel
                            key={e.id}
                            control={
                              <Checkbox
                                checked={selectedValues.includes(e.id)}
                                onChange={e => {
                                  e.target.checked
                                    ? selectedValues.push(e.target.value)
                                    : pull(selectedValues, e.target.value);

                                  props.onChange(selectedValues);
                                }}
                                value={e.id}
                              />
                            }
                            label={e.name}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                );
              },
              render: rowData => {
                return rowData.positions.map(e => e.name).join(", ");
              },
            },
            {
              title: <FormattedMessage {...commonMessages.bodyParams} />,
              field: "bodyParams",
              readonly: true,
              render: rowData => {
                return rowData.bodyParams
                  .map(e => `${e.bodyParam.name} - ${e.bodyValue.name}`)
                  .join(", ");
              },
              editComponent: () => "-",
            },
          ]}
          data={employeesItems}
          actions={[
            {
              icon: "open_in_new",
              tooltip: <FormattedMessage {...messages.openActionTooltip} />,
              onClick: (event, rowData) => {
                history.replace(`/employees/${rowData.id}`);
              },
            },
          ]}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createEmployee(newData);
                resolve();
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                const args = {
                  ...(newData.name !== oldData.name
                    ? { name: newData.name }
                    : {}),
                  ...{
                    positions: newData.positions.map(e =>
                      typeof e === "object" ? e.id : e
                    ),
                  },
                };

                updateEmployee(oldData.id, { $set: args });
                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                deleteEmployee(oldData.id);
                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

export default storeItemsHOC(EntityPage);
