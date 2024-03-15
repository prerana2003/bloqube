import { FormHelperText, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DateTimeField = ({ label, field, form,disabled ,...other }) => {
  const currentError = form.errors[field.name];
  const touched = form.touched[field.name];
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          disablePast
          sx={{
            width: "100%",
          }}
          clearable
          ampm={false}
          //fullWidth
          disabled={disabled}
          name={field.name}
          value={field.value}
          label={label}
          onChange={(value) => {
            form.setFieldValue(field.name, value);
          }}
          error={touched && Boolean(currentError)}
          slotProps={{
            textField: {
              error: touched && currentError && true,
              helperText: touched && currentError && currentError,
              name: field.name,
            },
          }}
        />
      </LocalizationProvider>
    );
};

export default DateTimeField;