import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { useField } from "formik";
import { at } from "lodash";

const TimePickerField = (props) => {
  const { label, setFieldValue, name,disabled } = props;
  const [field, meta] = useField(name);
  const theme = useTheme()
  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return error;
    } else {
      return " ";
    }
  }
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{ color: "#5b5b5b", fontWeight: "medium" }}
        variant="subtitle1"
        gutterBottom
      >
        {label}{label && props.required && <span style={{ color: 'red',fontSize:18 }}>*</span>}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={(value) => {
            setFieldValue(name, dayjs(value).format("HH:mm aa"), true);
          }}
          disabled={disabled}
          value={dayjs(new Date(moment(field.value && field.value, "hh:mm aa")))}
          sx={{svg: { color:disabled?'#bdbdbd': theme.palette.primary.light },}}
          slotProps={{
            textField: {
              error: meta.touched && meta.error && true,
              helperText: _renderHelperText(),
              name: name,
              variant: "outlined",
              fullWidth: true,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default TimePickerField;
