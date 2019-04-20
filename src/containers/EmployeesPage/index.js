import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../../utils/history";
import MaterialTable from "material-table";
import { pull } from "lodash";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { actions, selectors } from "../../store/modules/entities";

const EmployeesAlias = ["employees"];
const EmployeesActions = actions[EmployeesAlias];
const EmployeesSelectors = selectors[EmployeesAlias];

const PositionsAlias = ["positions"];
const PositionsActions = actions[PositionsAlias];
const PositionsSelectors = selectors[PositionsAlias];

const BodyParamsAlias = ["bodyParams"];
const BodyParamsActions = actions[BodyParamsAlias];

class EntityPage extends Component {
  componentDidMount() {
    const {
      readEmployees,
      readPositions,
      readBodyParams,
      employeesIds,
      positionsIds,
      bodyParamsIds,
      data,
    } = this.props;

    const employees = EmployeesSelectors.getItems(employeesIds, data);
    if (!employees.length) readEmployees();

    const positions = PositionsSelectors.getItems(positionsIds, data);
    if (!positions.length) readPositions();

    const bodyParams = PositionsSelectors.getItems(bodyParamsIds, data);
    if (!bodyParams.length) readBodyParams();
  }

  render() {
    const {
      createEmployee,
      updateEmployee,
      deleteEmployee,
      employeesIds,
      positionsIds,
      data,
    } = this.props;

    const employees = EmployeesSelectors.getItems(employeesIds, data);
    const filteredEmployees = employees.filter(e => !e.isDeleted);

    const positions = PositionsSelectors.getItems(positionsIds, data);
    const filteredPositions = positions.filter(e => !e.isDeleted);

    return (
      <div>
        <header>
          <h1>{EmployeesAlias}</h1>
        </header>

        <MaterialTable
          title="Editable Example"
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Positions",
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
              title: "Body Params",
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
          data={filteredEmployees}
          actions={[
            {
              icon: "open_in_new",
              tooltip: "Show Employee Info",
              onClick: (event, rowData) => {
                history.push(`/employees/${rowData.id}`);
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

const mapStateToProps = ({ lists, data }) => ({
  data,
  employeesIds: lists[EmployeesAlias],
  positionsIds: lists[PositionsAlias],
  bodyParamsIds: lists[BodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createEmployee: args => dispatch(EmployeesActions.create(args)),
  readEmployees: () => dispatch(EmployeesActions.readMany()),
  updateEmployee: (id, args) => dispatch(EmployeesActions.updateById(id, args)),
  deleteEmployee: id => dispatch(EmployeesActions.deleteById(id)),

  readPositions: () => dispatch(PositionsActions.readMany()),
  readBodyParams: () => dispatch(BodyParamsActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
