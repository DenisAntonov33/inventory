import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { actions, selectors } from "../../store/modules/entities";

const EmployeesAlias = ["employees"];
const EmployeesActions = actions[EmployeesAlias];
const EmployeesSelectors = selectors[EmployeesAlias];

const BodyParamsAlias = ["bodyParams"];
const BodyParamsActions = actions[BodyParamsAlias];
const BodyParamsSelectors = selectors[BodyParamsAlias];

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
      updateEmployee,
      bodyParamsIds,
      data,
    } = this.props;

    const employee = EmployeesSelectors.getItemById(id, data);
    const employeeBodyParams = employee
      ? employee.bodyParams.filter(e => !e.isDeleted)
      : [];

    const bodyParams = BodyParamsSelectors.getItems(bodyParamsIds, data);
    const filteredBodyParams = bodyParams.filter(e => !e.isDeleted);

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

                      selectedBodyParam = bodyParams.find(
                        e => e.id === bodyParamId
                      );

                      props.onChange(bodyParamId);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {filteredBodyParams.map(e => {
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

                const bodyParam = BodyParamsSelectors.getItemById(
                  bodyParamId,
                  data
                );

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

const mapStateToProps = ({ lists, data }) => ({
  data,
  bodyParamsIds: lists[BodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createEmployee: args => dispatch(EmployeesActions.create(args)),
  readEmployee: id => dispatch(EmployeesActions.readById(id)),
  updateEmployee: (id, args) => dispatch(EmployeesActions.updateById(id, args)),
  deleteEmployee: id => dispatch(EmployeesActions.deleteById(id)),

  readBodyParams: () => dispatch(BodyParamsActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
