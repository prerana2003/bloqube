import { TextField } from "@mui/material";
import { getIn } from "formik";
import { forwardRef, useEffect } from "react";

const phoneInput = ({ touched, errors, name, ...props }, ref) => {
  return (
    <TextField
      {...props}
      inputRef={ref}
      fullWidth
      label={props?.label}
      error={Boolean(getIn(touched, name) && getIn(errors, name))}
      helperText={getIn(touched, name) && getIn(errors, name)}
    />
  );
};
export default forwardRef(phoneInput);
