
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Box, Divider, IconButton, Typography, styled } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useSelector } from 'react-redux';
import { subjectDashboardDetails } from '../../store/slices/subjectSlice';
import { bloqcibeApi, useUploadSubjectProfilePicMutation } from '../../store/slices/apiSlice';
import { base64ToArrayBuffer } from '../../components/common/DocumentUpload';

const Input = styled('input')({
    display: 'none',
});

function SubjectProfile() {
    const subjectDashboardInfo = useSelector(subjectDashboardDetails);
    const [profilePic, setProfilePic] = useState(null);
    const [uploadSubjectProfilePic] = useUploadSubjectProfilePicMutation();
    const [downloadSubjectProfilePic] =
        bloqcibeApi.endpoints.downloadSubjectProfilePic.useLazyQuery();
    useEffect(() => {
        (async () => {
            if(subjectDashboardInfo?.subjectDetail?.profilePic) {
                const result = await downloadSubjectProfilePic({
                    s3Key: subjectDashboardInfo?.subjectDetail?.profilePic,
                });
                if (result.data) {
                    const byteArray = base64ToArrayBuffer(result.data);
                    const rr = new Blob([byteArray], { type: "application/octet-stream" });
                    const reader = new FileReader();
                    reader.readAsDataURL(rr);
                    reader.onloadend = function () {
                        const base64data = reader.result;
                        setProfilePic(base64data);
                    };
                }
            }
        })();
    }, [subjectDashboardInfo])

    const handlePicChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setProfilePic(e.target.result);
            };
            reader.readAsDataURL(file);
            const formData = new FormData();
            formData.append("file", file);
            const result = await uploadSubjectProfilePic({
                payload: formData,
                subjectMasterId: subjectDashboardInfo?.crfDetail?.subjectMasterId,
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="icon-button-file">
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={handlePicChange} />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <Avatar
                            alt="Profile Picture"
                            src={profilePic ? profilePic : ''}
                            sx={{ width: 100, height: 100 }}
                        >
                            <PhotoCamera fontSize='large' />
                        </Avatar>
                    </IconButton>
                </label>

                <Typography variant='h5'>{subjectDashboardInfo?.subjectDetail.subjectName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, paddingTop: 5, paddingX: 2 }}>
                <Box>
                    <Typography color={'grey'}>Date of birth</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.dob}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Age</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.calculatedAge}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Gender</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectGender}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Address</Typography>
                    <Box sx={{ display: 'flex', columnGap: 1 }}>
                        <Typography sx={{
                            fontWeight: 500, fontSize: 20,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal', // Allow wrapping
                            wordWrap: 'break-word'
                        }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectAddress}
                            <span style={{ marginLeft: 10 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectCity}</span>
                            <span style={{ marginLeft: 10 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectState}</span>
                            <span style={{ marginLeft: 10 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectZipcode}</span></Typography>
                    </Box>
                </Box>
                <Divider />
                <Box>
                    {/* <MailOutlineIcon sx={{ color: 'grey' }} /> */}
                    <Typography color={'grey'}>Email</Typography>
                    <Typography noWrap sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectEmail}</Typography>
                </Box>
                <Divider />
                <Box>
                    {/* <PhoneIcon sx={{ color: 'grey' }} /> */}
                    <Typography color={'grey'}>Phone</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectMobile}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Height (in {subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.height_unit})</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectHeight}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Weight (in {subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.weight_unit})  </Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectWeight}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Occupation</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectOccupation}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Race</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectRace}</Typography>
                </Box>
                <Divider />
                <Box>
                    <Typography color={'grey'}>Ethnicity</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: 20 }}>{subjectDashboardInfo?.subjectEnrollmentData.subjectDetails.subjectEthnicity}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default SubjectProfile;
