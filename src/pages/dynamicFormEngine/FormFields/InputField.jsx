import React, { useEffect, useState } from "react";
import { at } from "lodash";
import { getIn, useField, useFormikContext } from "formik";
import {
  Box,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { bloqcibeApi } from "../../../store/slices/apiSlice";
import moment from "moment";

export default function InputField(props) {
  const { errorText,
    fieldKey,
    ...rest } = props;
  const [field, meta, helpers] = useField(props);
  const { values } = useFormikContext();
  const subject = useSelector((state) => state.subject)
  const trialSite = useSelector((state) => state.trial?.trialSiteDetail)

  const [disabled,setDisabled]=useState(false)

  useEffect(() => {
    (async () => {
      if (fieldKey) {
        switch (fieldKey) {
          case "siteNo":
            helpers.setValue(trialSite?.siteTrialData?.site?.id)
            setDisabled(true)
            break;
          case "calculatedAge":
            let value = props?.valueKey ? getIn(values, props?.valueKey) : null;
            let age = null;
            if (value) {
              const birthdate = moment(value, "MM/DD/YYYY");
              const currentDate = moment();
              let a = currentDate.diff(birthdate, "years");
              if (typeof a === "string" || typeof a === "number") age = a
            } 
            if(age!==null) helpers.setValue(age)
            break;
          case "age":
          case "occupation":
          case "height":
          case "weight":
          case "weight_unit":
          case "race_demographics_comment":
          case "ethnicity_demographics_comment":
          case "gender_demographics":
                let value1 = props?.valueKey ? getIn(subject?.answers, props?.valueKey) : "";
                if (value1) helpers.setValue(value1);
                break;
          default: break;
        }
      }
    })()
  }, [trialSite, subject,values])
  
  useEffect(() => {
    if (props.disabled) {
      setDisabled(true)
    }
  },[props.disabled])

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
        height: props.justifycontent ? "auto" : "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: props.justifycontent ? "start" : "space-between",
      }}
    >
      <Box
        sx={{
          height: props.justifycontent ? "auto" : "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ color: "#5b5b5b", fontWeight: "medium" }}
          variant="subtitle1"
          gutterBottom
        >
          {props.label}
          {props.label && props.required && (
            <span style={{ color: "red", fontSize: 18 }}>*</span>
          )}
        </Typography>
        {props.info && (
          <Tooltip title={props.info}>
            <InfoOutlinedIcon
              sx={{ color: "#0f52b9", ml: 1, fontSize: 18, mb: 1 }}
            />
          </Tooltip>
        )}
      </Box>
      <TextField
        type={props.type}
        multiline={props?.multiline}
        placeholder={props?.placeholder}
        disabled={disabled}
        fullWidth
        error={meta.touched && meta.error && true}
        helperText={_renderHelperText()}
        {...field}
        onKeyDown={(e) => {
          if (props.type==="number" && (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+")) {
            e.preventDefault()
          }
        }}
        InputProps={{
          inputProps: { min: 0, step: props?.step },
          endAdornment: (props?.unit&&
            <InputAdornment position="end">
              <Typography variant="body2" color="grey[800]" fontWeight={500}>
                {props?.unit}
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{
          "& input[type=number]": {
            "-moz-appearance": "textfield",
          },
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
        }}
        // {...rest}
      />
    </Box>
  );
}
