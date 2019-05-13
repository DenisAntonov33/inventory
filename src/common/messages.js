import { defineMessages } from "react-intl";

export const scope = "app";

export default defineMessages({
  title: { id: `${scope}.title`, defaultMessage: "Inventory App" },
  refreshButton: {
    label: { id: `${scope}.refreshButton.label`, defaultMessage: "Refresh" },
  },

  actions: { id: `${scope}.actions`, defaultMessage: "Actions" },
  emptyDataSourceMessage: {
    id: `${scope}.emptyDataSourceMessage`,
    defaultMessage: "Empty data source",
  },
  date: { id: `${scope}.date`, defaultMessage: "Date" },
  name: { id: `${scope}.name`, defaultMessage: "Name" },
  password: { id: `${scope}.password`, defaultMessage: "Password" },
  repeatPassword: {
    id: `${scope}.repeatPassword`,
    defaultMessage: "Repeat password",
  },
  count: { id: `${scope}.count`, defaultMessage: "Count" },
  replacementPeriod: {
    id: `${scope}.replacementPeriod`,
    defaultMessage: "replacementPeriod",
  },

  home: { id: `${scope}.home`, defaultMessage: "Home" },
  profile: { id: `${scope}.profile`, defaultMessage: "Profile" },

  loginTitle: { id: `${scope}.loginTitle`, defaultMessage: "Login" },
  signupTitle: { id: `${scope}.signupTitle`, defaultMessage: "Signup" },
  signup: { id: `${scope}.signup`, defaultMessage: "Зарегистрироваться" },
  login: { id: `${scope}.login`, defaultMessage: "Войти" },

  bodyValue: { id: `${scope}.bodyValue`, defaultMessage: "bodyValue" },
  bodyValues: { id: `${scope}.bodyValues`, defaultMessage: "bodyValues" },
  bodyParam: { id: `${scope}.bodyParam`, defaultMessage: "bodyParam" },
  bodyParams: { id: `${scope}.bodyParams`, defaultMessage: "bodyParams" },
  entity: { id: `${scope}.entity`, defaultMessage: "entity" },
  entities: { id: `${scope}.entities`, defaultMessage: "entities" },
  position: { id: `${scope}.position`, defaultMessage: "position" },
  positions: { id: `${scope}.positions`, defaultMessage: "positions" },
  employee: { id: `${scope}.employee`, defaultMessage: "employee" },
  employees: { id: `${scope}.employees`, defaultMessage: "employees" },
  history: { id: `${scope}.history`, defaultMessage: "History" },
  store: { id: `${scope}.store`, defaultMessage: "Store" },

  errors: {
    required: {
      id: `${scope}.errors.required`,
      defaultMessage: "Required",
    },
    samePassword: {
      id: `${scope}.errors.samePassword`,
      defaultMessage: "Passswords should be the same",
    },
  },
});
