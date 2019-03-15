import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  }
});

const Instance = props => {
  const { classes, name, label } = props;

  return (
    <div>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            <TextField
              name={name}
              label={label}
              multiline
              rowsMax="4"
              className={classes.textField}
              margin="normal"
              variant="outlined"
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

Instance.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Instance);
