import React from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import FormikInput from "../FormikInput";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

export const Instance = props => {
  const { classes, submitHandler } = props;

  return (
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
            submitHandler(values);
          } catch (err) {
            console.log("err", err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormikInput type="text" name="username" label="Username" />
            <FormikInput type="password" name="password" label="Password" />
            <FormikInput
              type="password"
              name="password1"
              label="Repeat password"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

Instance.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Instance);
