import { defineMessages } from "react-intl";

export const scope = "containers.EmployeesPage";

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: "Employees Page",
  },
  openActionTooltip: {
    id: `${scope}.openActionTooltip`,
    defaultMessage: "Open employee",
  },
});
