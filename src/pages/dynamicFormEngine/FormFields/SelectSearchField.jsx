import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { useField } from "formik";
import { at } from "lodash";
import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SelectSearchField = (props) => {
  const { label, data, fieldKey, valueKey, setFieldValue, name, ...rest } =
    props;
  const [field, meta] = useField(props);
  const { value: selectedValue } = field;
  const [touched, error] = at(meta, "touched", "error");
  const isError = touched && error && true;

  function _renderHelperText() {
    if (isError) {
      return <FormHelperText>{error}</FormHelperText>;
    } else {
      return <FormHelperText> </FormHelperText>;
    }
  }

  const handleChange = (_, newValue) => {
    setFieldValue(name, newValue);
  };
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
        <Autocomplete
          multiple={props.multiple}
          fullWidth={props.fullWidth}
          disablePortal
          disableClearable={!props.multiple}
          disableCloseOnSelect
          placeholder={label}
          options={data}
          {...field}
          onChange={handleChange}
          value={selectedValue ? selectedValue : ""}
          sx={{
            "& .MuiAutocomplete-input": { width: "10%" },
            "& .MuiAutocomplete-inputRoot": {
              flexWrap: "nowrap",
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={meta.touched && meta.error && true}
              placeholder={selectedValue.length < 1 && label}
            />
          )}
          renderTags={() => {
            const _vals = data.filter((_val) => selectedValue?.includes(_val));
            if (_vals?.length !== 0) {
              let value = _vals.map((dept) => dept).join(", ");
              return (
                <span
                  style={{
                    maxWidth: 300,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {value}
                </span>
              );
            }
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          PopperComponent={(props) => <Popper {...props} placement="bottom" />}
        />
        {_renderHelperText()}
      </FormControl>
    </Box>
  );
};

export default SelectSearchField;
