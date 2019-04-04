import React from "react";

import Paper from "@material-ui/core/Paper";

import BodyParamsList from "./lists/BodyParams";
import EntitiesList from "./lists/Entities";

const Lists = {
  bodyParams: BodyParamsList,
  entities: EntitiesList,
  positions: "",
  employees: "",
  history: "",
};

export const EntityList = props => {
  const { alias, items, removeHandler } = props;
  const List = Lists[alias];

  const removeButton = id => (
    <span
      onClick={e => {
        e.preventDefault();
        removeHandler(id);
      }}
    >
      x
    </span>
  );

  return (
    <Paper>
      <List items={items} removeButton={removeButton} />
    </Paper>
  );
};

export default EntityList;
