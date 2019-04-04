import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const EntitiesList = props => {
  const { items, removeButton } = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right">Replacement Period</TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>
      <TableBody>
        {items &&
          items
            .filter(e => !e.isDeleted)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map(item => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="item">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.replacementPeriod}</TableCell>
                <TableCell align="right">
                  {removeButton && removeButton(item.id)}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default EntitiesList;
