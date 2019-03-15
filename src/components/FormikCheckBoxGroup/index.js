import React from "react";
import { FieldArray, ErrorMessage } from "formik";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const FormikCheckboxGropup = props => {
  const { label, nameProperty, name, items, values } = props;

  return (
    <div>
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <FormControl component="fieldset">
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

export default FormikCheckboxGropup;
