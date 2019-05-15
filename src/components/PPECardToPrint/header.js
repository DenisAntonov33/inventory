import React, { Fragment } from "react";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

export const header = () => (
  <Fragment>
    <tr>
      <th rowSpan="2">
        <FormattedMessage {...commonMessages.PPEName} />
      </th>
      <th rowSpan="2">
        <FormattedMessage {...commonMessages.certificateNumber} />
      </th>
      <th colSpan="4">
        <FormattedMessage {...commonMessages.issuedBy} />
      </th>
      <th colSpan="5">
        <FormattedMessage {...commonMessages.returned} />
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
        <FormattedMessage {...commonMessages.wear} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.PPEGetSign} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.date} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.count} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.wear} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.PPEPassedSign} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.PPEAcceptedSign} />
      </th>
    </tr>
  </Fragment>
);

export default header;
