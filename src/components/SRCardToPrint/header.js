import React, { Fragment } from "react";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

export const header = () => (
  <Fragment>
    <tr>
      <th>
        <FormattedMessage {...commonMessages.personalNumber} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.fullName} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.title} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.bodyValue} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.nessesaryCount} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.sign} />
      </th>
      <th>
        <FormattedMessage {...commonMessages.actualCount} />
      </th>
    </tr>
  </Fragment>
);

export default header;
