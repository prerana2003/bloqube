import React from 'react';
import { Field, useField } from 'formik';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

const CheckboxGroupField = (props) => {
  const { name, options, justifycontent, label, disabled, ...rest } = props;
  const [field, meta, helper] = useField(props);
  const { setValue } = helper;

  function _onChange(val, label) {
    let _arr = field.value || [];
    if(val) {
      _arr.push(label)
    } else {
      let index = _arr.indexOf(label);
      _arr = _arr.splice(index,1); 
    }
    setValue(_arr);
  }
  return (
    <Box sx={{ height: justifycontent ? 'auto' : '100%', display: 'flex', flexDirection: 'column', justifyContent: justifycontent ? "start" : "space-between", }}>
      <Typography sx={{ color: '#5b5b5b', fontWeight: 'medium' }} variant='subtitle1' gutterBottom>{label}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column',rowGap:1 }}>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel disabled={disabled} key={`${option}`} value={field.value && field.value.includes(option)}
          checked={field.value && field.value.includes(option)} control={<Checkbox onChange={(e) => _onChange(e.target.checked, option)}/>} label={option}/>
        ))}
        </FormGroup>
      </Box>
    </Box>
  );
};

export default React.memo(CheckboxGroupField);