import React from "react";
import PhoneInput from "react-phone-number-input";
import { useField } from "formik";
import { at } from "lodash";
import { Box, FormHelperText, Typography } from "@mui/material";
import CustomPhoneInput from "./CustomPhoneInput";

const PhoneInputField = ({ setFieldValue, required, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const [touched, error] = at(meta, "touched", "error");
  const isError = touched && error && true;

  const handleChange = (newValue) => {
    setFieldValue(props.name, newValue);
  };

  return (
    <>
      <Box
        sx={{
          height: props.justifycontent ? "auto" : "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: props.justifycontent ? "start" : "space-between",
        }}
      >
        <Typography
          sx={{ color: "#5b5b5b", fontWeight: "medium" }}
          variant="subtitle1"
          gutterBottom
        >
          {props.label}
          {props.label && required && (
            <span style={{ color: "red", fontSize: 18 }}>*</span>
          )}
        </Typography>
        <PhoneInput
          {...props}
          {...field}
          placeholder={props.placeholder}
          value={field.value}
          defaultCountry="IN"
          onChange={(value) => {
            handleChange(value);
          }}
          inputComponent={CustomPhoneInput}
        />
        {!isError&& <FormHelperText> </FormHelperText>}
      </Box>
    </>
  );
};

export default React.memo(PhoneInputField);
