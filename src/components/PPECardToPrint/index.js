import React, { Component } from "react";
import { DateTime } from "luxon";

import Header from "./header";

class PPECardToPrint extends Component {
  render() {
    const { data } = this.props;
    console.log(data);
    if (!data) return;

    return (
      <div className="to-print">
        <table>
          <tbody>
            <Header />

            {data.length &&
              data.map(e => (
                <tr className="row" key={e.id}>
                  <td>{e.entity.name}</td>
                  <td> </td>
                  <td>{DateTime.fromMillis(e.date).toFormat("dd.LL.yyyy")}</td>
                  <td>{e.count}</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
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
