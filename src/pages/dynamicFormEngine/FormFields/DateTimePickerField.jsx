import { Box, Typography } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { useField } from "formik";
import { at } from "lodash";
const DateTimePickerField = (props) => {
  const { label, setFieldValue, name, disabled } = props;
  const [field, meta] = useField(name);
  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return error;
    } else {
      return " ";
    }
  }
  return (
    <>
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
          {label}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            onChange={(value) => {
              setFieldValue(
                name,
                dayjs(value).format("MM/DD/YYYY hh:mm"),
                true
              );
            }}
            value={dayjs(
              new Date(moment(field.value && field.value, "MM/DD/YYYY hh:mm"))
            )}
            disabled={disabled}
            referenceDate={dayjs("2022-04-17T15:30")}
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
    </>
  );
};

export default React.memo(DateTimePickerField);
