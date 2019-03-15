import React from "react";
import { Field } from "formik";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const FormikSelect = props => {
  const { nameProperty, items, name, label } = props;

  return (
    <div>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            <TextField {...field} name={name} label={label} select>
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

export default FormikSelect;
