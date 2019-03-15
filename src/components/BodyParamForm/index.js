import React from "react";
import { Formik, Form } from "formik";

import FormikInput from "../FormikInput";

import Button from "@material-ui/core/Button";

export const Instance = props => {
  const { submitHandler } = props;

  return (
    <div>
      <Formik
        initialValues={{ name: "" }}
        validate={values => {
          let errors = {};
          if (!values.username) {
            errors.username = "Required";
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
          <Form className="form form--row">
            <FormikInput type="text" name="name" label="Name" />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Instance;
