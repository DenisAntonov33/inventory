import React, { Component } from "react";
import MaterialTable from "material-table";
import { pull } from "lodash";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import storeItemsHOC from "../StoreItemsHOC";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

class EntityPage extends Component {
  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const { readPositions, readEntities } = this.props;

    readPositions();
    readEntities();
  };

  render() {
    const {
      positionsItems,
      entitiesItems,
      createPosition,
      updatePosition,
      deletePosition,
    } = this.props;

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
              title: <FormattedMessage {...commonMessages.name} />,
              field: "name",
            },
            {
              title: <FormattedMessage {...commonMessages.entities} />,
              field: "entities",
              editComponent: props => {
                const isInitial =
                  props.value && typeof props.value[0] === "object";

                const selectedValues = isInitial
                  ? props.value.map(e => e.id)
                  : props.value || [];

                return (
                  <FormControl component="fieldset">
                    <FormGroup>
                      {entitiesItems.map(e => {
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
                return rowData.entities.map(e => (e ? e.name : "")).join(", ");
              },
            },
          ]}
          data={positionsItems}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                createPosition(newData);
                resolve();
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                const args = {
                  ...(newData.name !== oldData.name
                    ? { name: newData.name }
                    : {}),
                  ...{
                    entities: newData.entities.map(e =>
                      typeof e === "object" ? e.id : e
                    ),
                  },
                };

                updatePosition(oldData.id, { $set: args });
                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                deletePosition(oldData.id);
                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

export default storeItemsHOC(EntityPage);
