import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

const FormikSelect = props => {
  const { classes, nameProperty, items, name, label } = props;

  return (
    <div>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            <TextField
              {...field}
              name={name}
              label={label}
              select
              className={classes.textField}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {items.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item[nameProperty]}
                </MenuItem>
              ))}
            </TextField>

            {form.touched[field.name] && form.errors[field.name] && (
              <div className="error">{form.errors[field.name]}</div>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

FormikSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormikSelect);
