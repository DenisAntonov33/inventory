import React, { Component } from "react";
import { DateTime } from "luxon";

import Header from "./header";

class PPECardToPrint extends Component {
  render() {
    const { data } = this.props;

    const getMappedItem = item => {
      return {
        id: item.id,
        name: item.entity.name,
        count: item.count,
        date: DateTime.fromMillis(item.date).toFormat("dd.LL.yyyy"),
        wear: "100%",
      };
    };

    const convertedData = data
      .sort((a, b) => {
        return a.entity.id === b.entity.id
          ? a.date > b.date
          : a.entity.id > b.entity.id;
      })
      .map((curr, index, arr) => {
        const item = getMappedItem(curr);
        if (index === arr.length - 1) return item;

        const nextItem = arr[index + 1];
        if (curr.entity.id !== nextItem.entity.id) return item;

        return {
          ...item,
          returned: {
            ...getMappedItem(nextItem),
          },
        };
      });

    return (
      <div className="to-print">
        <table>
          <tbody>
            <Header />

            {convertedData.length &&
              convertedData.map(e => (
                <tr className="table-row" key={e.id}>
                  <td>{e.name}</td>
                  <td> </td>
                  <td>{e.date}</td>
                  <td>{e.count}</td>
                  <td>{e.wear}</td>
                  <td> </td>
                  <td>{e.returned && e.returned.date}</td>
                  <td>{e.returned && e.returned.count}</td>
                  <td>{e.returned && e.returned.wear}</td>
                  <td> </td>
                  <td> </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PPECardToPrint;
