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
        initialValues={{ name: "", password: "" }}
        validate={values => {
          let errors = {};
          if (!values.name) {
            errors.name = (
              <FormattedMessage {...commonMessages.errors.required} />
            );
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
          <Form className="form form--column">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              color="primary"
            >
              <FormattedMessage {...commonMessages.login} />
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Instance;
