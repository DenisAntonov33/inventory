import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

const FormikInput = props => {
  const { classes, name, label, type } = props;

  return (
    <div>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            <TextField
              id="standard-name"
              name={name}
              label={label}
              type={type}
              className={classes.textField}
              margin="normal"
              {...field}
            />
            {form.touched[field.name] && form.errors[field.name] && (
              <div className="error">{form.errors[field.name]}</div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

FormikInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormikInput);
