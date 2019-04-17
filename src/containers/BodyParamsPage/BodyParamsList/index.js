import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import RemoveButton from "../../../components/RemoveButton";
import UpdateButton from "../../../components/UpdateButton";

export const BodyParamsList = props => {
  const { items, updateHandler, removeHandler } = props;

  const _updateHandler = (e, id) => {
    e.stopPropagation();
    updateHandler(id, id);
  };

  const _removeHandler = (e, id) => {
    e.stopPropagation();
    removeHandler(id);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>
      <TableBody>
        {items &&
          items
            .filter(e => !e.isDeleted)
            .map(item => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="item">
                  {item.name}
                </TableCell>
                <TableCell align="right">
                  {updateHandler && (
                    <span onClick={e => _updateHandler(e, item.id)}>
                      <UpdateButton />
                    </span>
                  )}
                  {removeHandler && (
                    <span onClick={e => _removeHandler(e, item.id)}>
                      <RemoveButton />
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default BodyParamsList;
