import React, { Component } from "react";
import MaterialTable from "material-table";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

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
      storeItems,
      entitiesItems,
      getEntitiesItem,
      getBodyValuesItem,
    } = this.props;

    let selectedEntity = null;

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
          columns={[
            {
              title: <FormattedMessage {...commonMessages.entity} />,
              field: "entity",
              readonly: true,
              render: rowData => {
                if (!rowData.entity) return "";

                const entity =
                  typeof rowData.entity === "object"
                    ? rowData.entity
                    : getEntitiesItem(rowData.entity);

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

                      selectedEntity = getEntitiesItem(entityId);
                      props.onChange(entityId);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {entitiesItems.map(e => {
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
              title: <FormattedMessage {...commonMessages.certificateNumber} />,
              field: "certificate",
              readonly: true,
              render: rowData => rowData.entity.certificate,
            },
            {
              title: <FormattedMessage {...commonMessages.bodyValue} />,
              field: "bodyValue",
              readonly: true,
              render: rowData => {
                if (!rowData.bodyValue) return "";

                const bodyValue =
                  typeof rowData.bodyValue === "object"
                    ? rowData.bodyValue
                    : getBodyValuesItem(rowData.bodyValue);

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
              title: <FormattedMessage {...commonMessages.count} />,
              field: "count",
              type: "numeric",
            },
          ]}
          data={storeItems}
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

export default storeItemsHOC(EntityPage);
