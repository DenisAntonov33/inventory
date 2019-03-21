import React from "react";
import { Formik, Form } from "formik";

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
            errors.name = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          } else if (values.password !== values.password1) {
            errors.password = "Passwords should be the same";
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
            <FormikInput type="text" name="name" label="Name" />
            <FormikInput type="password" name="password" label="Password" />
            <FormikInput
              type="password"
              name="password1"
              label="Repeat password"
            />
            <Button type="submit" disabled={isSubmitting} variant="contained">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Instance;
