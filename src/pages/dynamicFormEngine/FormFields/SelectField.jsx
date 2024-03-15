import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { getIn, useField, useFormikContext } from 'formik';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

function SelectField(props) {
  const { label, data, fieldKey,valueKey, ...rest } = props;
  const [field, meta, helpers] = useField(props);
  const { values } = useFormikContext();
  const subject = useSelector((state) => state.subject)
  const { value: selectedValue } = field;
  const [touched, error] = at(meta, 'touched', 'error');
  const isError = touched && error && true;
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    if (props.disabled) {
      setDisabled(true)
    }
  },[props.disabled])
  useEffect(() => {
    (async () => {
      if (fieldKey) {
        switch (fieldKey) {
          case "weight_unit":
          case "race_demographics":
          case "ethnicity_demographics":
          case "gender_demographics":
          case "height_unit":
            let value1 = valueKey ? getIn(subject?.answers, valueKey) : "";
            if (value1) {
              helpers.setValue(value1);
            }
            break;
          default:
            break;
        }
      }
    })()
  }, [subject,values,selectedValue])

  function _renderHelperText() {
    if (isError) {
      return <FormHelperText>{error}</FormHelperText>;
    } else {
      return <FormHelperText>{' '}</FormHelperText>;
    }
  }

  return (
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
      <FormControl error={isError}>
        {/* <InputLabel >{label}</InputLabel> */}
        <Select
          displayEmpty
          disabled={disabled}
          {...field}
          value={selectedValue ? selectedValue : ""}
        >
          <MenuItem value="">
            <em style={{ color: "#aaa", fontStyle: "normal" }}>{label}</em>
          </MenuItem>
          {data.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {_renderHelperText()}
      </FormControl>
    </Box>
  );
}

SelectField.defaultProps = {
  data: []
};

SelectField.propTypes = {
  data: PropTypes.array.isRequired
};

export default React.memo(SelectField);
