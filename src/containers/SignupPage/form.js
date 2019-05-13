import React from "react";
import { Formik, Form } from "formik";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

import FormikInput from "../../components/FormikInput";

import Button from "@material-ui/core/Button";

export const Instance = props => {
  const { submitHandler } = props;

  return (
    <div>
      <Formik
        initialValues={{ name: "", password: "", password1: "" }}
        validate={values => {
          let errors = {};
          if (!values.name) {
            // errors.name = (
            //   <FormattedMessage {...commonMessages.errors.required} />
            // );
          }
          if (!values.password) {
            // errors.password = (
            //   <FormattedMessage {...commonMessages.errors.required} />
            // );
          } else if (values.password !== values.password1) {
            // errors.password = (
            //   <FormattedMessage {...commonMessages.errors.samePassword} />
            // );
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(false);
            submitHandler(values);
          } catch (err) {
            console.log("err", err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormikInput
              type="text"
              name="name"
              label={<FormattedMessage {...commonMessages.name} />}
            />
            <FormikInput
              type="password"
              name="password"
              label={<FormattedMessage {...commonMessages.password} />}
            />
            <FormikInput
              type="password"
              name="password1"
              label={<FormattedMessage {...commonMessages.repeatPassword} />}
            />
            <Button type="submit" disabled={isSubmitting} variant="contained">
              <FormattedMessage {...commonMessages.signup} />
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Instance;
