import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

const FormikMultiSelect = ({ name, options, label, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (event) => {
    // Set the values for the field
    setFieldValue(name, event.target.value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    multiple: true,
    onChange: handleChange
  };

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <InputLabel>{label}</InputLabel>
      <Select {...configSelect} label={label} >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error ? (
        <FormHelperText>{meta.error}</FormHelperText>
      ) : null}
    </FormControl>
  );
};
 export default FormikMultiSelect;