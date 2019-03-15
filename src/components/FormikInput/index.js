import React from "react";
import { Field } from "formik";
import TextField from "@material-ui/core/TextField";

const FormikInput = props => {
  const { name, label, type } = props;

  return (
    <div className="form__input">
      <Field name={name}>
        {({ field, form }) => (
          <div>
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
    </div>
  );
};

export default FormikInput;
