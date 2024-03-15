import { Box, Button, Divider, Drawer, TextField, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/@extended/CustomButton";
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { MentionsInput, Mention } from 'react-mentions'
import { bloqcibeApi, useSaveCommentMutation } from "../../../store/slices/apiSlice";
import { useParams } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment'
import { useDispatch, useSelector } from "react-redux";
import { setUserLocation } from "../../../store/slices/userDetailsSlice";
import { openMessage } from "../../../store/slices/showMessageSlice";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const CommentHistory = (props) => {
    const { trialId, siteId, trialSiteId, subjectMasterId, crfMasterId, visitStepKey } = useParams();
    const { open, onCloseHistory, field, answer, sectionKey, subSectionKey, categoryKey, stepKey } = props;
    const dispatch = useDispatch();
    const sponsorId = useSelector((state) => state.auth.sponsorId);
    const trialUsers = useSelector((state) => state.trial.trialUsers);
    const userDetails = useSelector((state) => state.userDetails);
    const [getComments] = bloqcibeApi.endpoints.getComments.useLazyQuery();
    const [getFieldHistory] = bloqcibeApi.endpoints.getFieldHistory.useLazyQuery();
    const [getSubjectFieldHistory] = bloqcibeApi.endpoints.getSubjectFieldHistory.useLazyQuery();
    const [saveComment] = useSaveCommentMutation();
    const [users, setUsers] = useState([]);
    const [commentHist, setCommentHist] = useState([]);
    const [fieldHist, setFieldHist] = useState([]);
    const [comment, setComment] = useState('');
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        if (trialUsers) {
            //console.log('trialUsers', trialUsers);
            const _users = trialUsers.map((_obj) => {
                return {
                    id: _obj.user.email,
                    display: _obj.user.firstName + ' ' + _obj.user.lastName
                }
            })
            setUsers(_users);
        }
    }, [trialUsers])
    useEffect(() => {
        (async () => {
            fetchCommentHistory();
            fetchValueHistory();
        })();
    }, [field])
    useEffect(() => {
        if (userDetails && (!userDetails.locationLat || !userDetails.locationLng)) {
            getGeoLocation();
        }
    }, [userDetails])
    const getGeoLocation = async (processSubmit) => {
        if ('geolocation' in navigator) {
            await navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    // Do something with the latitude and longitude
                    if (latitude && longitude) {
                        dispatch(setUserLocation({ locationLatitude: latitude, locationLongitude: longitude }))
                    }
                    processSubmit && processSubmit({ locationLat: latitude, locationLng: longitude });
                },
                (error) => {
                    dispatch(openMessage({ message: "Please enable location access to add the comment.", messageSeverity: "error" }))
                    console.error(`Error getting geolocation: ${error.message}`);
                }
            );
        } else {
            // Geolocation is not supported
            dispatch(openMessage({ message: "Geolocation is not supported!", messageSeverity: "error" }))
            console.log('Geolocation is not supported');
        }
    }
    const fetchValueHistory = async () => {
        const payload = {
            ...(visitStepKey ? { crfMasterId: crfMasterId } : { subjectMasterId: subjectMasterId }),
            stepKey: visitStepKey ? visitStepKey : stepKey,
            sectionKey: sectionKey,
            subSectionKey: subSectionKey,
            categoryKey: categoryKey,
            fieldKey: field.key
        };
        let valueHis;
        if (visitStepKey) {
            valueHis = await getFieldHistory({
                payload
            });
        } else {
            valueHis = await getSubjectFieldHistory({
                payload
            });
        }


        const _valuesList = valueHis.data.map((_obj) => {
            return {
                user: _obj.createdBy,
                value: _obj.fieldValue,
                date: moment(_obj.Timestamp).format('MM/DD/YYYY hh:mm a')
            }
        });
        setFieldHist(_valuesList);
    }
    const fetchCommentHistory = async () => {
        const commentHis = await getComments({
            sponsorId: sponsorId,
            trialId: trialId,
            trialSiteId: siteId,//trialSiteData?.siteTrialData?.site?.id,
            subjectMasterId: subjectMasterId,
            payload: {
                crfMasterId: crfMasterId,
                stepKey: visitStepKey ? visitStepKey : stepKey,
                sectionKey: sectionKey,
                subSectionKey: subSectionKey,
                categoryKey: categoryKey,
                fieldKey: field.key
            }
        })
        const _commentList = commentHis.data.map((_obj) => {
            let comm = _obj.comment;
            const matches = comm.match(/\@\[(.*?)\]\([^)]+\)/);
            if (matches) {
                console.log(matches)
                for (let i = 0; i < matches?.length; i++) {
                    if (i % 2 == 1) {
                        comm = comm.replace(matches[i - 1], `<span style='background-color: #e8edff'>${matches[i]}</span>`)
                    }
                }
            }
            return {
                ..._obj,
                comment: comm
            }
        });
        setCommentHist(_commentList);
    }
    const handleChange = (event, newValue, newPlainTextValue, mentions) => {
        setComment(newValue);
    };
    const saveCommentData = async () => {
        let _locationObj = { ...userDetails };
        if (!_locationObj.locationLat || !_locationObj.locationLng) {
            _locationObj = await getGeoLocation(processSubmit);
        } else {
            await processSubmit(_locationObj);
        }
    };
    const processSubmit = async (_locationObj) => {
        //console.log('value', comment)
        const payload = {
            sponsorId: sponsorId,
            trialId: trialId,
            siteId: siteId,
            subjectMasterId: subjectMasterId,
            crfMasterId: crfMasterId,
            stepKey: visitStepKey ? visitStepKey : stepKey,
            sectionKey: sectionKey,
            subSectionKey: subSectionKey,
            categoryKey: categoryKey,
            fieldKey: field.key,
            comment: comment,
            latitude: _locationObj.locationLat,
            longitude: _locationObj.locationLng
        }
        await saveComment({ payload })
        setComment('');
        fetchCommentHistory();
    }
    const renderSuggestionsContainer = (containerProps, children) => (
        <div {...containerProps} style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto' }}>
            {children}
        </div>
    );
    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={onCloseHistory}
            sx={{
                width: 500, // Set the width of the Drawer
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 500, // Set the width of the Drawer paper
                    height: '100%',
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box sx={{ paddingTop: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card sx={{ flexGrow: 1 }}>
                    <Box
                        sx={{
                            width: "100%",
                            height: 4,
                            backgroundColor: theme.palette.primary.main,
                        }}
                    />
                    <CardHeader
                        title={`${field.label} (History)`}
                        titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
                        sx={{ backgroundColor: theme.palette.grey[50] }}
                    />
                    <CardContent>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                {/* <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
                                    <Typography>{<><span style={{ fontWeight: 600 }}>Amit Gabada</span><span> updated the value </span><span style={{ fontWeight: 600 }}>Sprint</span><span style={{ color: '#44546F', fontWeight: 500 }}> November 27, 2023 at 10:44 AM</span></>}</Typography>
                                    <Typography>{<><span style={{ fontWeight: 600 }}>Amit Gabada</span><span> updated the value </span><span style={{ fontWeight: 600 }}>Sprint</span><span style={{ color: '#44546F', fontWeight: 500 }}> November 27, 2023 at 10:44 AM</span></>}</Typography>
                                    <Typography>{<><span style={{ fontWeight: 600 }}>Amit Gabada</span><span> updated the value </span><span style={{ fontWeight: 600 }}>Sprint</span><span style={{ color: '#44546F', fontWeight: 500 }}> November 27, 2023 at 10:44 AM</span></>}</Typography>
                                </Box>
                                {/* <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Comments</Typography> */}
                                <Box>
                                    <Tabs value={value} onChange={handleTabChange}>
                                        <Tab label="Comment" {...a11yProps(0)} />
                                        <Tab label="History" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <CustomTabPanel value={value} index={0}>
                                    <List sx={{ width: '100%', bgcolor: 'background.paper', height: 'calc(100vh - 300px)', overflow: 'auto' }}>
                                        {
                                            commentHist && commentHist.length > 0 ? commentHist.map((_commentObj, index) =>

                                                <ListItem key={`comment${index}`} style={{ paddingTop: 0, paddingBottom: 0 }}
                                                //secondaryAction={<div>{moment(_commentObj.createdAt).format('MM/DD/YYYY hh:mm a')}</div>}
                                                >

                                                    <ListItemText primary={
                                                        <Tooltip title={<div dangerouslySetInnerHTML={{ __html: _commentObj.comment }} />} placement="left-start">
                                                            <div
                                                                style={{ textOverflow: 'ellipsis', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: _commentObj.comment }} />
                                                        </Tooltip>}
                                                        secondary={<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography>{_commentObj.createdBy}</Typography>
                                                            <Box sx={{ display:'flex',columnGap:1 }}><Typography>{moment(_commentObj.createdAt).format('MM/DD/YYYY hh:mm a')}</Typography>
                                                                {
                                                                    _commentObj.latitude && _commentObj.longitude &&
                                                                    <Tooltip title={`${_commentObj.latitude},${_commentObj.longitude}`}>
                                                                        <LocationOnIcon color="primary"/>
                                                                    </Tooltip>
                                                                }
                                                            </Box>
                                                        </Box>} />

                                                </ListItem>
                                            ) : <Typography sx={{ color: 'grey', paddingY: 2 }}>No comment exist</Typography>
                                        }
                                    </List>
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <List sx={{ width: '100%', bgcolor: 'background.paper', height: 'calc(100vh - 300px)', overflow: 'auto' }}>
                                        {
                                            fieldHist && fieldHist.length > 0 ? fieldHist.map((_valObj, index) =>
                                            fieldHist[index-1]?.value!==_valObj.value && <Box key={`val${index}`} sx={{ paddingY: 1 }}><Typography>{<><span style={{ fontWeight: 600 }}>{_valObj.user}</span><span> updated the value </span><span style={{ fontWeight: 600 }}>{_valObj.value}</span></>}</Typography>
                                                    <Typography style={{ color: 'grey', fontWeight: 400 }}> {_valObj.date}</Typography>
                                                </Box>

                                            ) : <Typography sx={{ color: 'grey', paddingY: 2 }}>No history exist</Typography>
                                        }
                                    </List>
                                </CustomTabPanel>

                            </Box>

                        </Box>
                    </CardContent>
                </Card>
                <Box sx={{ display: 'flex', padding: 3, justifyContent: 'end', flex: 1, alignItems: 'flex-end' }}>
                    <MentionsInput
                        style={{ width: '100%', minHeight: 40, maxHeight: 100 }}
                        value={comment} onChange={handleChange} forceSuggestionsAboveCursor allowSpaceInQuery allowSuggestionsAboveCursor>
                        <Mention
                            trigger="@"
                            data={users}
                            //markup="@[__id__]"
                            //style={{ color: 'red' }}
                            appendSpaceOnAdd
                            renderSuggestion={(suggestion, search, highlightedDisplay) => (
                                <Box sx={{ color: 'blue' }}>
                                    {highlightedDisplay}
                                </Box>
                            )}
                        />
                    </MentionsInput>
                    <CustomButton variant="contained" onClick={saveCommentData}><SendIcon /></CustomButton>
                </Box>
            </Box>

        </Drawer>
    )

}

export default React.memo(CommentHistory);