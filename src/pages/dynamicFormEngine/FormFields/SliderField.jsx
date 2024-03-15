import { Box, InputLabel, Slider, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { at } from "lodash";
import { useField } from "formik";

const SliderField = (props) => {
  const theme = useTheme();
  const { errorText, ...rest } = props;
  const [field, meta] = useField(props);

  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return error;
    }
  }
  return (
    <Box sx={{ height: props.justifycontent ? 'auto' : '100%', display: 'flex', flexDirection: 'column', justifyContent: props.justifycontent ? "start" : "space-between",}}>
      <Typography sx={{color:'#5b5b5b',fontWeight:'medium'}} variant='subtitle1' gutterBottom>{props.label}</Typography>
      <Box sx={{display: 'flex', paddingBottom: 2, marginTop:props.valueLabelDisplay == 'off'? 0 : 2}}><Slider sx={{
        '& .MuiSlider-valueLabel': {
          top: -6,
          backgroundColor: 'unset',
          color: theme.palette.text.primary,
        },
      }} {...field} {...rest} /></Box>
    </Box>
  )
};

export default React.memo(SliderField);
