import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

const FocusError = () => {
    const { errors, isSubmitting, isValidating } = useFormikContext();

    useEffect(() => {
        if (isSubmitting && !isValidating) {
            let keys = Object.keys(errors);
            if (keys.length > 0) {
                let childkeys = Object.keys(errors[keys[0]]);
                let selector = `[name=${keys[0]}]`;
                if (childkeys.length > 0) {
                    selector = `[name=${keys[0]}\\.${childkeys[0]}]`;
                }
                
                const errorElement = document.querySelector(selector);
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    errorElement.focus({ preventScroll: true });
                }
            }
        }
    }, [errors, isSubmitting, isValidating]);

    return null;
};
export default FocusError;