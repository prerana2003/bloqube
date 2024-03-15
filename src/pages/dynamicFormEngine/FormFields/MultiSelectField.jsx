import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { at } from "lodash";
import { getIn, useField, useFormikContext } from "formik";
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function MultiSelectField(props) {
  const { label, data, fieldKey, valueKey, ...rest } = props;
  const [field, meta] = useField(props);
  const { values } = useFormikContext();
  const { value: selectedValue } = field;
  const [touched, error] = at(meta, "touched", "error");
  const isError = touched && error && true;
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (props.disabled) {
      setDisabled(true);
    }
  }, [props.disabled]);
 
  const selectedValues = useMemo(() => {
    return getIn(values, props?.name);
  }, [values, selectedValue]);

  function _renderHelperText() {
    if (isError) {
      return <FormHelperText>{error}</FormHelperText>;
    } else {
      return <FormHelperText> </FormHelperText>;
    }
  }

  return (
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
        {label}
        {label && props.required && (
          <span style={{ color: "red", fontSize: 18 }}>*</span>
        )}
      </Typography>
      <FormControl error={isError}>
        <Select
          displayEmpty
          multiple
          disabled={disabled}
          {...field}
          value={selectedValue ? selectedValue : ""}
          renderValue={() => {
            const _vals = data.filter((_val) => selectedValues?.includes(_val));
            if (_vals?.length !== 0) {
              return _vals.map((dept) => dept).join(", ");
            } else {
              return (
                <em style={{ color: "#aaa", fontStyle: "normal" }}>{label}</em>
              );
            }
          }}
        >
          <MenuItem value="">
            <em style={{ color: "#aaa", fontStyle: "normal" }}>{label}</em>
          </MenuItem>
          {data.map((item, index) => (
            <MenuItem key={index} value={item}>
              <Checkbox
                checked={selectedValues?.includes(item)}
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
              />
              {item}
            </MenuItem>
          ))}
        </Select>
        {_renderHelperText()}
      </FormControl>
    </Box>
  );
}

MultiSelectField.defaultProps = {
  data: [],
};

MultiSelectField.propTypes = {
  data: PropTypes.array.isRequired,
};

export default React.memo(MultiSelectField);
