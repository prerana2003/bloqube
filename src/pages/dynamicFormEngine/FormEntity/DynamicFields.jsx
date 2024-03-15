import React from 'react'
import { Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import InputField from "../FormFields/InputField";
import SelectField from "../FormFields/SelectField";
import RadioGroupField from "../FormFields/RadioGroupField";
import CheckboxField from "../FormFields/CheckboxField";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckboxGroupField from "../FormFields/CheckboxGroupField";
import SliderField from "../FormFields/SliderField";
import DynamicFormField from './DynamicFormField';
import { getIn } from "formik";
import { useResponsive } from '../../../hooks/ResponsiveProvider';


const DynamicFields = (props) => {
    const {isSmallScreen} = useResponsive();
    const { _config, parentKey, setFieldValue, values, touched, errors, readOnly, siteInitiationMasterId, userSiteTrialRole } = props;
    return (<>
        <Box>
            <Grid container  spacing={isSmallScreen ? 0 : 1} padding={isSmallScreen?1:3}>
                {_config && _config.map((field, fieldIndex) => (
                    field.key == 'divider' ?
                        <Grid key={`${field.key}${fieldIndex}`} item md={12} lg={12} sm={12} xs={12} sx={{marginBottom:2}}><Box width={'100%'}><Divider /></Box></Grid>
                        :
                        ((!field.access || (field.access && (field.access == userSiteTrialRole || field.access.includes(userSiteTrialRole)))) && (!field.dependsOn || (field.dependsOn && getIn(values, field.dependsOn) === field.dependsValue))) &&
                        <Grid key={parentKey ? `${parentKey}.${fieldIndex}` : `aa${fieldIndex}`} item md={field.md} lg={field.lg} sm={field.sm} xs={field.sm} paddingY={1} paddingX={isSmallScreen?1:3}>
                            <DynamicFormField {...props} field={field} />
                            {
                                field.fields && <Grid container spacing={isSmallScreen ? 0 : 1}>
                                    {
                                        field.fields.map((childField, childIndex) => (
                                            ((!childField.access || (childField.access && (childField.access == userSiteTrialRole || childField.access.includes(userSiteTrialRole)))) && (!childField.dependsOn || (childField.dependsOn && getIn(values, childField.dependsOn) === childField.dependsValue))) && <Grid key={parentKey ? `${parentKey}.${childIndex}.${fieldIndex}` : `aa${childIndex}${fieldIndex}`} item md={childField.md} lg={childField.lg} sm={childField.sm} xs={childField.sm}>
                                                <DynamicFormField {...props} field={childField} />
                                                </Grid>
                                        ))
                                    }
                                </Grid>
                            }
                        </Grid>
                ))}
            </Grid>
        </Box>
    </>)
}

export default React.memo(DynamicFields);