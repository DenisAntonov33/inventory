import React, { Component } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";

import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import { actions, selectors } from "../../store/modules/entities";

const StoreAlias = ["store"];
const StoreActions = actions[StoreAlias];
const StoreSelectors = selectors[StoreAlias];

const EntitiesAlias = ["entities"];
const EntitiesActions = actions[EntitiesAlias];
const EntitiesSelectors = selectors[EntitiesAlias];

const BodyParamsAlias = ["bodyParams"];
const BodyParamsActions = actions[BodyParamsAlias];

const BodyValuesAlias = ["bodyValues"];
const BodyValuesSelectors = selectors[BodyValuesAlias];

class EntityPage extends Component {
  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const { readStore, readEntities, readBodyParams } = this.props;

    readStore();
    readEntities();
    readBodyParams();
  };

  render() {
    const {
      createStoreItem,
      updateStoreItem,
      deleteStoreItem,

      storeIds,
      entitiesIds,
      data,
    } = this.props;

    const store = StoreSelectors.getItems(storeIds, data);
    const filteredStore = store.filter(e => !e.isDeleted);

    const entities = EntitiesSelectors.getItems(entitiesIds, data);
    const filteredEntities = entities.filter(e => !e.isDeleted);

    let selectedEntity = null;

    return (
      <div>
        <header className="page__header">
          <h1>{StoreAlias}</h1>
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
              title: "Entity",
              field: "entity",
              readonly: true,
              render: rowData => {
                if (!rowData.entity) return "";

                const entity =
                  typeof rowData.entity === "object"
                    ? rowData.entity
                    : EntitiesSelectors.getItemById(rowData.entity, data);

                if (!entity) return "";
                return entity.name;
              },
              editComponent: props => {
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
              render: rowData => {
                if (!rowData.bodyValue) return "";

                const bodyValue =
                  typeof rowData.bodyValue === "object"
                    ? rowData.bodyValue
                    : BodyValuesSelectors.getItemById(rowData.bodyValue, data);

                if (!bodyValue) return "";
                return bodyValue.name;
              },
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
            {
              title: "Count",
              field: "count",
              type: "numeric",
            },
          ]}
          data={filteredStore}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createStoreItem({ ...newData, count: +newData.count });
                resolve();
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                console.log(newData);

                updateStoreItem(oldData.id, {
                  $set: { count: +newData.count },
                });

                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                deleteStoreItem(oldData.id);
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
  storeIds: lists[StoreAlias],
  entitiesIds: lists[EntitiesAlias],
  bodyParamsIds: lists[BodyParamsAlias],
});

const mapDispatchToProps = dispatch => ({
  createStoreItem: args => dispatch(StoreActions.create(args)),
  readStore: () => dispatch(StoreActions.readMany()),
  updateStoreItem: (id, args) => dispatch(StoreActions.updateById(id, args)),
  deleteStoreItem: id => dispatch(StoreActions.deleteById(id)),

  readEntities: () => dispatch(EntitiesActions.readMany()),
  readBodyParams: () => dispatch(BodyParamsActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
