import React from "react";
import InputField from "../FormFields/InputField";
import SelectField from "../FormFields/SelectField";
import RadioGroupField from "../FormFields/RadioGroupField";
import CheckboxGroupField from "../FormFields/CheckboxGroupField";
import SliderField from "../FormFields/SliderField";
import {
  bloqcibeApi,
  useUploadSignatureMutation,
} from "../../../store/slices/apiSlice";
import { useEffect, useState } from "react";
import PhoneInputField from "../FormFields/PhoneInputField";
import DatePickerField from "../FormFields/DatePickerField";
import DateTimePickerField from "../FormFields/DateTimePickerField";
import SignatureField from "../FormFields/SignatureField";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckboxField from "../FormFields/CheckboxField";
import DataLabelField from "../FormFields/DataLabelField";
import moment from "moment";
import { Box, Typography } from '@mui/material';
import HtmlContentField from '../FormFields/HtmlContentField';
import LabelField from '../FormFields/LabelField';
import ButtonField from "../FormFields/ButtonField";
import UploadDocumentField from "../FormFields/UploadDocumentField";
import AudioField from "../FormFields/AudioField";
import TimePickerField from "../FormFields/TimePickerField";
import { getIn } from "formik";
import MultiSelectField from "../FormFields/MultiSelectField";
import SelectSearchField from "../FormFields/SelectSearchField";

