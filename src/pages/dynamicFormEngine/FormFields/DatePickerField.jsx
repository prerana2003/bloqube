import React, { useEffect, useState } from 'react'
import { Box, Typography, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from "dayjs";
import moment from "moment";
import { getIn, useField, useFormikContext } from "formik";
import { at } from "lodash";
import { DatePicker } from "@mui/x-date-pickers";
import { useSelector } from 'react-redux';

const DatePickerField = (props) => {
  const { label, setFieldValue, name, fieldKey, valueKey, disableFutureDates = false } = props;
  const theme = useTheme()
  const { values } = useFormikContext();
  const [disabled, setDisabled] = useState(false)
  const subject = useSelector((state) => state.subject)
  const [field, meta] = useField(name);
  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return error;
    } else {
      return " ";
    }
  }
  
  useEffect(() => {
    if (props.disabled) {
      setDisabled(true)
    }
  }, [props.disabled])
  
  useEffect(() => {
    (async () => {
      if (fieldKey) {
        switch (fieldKey) {
          case "dateOfBirth":
            let value = valueKey ? getIn(subject?.answers, valueKey) : dayjs(new Date(moment(field.value && field.value, "MM/DD/YYYY")));
            if (value) {
              setFieldValue(name, dayjs(value).format("MM/DD/YYYY"), true)
            }
            break;
          default: break;
        }
      }
    })()
  }, [values])
  return (
    <>
      <Box
        sx={{
          height: props.justifycontent ? 'auto' : '100%',
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
          {label}{label && props.required && <span style={{ color: 'red',fontSize:18 }}>*</span>}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={(value) =>
              setFieldValue(name, dayjs(value).format("MM/DD/YYYY"), true)
            }
            value={dayjs(
              new Date(moment(field.value && field.value, "MM/DD/YYYY"))
            )}
            disabled={disabled}
            disableFuture={disableFutureDates}
            slots={{
              openPickerIcon: CalendarMonthIcon
            }}
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
    </>
  );
};

export default React.memo(DatePickerField);
