import { useField } from 'formik';
import React from 'react'
import CustomPhoneInput from '../../pages/dynamicFormEngine/FormFields/CustomPhoneInput';
import PhoneInput from 'react-phone-number-input';

const Phone = ({ form, ...props }) => {
    const [field, meta, helpers] = useField(props.field.name);
    return (
      <PhoneInput
        {...form}
        {...field}
        placeholder={props.placeholder}
        value={field.value}
        defaultCountry="IN"
        size="small"
        onChange={(value) => {
          if (!form.touched[field.name]) form.setFieldTouched(field.name);
          form.setFieldValue(field.name, value);
        }}
        label={props?.label}
        inputComponent={CustomPhoneInput}
      />
    );
}

export default Phone
