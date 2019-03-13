import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

export const SignupForm = props => (
  <div>
    <Formik
      initialValues={{ username: "", password: "", password1: "" }}
      validate={values => {
        let errors = {};
        if (!values.username) {
          errors.username = "Required";
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
          props.submitHandler(values);
        } catch (err) {
          console.log("err", err);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="username" name="username" />
          <ErrorMessage name="username" component="div" />
          <Field type="password" name="password" />
          <Field type="password" name="password1" />
          <ErrorMessage name="password" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);
