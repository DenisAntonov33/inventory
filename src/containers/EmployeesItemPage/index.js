import React, { Component } from "react";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class EntityPage extends Component {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      readEmployee,
      readBodyParams,
    } = this.props;

    readEmployee(id);
    readBodyParams();
  }

  render() {
    const {
      match: {
        params: { id },
      },
      bodyParamsItems,
      getEmployeesItem,
      getBodyParamsItem,
      updateEmployee,
    } = this.props;

    const employee = getEmployeesItem(id);
    const employeeBodyParams = employee
      ? employee.bodyParams.filter(e => !e.isDeleted)
      : [];

    let selectedBodyParam = "";

    return (
      <div>
        <header className="page__header">
          <h1>
            <FormattedMessage {...messages.pageTitle} /> - {id}
          </h1>
        </header>

        <MaterialTable
          title=""
          columns={[
            {
              title: <FormattedMessage {...commonMessages.bodyParam} />,
              field: "bodyParam",
              render: rowData => {
                return rowData.bodyParam ? rowData.bodyParam.name : "";
              },
              editComponent: props => {
                return (
                  <Select
                    value={props.value || ""}
                    onChange={e => {
                      const bodyParamId = e.target.value;

                      if (
                        selectedBodyParam &&
                        selectedBodyParam.id === bodyParamId
                      )
                        return;

                      selectedBodyParam = bodyParamsItems.find(
                        e => e.id === bodyParamId
                      );

                      props.onChange(bodyParamId);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {bodyParamsItems.map(e => {
                      return (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              },
            },
            {
              title: <FormattedMessage {...commonMessages.bodyValue} />,
              field: "bodyValue",
              render: rowData => {
                return rowData.bodyValue ? rowData.bodyValue.name : "";
              },
              editComponent: props => {
                const values = selectedBodyParam
                  ? selectedBodyParam.values
                  : [];

                return (
                  <Select
                    value={props.value || ""}
                    onChange={e => {
                      props.onChange(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {values.map(e => {
                      return (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              },
            },
          ]}
          data={employeeBodyParams}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                const bodyParamId = newData.bodyParam;
                const bodyValueId = newData.bodyValue;

                if (!bodyParamId || !bodyValueId) {
                  reject();
                  return;
                }

                const bodyParam = getBodyParamsItem(bodyParamId);

                if (
                  !bodyParam ||
                  !bodyParam.values.find(e => e.id === bodyValueId)
                ) {
                  reject();
                  return;
                }

                updateEmployee(id, {
                  $push: {
                    bodyParams: {
                      bodyParam: bodyParamId,
                      bodyValue: bodyValueId,
                    },
                  },
                });

                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                updateEmployee(id, {
                  $pull: {
                    bodyParams: {
                      bodyParam: oldData.bodyParam.id,
                      bodyValue: oldData.bodyValue.id,
                    },
                  },
                });

                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

export default storeItemsHOC(EntityPage);
