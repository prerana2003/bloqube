import { TextField, Typography, useTheme } from "@mui/material";
import { Formik, Field, FieldAttributes, useField } from "formik";
import { getIn } from "formik";

const TextFieldContainer = (props) => {
  const theme = useTheme();
  // const [field, meta] = useField(props);
  const { formik, name, type, label, placeholder, inputProps } = props;
  return (
    // <Field
    //   name={name}
    //   render={({ field, form }) => {
    //     return (
    <>
      <Typography
        variant="subtitle1"
        color={theme.palette.text.secondary}
        sx={{ pb: 0.5 }}
      >
        {label}
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        type={type ? type : "text"}
        name={name}
        value={getIn(formik.values, name)}
        onChange={formik.handleChange}
        placeholder={placeholder}
        fullWidth
        onBlur={formik.handleBlur}
        error={
          getIn(formik.touched, name) && Boolean(getIn(formik.errors, name))
        }
        helperText={getIn(formik.touched, name) && getIn(formik.errors, name)}
        sx={{
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        }}
      />
    </>
    //     );
    //   }}
    // ></Field>
  );
};

export default TextFieldContainer;