const DynamicFormField = (props) => {
  const {
    _config,
    parentKey,
    setFieldValue,
    values,
    siteInitiationMasterId,
    touched,
    readOnly,
    errors,
    otpRequired,
    otpVerified,
    sectionKey,
    field,
  } = props;
  const [optionValues, setOptionValues] = useState([]);

  const [getDynamicDataValues] =
    bloqcibeApi.endpoints.getDynamicDataValues.useLazyQuery();

  useEffect(() => {
    (async () => {
      if (field && field.options && field.options.endpoint) {
        const result = await getDynamicDataValues({
          url: field.options.endpoint,
        });
        if (result.data && result.data.length > 0) {
          setOptionValues(result.data.map((_obj) => _obj.title));
        }
      }
    })();
  }, [field]);
  return (
    <>
      {field.type == "DATA_LABEL" && <DataLabelField {...props} {...field}/>}
      {field.type == "LABEL" && <LabelField  {...props} {...field}/>}
      {field.type == "DATA_HTML" && <HtmlContentField  {...props} {...field}/>}
      {field.type == "BUTTON" && (!otpRequired || (otpRequired && otpVerified)) && <ButtonField  {...props} {...field}/>}
      {field.type == "INLINE_TEXT_FIELD" && field.subtype != "DATE" && (
        <>
          {(field.role || field.showDate) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              {field.role && (
                <Typography variant="subtitle1">{field.role}</Typography>
              )}
              {field.showDate && (
                <Typography variant="subtitle1">
                  {parentKey
                    ? values[parentKey][field.currentDateKey]
                    : values[field.currentDateKey]}
                </Typography>
              )}
            </Box>
          )}
          <InputField
            name={parentKey ? `${parentKey}.${field.key}` : field.key}
            label={field.label}
            required={field.required}
            disabled={readOnly ? readOnly : field.disabled}
            justifycontent={field.justifycontent}
            type={field.subtype}
            placeholder={field.placeholder}
            fullWidth
            helperLabel={field.helperLabel}
            unit={field.unit}
            info={field.info}
            valueKey={field.valueKey}
            fieldKey={field.key}
            multiline={field.multiline}
            step={field.step}
          />
        </>
      )}
      {field.type == "DROP_DOWN" && (
        <SelectField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          data={field.options?.endpoint ? optionValues : field.options?.values}
          disabled={readOnly ? readOnly : field.disabled}
          required={field.required}
          justifycontent={field.justifycontent}
          label={field.label}
          fieldKey={field.key}
          valueKey={field.valueKey}
          fullWidth
        />
      )}
      {field.type == "MULTISELECT_DROP_DOWN" && (
        <MultiSelectField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          data={field.options?.endpoint ? optionValues : field.options?.values}
          disabled={readOnly ? readOnly : field.disabled}
          required={field.required}
          justifycontent={field.justifycontent}
          label={field.label}
          fieldKey={field.key}
          valueKey={field.valueKey}
          fullWidth
        />
      )}
      {field.type == "SEARCH_DROP_DOWN" && (
        <SelectSearchField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          data={field.options?.endpoint ? optionValues : field.options?.values}
          disabled={readOnly ? readOnly : field.disabled}
          required={field.required}
          justifycontent={field.justifycontent}
          label={field.label}
          fieldKey={field.key}
          valueKey={field.valueKey}
          fullWidth
          multiple={field.multivalue}
          {...props}
        />
      )}
      {field.type == "FILE_UPLOAD" && (
        <UploadDocumentField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          disabled={readOnly}
          required={field.required}
          justifycontent={field.justifycontent}
          label={field.label}
          supportedFormats={field.supportedFormats}
          fileSize={field.fileSize}
          fieldKey={field.key}
          parentKey={parentKey}
          fullWidth
          {...props}
        />
      )}
      {field.type == "RADIO_BUTTONS" && (
        <RadioGroupField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          options={field.options.values}
          required={field.required}
          infoText={field.infoText}
          verticalAlignCenter={field.verticalAlignCenter}
          disabled={readOnly}
          label={field.label}
        />
      )}
      {field.type == "AUDIO" && (
        <AudioField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          disabled={readOnly}
          audioText={field.audioText}
        />
      )}
      {field.type == "CHECK_BOX" && (
        <CheckboxField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          disabled={readOnly}
          label={field.label}
        />
      )}
      {field.type == "CHECK_BOX_GROUP" && (
        <CheckboxGroupField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          justifycontent={field.justifycontent}
          disabled={readOnly}
          label={field.label}
          options={field.options.values}
        />
      )}
      {field.type == "SLIDER" && (
        <SliderField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          justifycontent={field.justifycontent}
          label={field.label}
          disabled={readOnly}
          valueLabelDisplay={
            field.valueLabelDisplay ? field.valueLabelDisplay : "off"
          }
          {...field.defaultProps}
        />
      )}
      {field.type == "PHONE_INPUT" && (
        <PhoneInputField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          label={field.label}
          placeholder={field.placeholder}
          touched={touched}
          required={field.required}
          errors={errors}
          setFieldValue={setFieldValue}
          {...field.defaultProps}
        />
      )}
      {field.type == "INLINE_TEXT_FIELD" && field.subtype == "DATE" && (
        <>
          <DatePickerField
            label={field.label}
            required={field.required}
            justifycontent={field.justifycontent}
            name={parentKey ? `${parentKey}.${field.key}` : field.key}
            setFieldValue={setFieldValue}
            disabled={readOnly ? readOnly : field.disabled}
            disableFutureDates={field.disableFutureDates}
            valueKey={field.valueKey}
            fieldKey={field.key}
          />
        </>
      )}
      {field.type == "TIME" && (
        <>
          <TimePickerField
            label={field.label}
            name={parentKey ? `${parentKey}.${field.key}` : field.key}
            setFieldValue={setFieldValue}
            disabled={readOnly}
          />
        </>
      )}
      {field.type == "INLINE_TEXT_FIELD" && field.subtype == "DATE_TIME" && (
        <>
          <DateTimePickerField
            label={field.label}
            name={parentKey ? `${parentKey}.${field.key}` : field.key}
            setFieldValue={setFieldValue}
            disabled={readOnly}
          />
        </>
      )}
      {field.type == "SIGNATURE" && (
        <SignatureField
          name={parentKey ? `${parentKey}.${field.key}` : field.key}
          label={field.label}
          label2={field.label2}
          fieldKey={field.key}
          disabled={readOnly}
          justifycontent={field.justifycontent}
          required={field.required}
          parentKey={parentKey}
          role={field.role}
          showDate={field.showDate}
          siteInitiationMasterId={siteInitiationMasterId}
          setFieldValue={setFieldValue}
          sectionKey={sectionKey}
          {...props}
        />
      )}
    </>
  );
};

export default React.memo(DynamicFormField);
