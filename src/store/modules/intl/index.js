import { addLocaleData } from "react-intl";
import { updateIntl } from "react-intl-redux";

import ruLocaleData from "react-intl/locale-data/ru";
import ruMessages from "../../../translations/ru";

addLocaleData([...ruLocaleData]);

const locales = {
  en: {},
  ru: ruMessages,
};

const LOCAL_STORAGE_LOCALE_KEY = "inventory-locale";

export const updateLocaleFromLocalStorage = () => {
  const locale = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) || "en";

  return updateIntl({ locale, messages: locales[locale] });
};

export const updateLocale = ({ locale, messages }) => {
  localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, locale);
  return updateIntl({ locale, messages });
};

const UPDATE_LOCALES = "UPDATE_LOCALES";
export const updateLocales = messages => ({
  type: UPDATE_LOCALES,
  payload: { messages },
});

export const reducer = (state = { ...locales }, action) => {
  switch (action.type) {
    case UPDATE_LOCALES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
