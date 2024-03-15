import React from 'react';
import { useField, Field } from 'formik';
import { at } from 'lodash';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Box, Typography } from '@mui/material';

const RadioGroupField = ({ name, label, options,verticalAlignCenter, ...props }) => {
  const [field, meta] = useField(name);
  const [touched, error] = at(meta, 'touched', 'error');
  const isError = touched && error && true;
  function _renderHelperText() {
    if (isError) {
      return <FormHelperText sx={{ color: '#d32f2f' }}>{error}</FormHelperText>;
    }
    return <FormHelperText sx={{ color: '#d32f2f' }}>{''}</FormHelperText>;
  }

  return (
    <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'column', height: verticalAlignCenter ? '100%' : 'auto', justifyContent: verticalAlignCenter ? 'center' : 'space-between' }}>
      {label && <Box><FormLabel component="legend">
        {/* {label}{label && props.required && <span style={{ color: 'red',fontSize:18 }}>*</span>} */}
        <Typography sx={{ color: '#5b5b5b', fontWeight: 'medium' }} variant='subtitle1' gutterBottom>{label}{label && props.required && <span style={{ color: 'red', fontSize: 18 }}>*</span>}</Typography>
      </FormLabel></Box>}
      <Typography sx={{ color: '#7b7b7b' }}>{props.infoText}</Typography>
      <Box><RadioGroup row {...field} {...props}>
        <Box sx={{ paddingX: 1 }}>
          {options.map((option) => (
            <FormControlLabel
              key={`${option}${name}`}
              value={option}
              control={<Radio disabled={props.disabled} />}
              label={option}
            />
          ))}</Box>
      </RadioGroup></Box>
      {_renderHelperText()}
    </FormControl>
  );
};


export default React.memo(RadioGroupField);
