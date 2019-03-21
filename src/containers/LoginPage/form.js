import React from "react";
import { Formik, Form } from "formik";

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
            errors.name = "Required";
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
            <FormikInput type="text" name="name" label="Name" />
            <FormikInput type="password" name="password" label="Password" />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Instance;
