import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

export const LoginForm = props => (
  <div>
    <Formik
      initialValues={{ username: "", password: "" }}
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
          props.submitHandler(values);
        } catch (err) {
          console.log("err", err);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="username" />
          <ErrorMessage name="username" component="div" />
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);
