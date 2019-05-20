import React, { Component } from "react";

import Header from "./header";

class SRCardToPrint extends Component {
  render() {
    const { data, user } = this.props;

    return (
      <div className="to-print">
        <table>
          <tbody>
            <Header />

            {data.length &&
              data.map(e => (
                <tr key={`${e.entity}${e.bodyValue}`}>
                  <td>{user.personalNumber}</td>
                  <td>{user.fullName}</td>
                  <td>{e.entity.name}</td>
                  <td>{e.bodyValue ? e.bodyValue.name : ""}</td>
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
