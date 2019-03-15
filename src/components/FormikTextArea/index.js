import React from "react";
import { Field } from "formik";
import TextField from "@material-ui/core/TextField";

const Instance = props => {
  const { name, label } = props;

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

export default Instance;
