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
        certificate: item.certificate,
        date: DateTime.fromMillis(item.date).toFormat("dd.LL.yyyy"),
        wear: "100%",
      };
    };

    const convertedData = data.map(e => getMappedItem(e));

    return (
      <div className="to-print">
        <table>
          <tbody>
            <Header />

            {convertedData.length &&
              convertedData.map(e => (
                <tr className="table-row" key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.certificate}</td>
                  <td>{e.date}</td>
                  <td>{e.count}</td>
                  <td>{e.wear}</td>
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
