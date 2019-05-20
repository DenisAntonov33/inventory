import React, { Fragment } from "react";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

export const header = () => (
  <Fragment>
    <tr>
      <th rowSpan="2">
        <FormattedMessage {...commonMessages.WNAType} />
      </th>
      <th rowSpan="2">
        <FormattedMessage {...commonMessages.certificateNumber} />
      </th>
      <th colSpan="4">
        <FormattedMessage {...commonMessages.issuedBy} />
      </th>
    </tr>
    <tr>
      <th>
        <FormattedMessage {...commonMessages.date} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.count} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.issueMethod} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.WNAGetSign} />
      </th>
    </tr>
  </Fragment>
);

export default header;
