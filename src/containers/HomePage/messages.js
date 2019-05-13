import { defineMessages } from "react-intl";

export const scope = "containers.HomePage";

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: "Home Page",
  },
  createRequisitionButton: {
    label: {
      id: `${scope}.createRequisitionButton.label`,
      defaultMessage: "Create Requisition",
    },
  },
});
