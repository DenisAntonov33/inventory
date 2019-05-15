import React, { Component } from "react";
import { DateTime } from "luxon";
import ReactToPrint from "react-to-print";
import { pull } from "lodash";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";
import PPECardToPrint from "../../components/PPECardToPrint";

import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

class EntityPage extends Component {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      readEmployee,
      readBodyParams,
      readHistory,
    } = this.props;

    readEmployee(id);
    readBodyParams();
    readHistory({ employee: id });
  }

  render() {
    const {
      match: {
        params: { id },
      },
      bodyParamsItems,

      updateEmployee,
      historyItems,

      getBodyParamsItem,
      getEmployeesItem,
      getPositionsItem,
      getEntitiesItem,

      createHistoryItem,
      deleteHistoryItem,
      employeesItems,
    } = this.props;

    const employee = getEmployeesItem(id);
    const employeeBodyParams = employee
      ? employee.bodyParams.filter(e => !e.isDeleted)
      : [];

    const employeeHistoryItems = historyItems.filter(e => e.employee.id === id);

    let selectedBodyParam = "";
    let selectedEmployee = "";
    let selectedPositions = [];
    let selectedEntity = "";

    return (
      <div>
        <header className="page__header">
          <h1>
            <FormattedMessage {...messages.pageTitle} /> -{" "}
            {employee && employee.name}
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

        <header className="page__header">
          <h1>
            <FormattedMessage {...messages.historyTitle} />
          </h1>

          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                <FormattedMessage {...commonMessages.printButton.label} />
              </Button>
            )}
            content={() => this.componentRef}
          />
        </header>

        <PPECardToPrint
          ref={el => (this.componentRef = el)}
          data={employeeHistoryItems}
        />

        <MaterialTable
          title=""
          localization={{
            body: {
              emptyDataSourceMessage: (
                <FormattedMessage {...commonMessages.emptyDataSourceMessage} />
              ),
            },
          }}
          columns={[
            {
              title: <FormattedMessage {...commonMessages.date} />,
              field: "date",
              type: "date",
              render: rowData =>
                DateTime.fromMillis(rowData.date).toFormat("dd.LL.yyyy"),
            },
            {
              title: <FormattedMessage {...commonMessages.employee} />,
              field: "employee",
              editComponent: props => {
                return (
                  <Select
                    value={props.value || ""}
                    onChange={e => {
                      const employeeId = e.target.value;

                      if (
                        selectedEmployee &&
                        selectedEmployee.id === employeeId
                      )
                        return;

                      selectedEmployee = employeesItems.find(
                        e => e.id === employeeId
                      );

                      selectedPositions = [];
                      selectedEntity = "";

                      props.onChange(employeeId);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {employeesItems.map(e => {
                      return (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              },
              render: rowData => rowData.employee.name,
            },
            {
              title: <FormattedMessage {...commonMessages.positions} />,
              field: "positions",
              editComponent: props => {
                if (!selectedEmployee) return "-";

                const isInitial =
                  props.value && typeof props.value[0] === "object";

                const selectedValues = isInitial
                  ? props.value.map(e => e.id)
                  : props.value || [];

                const availablePositions = selectedEmployee.positions;

                const filteredPositions = availablePositions.filter(
                  e => !e.isDeleted
                );

                return (
                  <FormControl component="fieldset">
                    <FormGroup>
                      {filteredPositions.map(e => {
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

                                  selectedPositions = selectedValues;
                                  selectedEntity = "";

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

              render: rowData => rowData.positions.map(e => e.name).join(", "),
            },
            {
              title: <FormattedMessage {...commonMessages.entity} />,
              field: "entity",
              readonly: true,
              editComponent: props => {
                console.log("selectedPositions", selectedPositions);
                if (!selectedPositions.length) return "-";

                const expandedPositions = selectedPositions.map(e => {
                  return getPositionsItem(e);
                });
                console.log("expandedPositions", expandedPositions);

                const filteredPositions = expandedPositions.filter(
                  e => !e.isDeleted
                );
                console.log("filteredPositions", filteredPositions);

                const availableEntities = filteredPositions.reduce(
                  (acc, curr) => {
                    return [...acc, ...curr.entities];
                  },
                  []
                );
                console.log("availableEntities", availableEntities);

                const filteredEntities = availableEntities.filter(
                  e => !e.isDeleted
                );

                return (
                  <Select
                    value={props.value || ""}
                    onChange={e => {
                      const entityId = e.target.value;

                      if (selectedEntity && selectedEntity.id === entityId)
                        return;

                      selectedEntity = getEntitiesItem(entityId);
                      props.onChange(entityId);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {filteredEntities.map(e => {
                      return (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              },
              render: rowData => rowData.entity.name,
            },
            {
              title: <FormattedMessage {...commonMessages.bodyValue} />,
              field: "bodyValue",
              readonly: true,
              editComponent: props => {
                if (!selectedEntity) return "-";

                const bodyParam = selectedEntity.bodyParam;
                if (!bodyParam) return "-";

                const availableBodyValues = bodyParam.values;
                const filteredBodyValues = availableBodyValues.filter(
                  e => !e.isDeleted
                );

                return (
                  <Select
                    value={props.value || ""}
                    onChange={e => {
                      const bodyValueId = e.target.value;
                      props.onChange(bodyValueId);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {filteredBodyValues.map(e => {
                      return (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              },
              render: rowData => rowData.bodyValue.name,
            },
            {
              title: <FormattedMessage {...commonMessages.count} />,
              field: "count",
              type: "numeric",
            },
          ]}
          data={employeeHistoryItems}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createHistoryItem({
                  ...newData,
                  date: Date.parse(newData.date),
                  count: +newData.count,
                });
                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                deleteHistoryItem(oldData.id);
                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

export default storeItemsHOC(EntityPage);
