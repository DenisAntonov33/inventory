import React from "react";
import { Formik, Form } from "formik";
import { isEmpty } from "lodash";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";

import FormikInput from "../../components/FormikInput";

import Button from "@material-ui/core/Button";

export const Instance = props => {
  const { data, submitHandler } = props;

  if (isEmpty(data)) return <div>Loading...</div>;

  return (
    <div>
      <Formik
        initialValues={data}
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
            <FormikInput
              type="text"
              name="name"
              label={<FormattedMessage {...commonMessages.name} />}
            />
            <FormikInput
              type="text"
              name="fullName"
              label={<FormattedMessage {...commonMessages.fullName} />}
            />
            <FormikInput
              type="text"
              name="personalNumber"
              label={<FormattedMessage {...commonMessages.personalNumber} />}
            />
            <FormikInput
              type="text"
              name="area"
              label={<FormattedMessage {...commonMessages.area} />}
            />
            <Button type="submit" disabled={isSubmitting} variant="contained">
              <FormattedMessage {...commonMessages.update} />
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Instance;
