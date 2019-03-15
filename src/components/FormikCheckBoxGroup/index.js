import React from "react";
import PropTypes from "prop-types";
import { FieldArray, ErrorMessage } from "formik";
import { withStyles } from "@material-ui/core/styles";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit * 3
  }
});

const FormikCheckboxGropup = props => {
  const { classes, label, nameProperty, name, items, values } = props;

  return (
    <div>
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup>
              {items
                .filter(e => !e.isDeleted)
                .map(item => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        name={`${name}Ids`}
                        checked={values.includes(item.id)}
                        onChange={e => {
                          if (e.target.checked) arrayHelpers.push(item.id);
                          else {
                            const idx = values.indexOf(item.id);
                            arrayHelpers.remove(idx);
                          }
                        }}
                        value={item.id}
                      />
                    }
                    label={item[nameProperty]}
                  />
                ))}
            </FormGroup>
            <FormHelperText>Be careful</FormHelperText>
          </FormControl>
        )}
      />
      <ErrorMessage name={name} component="div" />
    </div>
  );
};

FormikCheckboxGropup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormikCheckboxGropup);
