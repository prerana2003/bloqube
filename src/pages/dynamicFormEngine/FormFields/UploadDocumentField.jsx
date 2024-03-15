import React, { useEffect, useState } from 'react';
import { Field, getIn, useField, useFormikContext } from 'formik';
import { at } from 'lodash';
import { FormHelperText, Box, Typography, InputAdornment } from '@mui/material';
import { useParams } from 'react-router-dom';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { MuiFileInput } from 'mui-file-input';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { extractFilenameFromKey } from '../../../util/util';

const UploadDocumentField = (props) => {
    let { siteInitStep } = useParams();
    const { errorText, name, label,
        sectionKey,
        fieldKey,
        setCustomErrorExist,
        supportedFormats,
        fileSize,
        subSectionKey, parentKey, handleDownloadFile, setFieldValue, handleUploadFile, ...rest } = props;
    const { errors, touched } = useFormikContext();
    const [field, meta] = useField(name);
    const [error] = at(meta, 'error');

    const [selectedFile, setSelectedFile] = useState(null);
    const [manualError, setManualError] = useState(null);
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        if (field.value) {
            const _fName = extractFilenameFromKey(field.value);
            setFileName(_fName);
        }
    }, [field.value])
    function _renderHelperText() {
        let errorText = error;
        if (manualError) {
            return <FormHelperText sx={{ color: '#d32f2f' }}>{manualError}</FormHelperText>;
        }
        if (!errorText) {
            errorText = parentKey && errors[parentKey] ? errors[parentKey][fieldKey + '_inputFile'] : errors[fieldKey + '_inputFile'];
            if (errorText) {
                return <FormHelperText sx={{ color: '#d32f2f' }}>{errorText}</FormHelperText>;
            }
        } else if (Boolean(getIn(touched, name))) {
            return <FormHelperText sx={{ color: '#d32f2f' }}>{errorText}</FormHelperText>;
        }
        return <FormHelperText sx={{ color: '#d32f2f' }}>{''}</FormHelperText>;
    }

    const handleDownload = () => {
        handleDownloadFile(field.value, fileName)
    }
    const handleFileChange = (e) => {
        if (fileSize && fileSize < e.size) {
            setSelectedFile(null);
            setFileName(null);
            setFieldValue(field.name, '');
            setManualError("File is too large");
        } else if (supportedFormats && !supportedFormats.includes(e.name.substr(e.name.lastIndexOf('.') + 1, e.name.length))) {
            setSelectedFile(null);
            setFileName(null);
            setFieldValue(field.name, '');
            setManualError("Unsupported Format");
        } else {
            setManualError(null);
            setSelectedFile(e)
            setFileName(e.name);
            let keys = {
                stepKey: siteInitStep,
                sectionKey: sectionKey,
                subSectionKey: subSectionKey,
                categoryKey: parentKey ? parentKey : "",
                fieldKey: fieldKey,
                file: e,
            };
            handleUploadFile(keys, field.name, setFieldValue)
        }
    }
    return (
        <Box>
            <Typography sx={{ color: '#5b5b5b', fontWeight: 'medium' }} variant='subtitle1' gutterBottom>{label}{label && props.required && <span style={{ color: 'red', fontSize: 18 }}>*</span>}</Typography>
            <Box sx={{ display: 'flex' }}>
                <MuiFileInput
                    sx={{
                        "& .MuiFileInput-placeholder": {
                            overflow: 'hidden',
                        }
                    }}
                    placeholder={fileName ? fileName : 'Click here to insert a file'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachFileIcon />
                            </InputAdornment>
                        ),
                    }}
                    value={selectedFile}
                    name={name + '_inputFile'}
                    hideSizeText={true}
                    onChange={handleFileChange} />

                {fileName &&
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: 2, cursor: 'pointer' }} onClick={handleDownload}>
                        <FileDownloadOutlinedIcon sx={{ color: "#3C6FEB", marginLeft: 1 }} />
                    </Box>}
            </Box>
            <input type="hidden" {...field} />
            {_renderHelperText()}
        </Box>
    )
}
export default React.memo(UploadDocumentField);