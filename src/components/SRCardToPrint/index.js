import React, { Component } from "react";

import Header from "./header";

class SRCardToPrint extends Component {
  render() {
    const { data } = this.props;
    if (!data) return;

    return (
      <div className="to-print">
        <table>
          <tbody>
            <Header />

            {data.length &&
              data.map(e => (
                <tr key={`${e.entity}${e.bodyValue}`}>
                  <td>1234567890</td>
                  <td>Алексенцев Е.Н.</td>
                  <td>{e.entity.name}</td>
                  <td>{e.bodyValue.name}</td>
                  <td>{e.nessesaryCount}</td>
                  <td />
                  <td />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SRCardToPrint;
