import React from "react";
import { Field } from "formik";
import TextField from "@material-ui/core/TextField";

const FormikInput = props => {
  const { className, name, label, type } = props;

  return (
    <Field name={name}>
      {({ field, form }) => (
        <div className={className}>
          <TextField
            id="standard-name"
            name={name}
            label={label}
            type={type}
            margin="normal"
            {...field}
          />
          <div className="form__error">
            {form.touched[field.name] && form.errors[field.name] && (
              <span>{form.errors[field.name]}</span>
            )}
          </div>
        </div>
      )}
    </Field>
  );
};

export default FormikInput;
