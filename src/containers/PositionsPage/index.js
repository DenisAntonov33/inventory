import React, { Component } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import { pull } from "lodash";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { actions, selectors } from "../../store/modules/entities";

const PositionsAlias = ["positions"];
const PositionsActions = actions[PositionsAlias];
const PositionsSelectors = selectors[PositionsAlias];

const EntitiesAlias = ["entities"];
const EntitiesActions = actions[EntitiesAlias];
const EntitiesSelectors = selectors[EntitiesAlias];

class EntityPage extends Component {
  componentDidMount() {
    const {
      readPositions,
      readEntities,
      positionsIds,
      entitiesIds,
      data,
    } = this.props;

    const positions = PositionsSelectors.getItems(positionsIds, data);
    if (!positions.length) readPositions();

    const entities = EntitiesSelectors.getItems(entitiesIds, data);
    if (!entities.length) readEntities();
  }

  render() {
    const {
      data,
      positionsIds,
      entitiesIds,
      createPosition,
      updatePosition,
      deletePosition,
    } = this.props;

    const positions = PositionsSelectors.getItems(positionsIds, data);
    const filteredPositions = positions.filter(e => !e.isDeleted);

    const entities = EntitiesSelectors.getItems(entitiesIds, data);
    const filteredEntities = entities.filter(e => !e.isDeleted);

    return (
      <div>
        <header>
          <h1>{PositionsAlias}</h1>
        </header>

        <MaterialTable
          title="Editable Example"
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Entities",
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
                      {filteredEntities.map(e => {
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
                return rowData.entities.map(e => e.name).join(", ");
              },
            },
          ]}
          data={filteredPositions}
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
                  ...{ entities: newData.entities },
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

const mapStateToProps = ({ lists, data }) => ({
  data,
  positionsIds: lists[PositionsAlias],
  entitiesIds: lists[EntitiesAlias],
});

const mapDispatchToProps = dispatch => ({
  createPosition: args => dispatch(PositionsActions.create(args)),
  readPositions: () => dispatch(PositionsActions.readMany()),
  updatePosition: (id, args) => dispatch(PositionsActions.updateById(id, args)),
  deletePosition: id => dispatch(PositionsActions.deleteById(id)),

  readEntities: () => dispatch(EntitiesActions.readMany()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
