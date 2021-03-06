import { defineMessages } from "react-intl";

export const scope = "app";

export default defineMessages({
  applicationTitle: {
    id: `${scope}.applicationTitle`,
    defaultMessage: "PRO PPE",
  },

  /* Buttons */
  refreshButton: {
    label: { id: `${scope}.refreshButton.label`, defaultMessage: "Refresh" },
  },
  printButton: {
    label: { id: `${scope}.printButton.label`, defaultMessage: "Print" },
  },

  /* Common words */
  actions: { id: `${scope}.actions`, defaultMessage: "Actions" },
  actualCount: { id: `${scope}.actualCount`, defaultMessage: "Actual Count" },
  approve: { id: `${scope}.approve`, defaultMessage: "Approve" },
  certificateNumber: {
    id: `${scope}.certificateNumber`,
    defaultMessage: "certificateNumber",
  },
  count: { id: `${scope}.count`, defaultMessage: "Count" },
  date: { id: `${scope}.date`, defaultMessage: "Date" },
  emptyDataSourceMessage: {
    id: `${scope}.emptyDataSourceMessage`,
    defaultMessage: "Empty data source",
  },
  fullName: { id: `${scope}.fullName`, defaultMessage: "Full Name" },
  home: { id: `${scope}.home`, defaultMessage: "Home" },
  issuedBy: { id: `${scope}.issuedBy`, defaultMessage: "Issued By" },
  name: { id: `${scope}.name`, defaultMessage: "Name" },
  nessesaryCount: {
    id: `${scope}.nessesaryCount`,
    defaultMessage: "Nessesary Count",
  },
  PPEAcceptedSign: { id: `${scope}.PPEGetSign`, defaultMessage: "PPEGetSign" },
  PPEGetSign: { id: `${scope}.PPEGetSign`, defaultMessage: "PPEGetSign" },
  PPEPassedSign: { id: `${scope}.PPEGetSign`, defaultMessage: "PPEGetSign" },
  PPEName: {
    id: `${scope}.PPEName`,
    defaultMessage: "PPE Name",
  },
  returned: { id: `${scope}.returned`, defaultMessage: "Returned" },
  password: { id: `${scope}.password`, defaultMessage: "Password" },
  personalNumber: {
    id: `${scope}.personalNumber`,
    defaultMessage: "Personal Number",
  },
  profile: { id: `${scope}.profile`, defaultMessage: "Profile" },
  repeatPassword: {
    id: `${scope}.repeatPassword`,
    defaultMessage: "Repeat password",
  },
  replacementPeriod: {
    id: `${scope}.replacementPeriod`,
    defaultMessage: "replacementPeriod",
  },
  sign: { id: `${scope}.sign`, defaultMessage: "Sign" },
  title: { id: `${scope}.title`, defaultMessage: "Название" },
  wear: { id: `${scope}.wear`, defaultMessage: "wear" },

  loginTitle: { id: `${scope}.loginTitle`, defaultMessage: "Login" },
  signupTitle: { id: `${scope}.signupTitle`, defaultMessage: "Signup" },
  signup: { id: `${scope}.signup`, defaultMessage: "Зарегистрироваться" },
  login: { id: `${scope}.login`, defaultMessage: "Войти" },

  /* Items */
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

  /* Errors */
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
