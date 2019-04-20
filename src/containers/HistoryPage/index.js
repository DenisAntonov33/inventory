import React, { Component } from "react";
import { connect } from "react-redux";
import { DateTime } from "luxon";

import MaterialTable from "material-table";
import { pull } from "lodash";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import { actions, selectors } from "../../store/modules/entities";

const HistoryAlias = ["history"];
const HistoryActions = actions[HistoryAlias];
const HistorySelectors = selectors[HistoryAlias];

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

class EntityPage extends Component {
  componentDidMount() {
    const {
      readHistory,
      readEmployees,
      readPositions,
      readEntities,
      readBodyParams,

      historyIds,
      employeesIds,
      positionsIds,
      entitiesIds,
      bodyParamsIds,
    } = this.props;

    if (!historyIds.length) readHistory();
    if (!employeesIds.length) readEmployees();
    if (!positionsIds.length) readPositions();
    if (!entitiesIds.length) readEntities();
    if (!bodyParamsIds.length) readBodyParams();
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
      createHistoryItem,
      deleteHistoryItem,
      historyIds,
      employeesIds,
      data,
    } = this.props;

    const history = HistorySelectors.getItems(historyIds, data);
    const filteredHistory = history.filter(e => !e.isDeleted);

    const employees = EmployeesSelectors.getItems(employeesIds, data);
    const filteredEmployees = employees.filter(e => !e.isDeleted);

    let selectedEmployee = "";
    let selectedPositions = [];
    let selectedEntity = "";

    return (
      <div>
        <header className="page__header">
          <h1>{HistoryAlias}</h1>
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
              render: rowData =>
                DateTime.fromMillis(rowData.date).toFormat("dd.LL.yyyy"),
            },
            {
              title: "Employee",
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

                      selectedEmployee = employees.find(
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
                    {filteredEmployees.map(e => {
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
              title: "Positions",
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
              render: rowData => rowData.positions.join(", "),
            },
            {
              title: "Entity",
              field: "entity",
              readonly: true,
              editComponent: props => {
                console.log("selectedPositions", selectedPositions);
                if (!selectedPositions.length) return "-";

                const expandedPositions = selectedPositions.map(e => {
                  return PositionsSelectors.getItemById(e, data);
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

                      selectedEntity = EntitiesSelectors.getItemById(
                        entityId,
                        data
                      );
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
            },
            {
              title: "Body Value",
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
            },
          ]}
          data={filteredHistory}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createHistoryItem({
                  ...newData,
                  date: Date.parse(newData.date),
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

const mapStateToProps = ({ lists, data }) => ({
  data,
  historyIds: lists[HistoryAlias],
  employeesIds: lists[EmployeesAlias],
  entitiesIds: lists[EntitiesAlias],
  positionsIds: lists[PositionsAlias],
  bodyParamsIds: lists[BodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createHistoryItem: args => dispatch(HistoryActions.create(args)),
  readHistory: () => dispatch(HistoryActions.readMany()),
  deleteHistoryItem: id => dispatch(HistoryActions.deleteById(id)),

  readEmployees: () => dispatch(EmployeesActions.readMany()),
  readEntities: () => dispatch(EntitiesActions.readMany()),
  readPositions: () => dispatch(PositionsActions.readMany()),
  readBodyParams: () => dispatch(BodyParamsActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
