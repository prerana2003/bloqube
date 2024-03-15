import { Box, FormHelperText, Typography, useTheme } from "@mui/material";
import React, { useState, useMemo, useEffect } from "react";
import SignatureBox from "../../../components/common/SignatureBox";
import { useField } from "formik";
import { useParams } from "react-router-dom";
import { at } from "lodash";
import moment from "moment";
import { useResponsive } from "../../../hooks/ResponsiveProvider";

const SignatureField = (props) => {
  const {
    setFieldValue,
    parentKey,
    disabled,
    sectionKey,
    fieldKey,
    subSectionKey,
    values,
    handleSaveSignature,
    handleDownloadSignature,
    role,
  } = props;
  let { siteInitStep } = useParams();
  const {isSmallScreen} = useResponsive();
  const theme = useTheme()
  const [sign, setSign] = useState(null);
  const [signatureDialog, setSignatureDialog] = useState(false);
  const [signTime, setSignTime] = useState(moment().format("DD/MM/YYYY HH:mm:ss"));
  const [field, meta,helpers] = useField(props);
  const [touched, error] = at(meta, "touched", "error");
  const isError = touched && error && true;
  const openDialog = () => {
    if (!disabled) {
      setSignatureDialog(true);
    }
  };

  const handleClose = () => {
    setSignatureDialog(false);
  };
  useEffect(() => {
    if (field.value && field.value != 'testSign') {
      handleDownloadSignature(field.value, setSign)
    }
  }, [field.value])

  useEffect(() => {
    if (touched && error && sign) {
      helpers.setError("")
    } else if (touched && error && !sign){
     
    }
    
  },[sign])

  const saveSignature = async (data) => {
    if (!data) {
      setSignatureDialog(false);
      helpers.setError("This field is required");
    }else{
      setSignTime(moment().format("DD/MM/YYYY HH:mm:ss"));
      setSign(data);
      let keys = {
        stepKey: siteInitStep,  
        sectionKey: sectionKey,
        subSectionKey: subSectionKey,
        categoryKey: parentKey ? parentKey : "",
        fieldKey: fieldKey,
        file: data,
      };
      handleSaveSignature(keys, field.name, setFieldValue)
      setSignatureDialog(false);
    }
  };
  function _renderHelperText() {
    if (isError) {
      return <FormHelperText sx={{ color: "#d32f2f" }}>{error}</FormHelperText>;
    }
    return <FormHelperText sx={{ color: "#d32f2f" }}>{""}</FormHelperText>;
  }

  return (
    <Box
      sx={{
        height: props.justifycontent ? "auto" : "100%",
        display: "flex",
        flexDirection: "column",
        rowGap: 1,
        paddingX: isSmallScreen?0:2,
        justifyContent: props.justifycontent ? "start" : "space-between",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {role && <Typography variant="subtitle1">{role}</Typography>}
       {sign&& <Typography variant="subtitle1" sx={{ marginLeft: 'auto' }}>
          {field.currentDateKey ? parentKey
            ? values[parentKey][field.currentDateKey]
            : values[field.currentDateKey] : signTime}
        </Typography>}
      </Box>
      {props.label && (
        <Typography
          sx={{ color: "#5b5b5b", fontWeight: "bold" }}
          variant="subtitle1"
          gutterBottom
        >
          {props.label}
          {props.label && props.required && (
            <span style={{ color: "red", fontSize: 18 }}>*</span>
          )}
        </Typography>
      )}
      {props.label2 && (
        <Typography
          sx={{ color: "#5b5b5b", fontWeight: "medium" }}
          variant="subtitle1"
          gutterBottom
        >
          {props.label2}
        </Typography>
      )}
      <Box
        sx={{
          boxShadow:isError
          ? `0px 0px 8px 0px ${theme.palette.error.main}`
          : "1px 1px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.10)",
          height: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {sign ? (
          <img
            src={sign}
            width={250}
            height={70}
            disabled={disabled}
            alt={"Click here to sign"}
            onClick={openDialog}
          />
        ) : (
          <Typography onClick={openDialog}>
            {disabled ? "" : "Click here to sign"}
          </Typography>
        )}
      </Box>
      <SignatureBox
        open={signatureDialog}
        handleClose={handleClose}
        saveSign={saveSignature}
      />
      <input type="hidden" {...field} />
      {_renderHelperText()}
    </Box>
  );
};

export default React.memo(SignatureField);
