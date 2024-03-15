import { TextField } from "@mui/material";

// Custom TextField component for Formik
const FormikField = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
}) => (
    <TextField
        {...field}
        {...props}
        error={Boolean(touched[field.name] && errors[field.name])}
        helperText={touched[field.name] && errors[field.name]}
    />
);

export default FormikField;