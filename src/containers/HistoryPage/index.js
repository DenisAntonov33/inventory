import React, { Component } from "react";
import { DateTime } from "luxon";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import MaterialTable from "material-table";
import { pull } from "lodash";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

class EntityPage extends Component {
  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const {
      readHistory,
      readEmployees,
      readPositions,
      readEntities,
      readBodyParams,
    } = this.props;

    readHistory();
    readEmployees();
    readPositions();
    readEntities();
    readBodyParams();
  };

  render() {
    const {
      getBodyValuesItem,
      getEmployeesItem,
      getPositionsItem,
      getEntitiesItem,

      createHistoryItem,
      deleteHistoryItem,
      historyItems,
      employeesItems,
    } = this.props;

    let selectedEmployee = "";
    let selectedPositions = [];
    let selectedEntity = "";

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
              render: rowData => getEmployeesItem(rowData.employee).name,
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

              render: rowData =>
                rowData.positions.map(e => getPositionsItem(e).name).join(", "),
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
              render: rowData => getEntitiesItem(rowData.entity).name,
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
              render: rowData => getBodyValuesItem(rowData.bodyValue).name,
            },
            {
              title: <FormattedMessage {...commonMessages.count} />,
              field: "count",
              type: "numeric",
            },
          ]}
          data={historyItems}
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
