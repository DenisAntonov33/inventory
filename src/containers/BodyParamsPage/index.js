import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../../utils/history";
import MaterialTable from "material-table";

import { actions, selectors } from "../../store/modules/entities";

const bodyParamsAlias = ["bodyParams"];
const bodyParamsActions = actions[bodyParamsAlias];
const bodyParamsSelectors = selectors[bodyParamsAlias];

class EntityPage extends Component {
  componentDidMount() {
    const { readBodyParams, bodyParamsIds, data } = this.props;

    const bodyParams = bodyParamsSelectors.getItems(bodyParamsIds, data);
    if (!bodyParams.length) readBodyParams();
  }

  render() {
    const {
      data,
      bodyParamsIds,
      createBodyParam,
      updateBodyParam,
      deleteBodyParam,
    } = this.props;

    const bodyParams = bodyParamsSelectors.getItems(bodyParamsIds, data);
    const filteredBodyParams = bodyParams.filter(e => !e.isDeleted);

    return (
      <div>
        <header>
          <h1>{bodyParamsAlias}</h1>
        </header>

        <MaterialTable
          title="Editable Example"
          columns={[
            { title: "Name", field: "name" },

            {
              title: "Body Values",
              field: "bodyValues",
              render: rowData => rowData.values.map(e => e.name).join(", "),
              editComponent: props => {
                const values = props.value || [];
                return values.map(e => e.name).join(", ");
              },
            },
          ]}
          data={filteredBodyParams}
          actions={[
            {
              icon: "link",
              tooltip: "Show User Info",
              onClick: (event, rowData) => {
                history.push(`/bodyparams/${rowData.id}`);
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
                const args = Object.keys(newData).reduce((acc, curr) => {
                  if (newData[curr] !== oldData[curr])
                    acc[curr] = newData[curr];
                  return acc;
                }, {});

                updateBodyParam(oldData.id, { $set: args });
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

const mapStateToProps = ({ lists, data }) => ({
  data,
  bodyParamsIds: lists[bodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createBodyParam: args => dispatch(bodyParamsActions.create(args)),
  readBodyParams: () => dispatch(bodyParamsActions.readMany()),
  readBodyParam: id => dispatch(bodyParamsActions.readById(id)),
  updateBodyParam: (id, args) =>
    dispatch(bodyParamsActions.updateById(id, args)),
  deleteBodyParam: id => dispatch(bodyParamsActions.deleteById(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
