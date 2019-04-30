import React, { Component } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";

import Button from "@material-ui/core/Button";

import { actions, selectors } from "../../store/modules/entities";

const entitiesAlias = ["entities"];
const EntitiesActions = actions[entitiesAlias];
const EntitiesSelectors = selectors[entitiesAlias];

const bodyParamsAlias = ["bodyParams"];
const bodyParamsActions = actions[bodyParamsAlias];

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
      entitiesIds,
      data,
      createEntity,
      updateEntity,
      deleteEntity,
    } = this.props;

    const entities = EntitiesSelectors.getItems(entitiesIds, data);
    const filteredEntities = entities.filter(e => !e.isDeleted);

    const bodyParams = data[bodyParamsAlias];
    const formattedBodyParams = Object.keys(bodyParams).reduce((acc, curr) => {
      acc[curr] = bodyParams[curr].name;
      return acc;
    }, {});

    return (
      <div>
        <header className="page__header">
          <h1>{entitiesAlias}</h1>
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
            { title: "Name", field: "name" },
            {
              title: "Replacement period",
              field: "replacementPeriod",
              type: "numeric",
            },
            {
              title: "Body param",
              field: "bodyParam",
              lookup: formattedBodyParams,
              render: rowData =>
                rowData.bodyParam ? rowData.bodyParam.name : "",
            },
          ]}
          data={filteredEntities}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createEntity({
                  ...newData,
                  replacementPeriod: +newData.replacementPeriod,
                  bodyParam: newData.bodyParam.id,
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

const mapStateToProps = ({ lists, data }) => ({
  data,
  entitiesIds: lists[entitiesAlias],
  bodyParamsIds: lists[bodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createEntity: args => dispatch(EntitiesActions.create(args)),
  readEntities: () => dispatch(EntitiesActions.readMany()),
  readEntity: id => dispatch(EntitiesActions.readById(id)),
  updateEntity: (id, args) => dispatch(EntitiesActions.updateById(id, args)),
  deleteEntity: id => dispatch(EntitiesActions.deleteById(id)),

  readBodyParams: () => dispatch(bodyParamsActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
