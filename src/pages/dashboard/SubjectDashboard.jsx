import { Avatar, Box, Card, CardActionArea, CardContent, CardHeader, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";
import trialImg from '../../components/Logo/trialImage.svg';
import informConsentImg from '../../components/Logo/informCosent.jpg';
import visitImg from '../../components/Logo/visit.png';
import hippaImg from '../../components/Logo/hippaConsent.png';
import { selectCurrentUser } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { bloqcibeApi, useGetOngoingTrialsQuery, useGetScheduleMutation } from "../../store/slices/apiSlice";
import moment from "moment";
import { subjectDashboardDetails } from "../../store/slices/subjectSlice";
import { getSeriesColor } from "../../util/util";

const SubjectDashboard = (props) => {
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const sponsorId = useSelector((state) => state.auth?.sponsorId);
    const subjectDashboardInfo = useSelector(subjectDashboardDetails);
    const loggedinUserId = useSelector((state) => state.userDetails?.loggedInUser?.id)
    const [getTrialSiteDetails] =
        bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
    const { data: ongoingTrials } = useGetOngoingTrialsQuery(sponsorId);
    const trialId = subjectDashboardInfo?.crfDetail.trialId;
    const trialSiteId = subjectDashboardInfo?.siteTrialDetail.id;
    const subjectMasterId = subjectDashboardInfo?.crfDetail.subjectMasterId;
    const siteId = subjectDashboardInfo?.crfDetail.siteId;
    const [upcomingEvent, setUpcomingEvent] = useState();
    const [getSchedule] = useGetScheduleMutation();
    const [getSubjectDashboardDetail, { data: subjectData, isLoading }] =
        bloqcibeApi.endpoints.getSubjectDashboardDetail.useLazyQuery();
    useEffect(() => {
        if (user && user?.details[0][0]['userId']) {
            getSubjectDashboardDetail(user.details[0][0]['userId']);
        }
    }, [user])
    useEffect(() => {
        (async () => {
            if (sponsorId && loggedinUserId && siteId && !upcomingEvent) {
                const _siteList = await getTrialSiteDetails({
                    sponsorId,
                    trialId: trialId,
                }); 
                if (_siteList?.data) {
                    const _list = _siteList.data.map((_site) => {
                        return { siteName: _site?.site?.orgname, id: _site.siteId };
                    });

                    await _fetchEvents(_list[0]);
                }
            }
        })()
    }, [sponsorId, loggedinUserId, siteId])
    const _fetchEvents = async (_site) => {
        // Current date
        const startDate = moment();
        // Adding 6 months to the current date
        const endDate = moment().add(6, 'months');
        // Formatting the dates
        const formattedStartDate = startDate.format('MM-DD-YYYYTHH:mm');
        const formattedEndDate = endDate.format('MM-DD-YYYYTHH:mm');
        const response = await getSchedule({
            trialId: trialId,
            payload: {
                loggedinUserId,
                siteId: siteId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            },
        });
        if (response.data) {
            const scheduleEvents = response.data.map((_event, index) => {
                const trial = ongoingTrials.find(
                    (_trial) => _trial.id === _event.trialId
                );
                return {
                    scheduleId: _event.id,
                    start: moment(_event.startDate).toDate(),
                    end: moment(_event.endDate).toDate(),
                    title: _event.title,
                    users: _event.participants,
                    color: getSeriesColor(index),
                    comments: _event.comments,
                    trial,
                    site: _site,
                };
            });
            const now = moment();
            // Filter dates that are in the future
            const futureDates = scheduleEvents.filter(ev => moment(ev.start).isAfter(now));
            // Sort the future dates to find the earliest
            futureDates.sort((a, b) => moment(a.start).diff(moment(b.start)));
            setUpcomingEvent(futureDates[0]);
        }
    };
    const openStepForm = (stepKey) => {
        navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/${stepKey}/${subjectMasterId}`)
    };
    const openSubjectSchedule = () => {
        navigate(`/trial/${trialId}/site/${siteId}/subject/${loggedinUserId}/schedule`)
    }
    return <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, backgroundColor: '#F1F2F5' }}>
        <Card sx={{ borderRadius: 4 }}>
            <CardHeader
                title={'Your Trial'}
                //subheader={subHeader}
                //action={action}
                titleTypographyProps={{ variant: "h6", fontWeight: 600, textAlign: 'center' }}
            //sx={{ backgroundColor: theme.palette.grey[50] }}
            />
            <CardContent sx={{ paddingTop: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: 2 }}>
                    <Avatar
                        //alt="Remy Sharp"
                        src={trialImg}
                        sx={{ width: 80, height: 80 }} // Customize the size as needed
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', color: '#2196f3' }}>
                        {subjectData?.trialDetail.trialTitle}
                    </Typography>
                    <Typography sx={{ color: 'grey' }}>
                        Protocol Number: <span style={{ color: '#000', fontWeight: 600 }}>{subjectData?.trialDetail.protocolNumber}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', columnGap: 1 }}>
                        <Typography sx={{ color: 'grey' }}>
                            You enrolled on
                        </Typography>
                        <Typography sx={{ color: '#000', fontWeight: 600 }}>
                            {subjectData?.trialDetail.enrollmentDate ? moment(subjectData?.trialDetail.enrollmentDate).format('DD/MM/YYYY') : ''}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
        <Card sx={{ borderRadius: 4 }}>
            <CardHeader
                title={'Informed Consent'}
                //subheader={subHeader}
                //action={action}
                titleTypographyProps={{ variant: "h6", fontWeight: 600, textAlign: 'center' }}
            //sx={{ backgroundColor: theme.palette.grey[50] }}
            />
            <CardActionArea onClick={() => openStepForm('IC')}>
                <CardContent sx={{ paddingTop: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: 2 }}>
                        <Avatar
                            //alt="Remy Sharp"
                            src={informConsentImg}
                            sx={{ width: 100, height: 100 }} // Customize the size as needed
                        />
                        {subjectData?.icDetail.status == 'Pending' ? <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, alignItems: 'center' }}>
                            <Typography sx={{ color: 'red' }}>
                                e-consent is pending
                            </Typography>
                            <Typography sx={{
                                color: '#004ad4', "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}>
                                Click here to submit Informed Consent
                            </Typography>
                        </Box> :
                            subjectData?.icDetail.status == 'Verification_Pending' ? <Box sx={{ display: 'flex', columnGap: 1 }}>
                                <Typography sx={{ color: '#FC9732' }}>
                                    e-consent verification is pending
                                </Typography>
                            </Box> : <Box sx={{ display: 'flex', columnGap: 1 }}>
                                <Typography sx={{ color: green[700] }}>
                                    e-consent is completed on
                                </Typography>
                                <Typography sx={{ color: '#000', fontWeight: 600 }}>
                                    {moment(subjectData?.icDetail.completedAt).format('DD/MM/YYYY')}
                                </Typography>
                            </Box>}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
        <Card sx={{ borderRadius: 4 }}>
            <CardHeader
                title={'HIPAA Consent'}
                //subheader={subHeader}
                //action={action}
                titleTypographyProps={{ variant: "h6", fontWeight: 600, textAlign: 'center' }}
            //sx={{ backgroundColor: theme.palette.grey[50] }}
            />
            <CardActionArea onClick={() => openStepForm('HC')}>
                <CardContent sx={{ paddingTop: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: 2 }}>
                        <Avatar
                            //alt="Remy Sharp"
                            src={hippaImg}
                            sx={{ width: 100, height: 100 }} // Customize the size as needed
                        />
                        {subjectData?.hcDetail.status == 'Pending' ? <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, alignItems: 'center' }}>
                            <Typography sx={{ color: 'red' }}>
                                HIPAA Consent is pending
                            </Typography>
                            <Typography sx={{
                                color: '#004ad4', "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}>
                                Click here to submit HIPAA Consent
                            </Typography>
                        </Box> : subjectData?.hcDetail.status == 'Verification_Pending' ? <Box sx={{ display: 'flex', columnGap: 1 }}>
                            <Typography sx={{ color: '#FC9732' }}>
                                HIPAA Consent verification is pending
                            </Typography>
                        </Box> :
                            <Box sx={{ display: 'flex', columnGap: 1 }}>
                                <Typography sx={{ color: green[700] }}>
                                    HIPAA Consent is completed on
                                </Typography>
                                <Typography sx={{ color: '#000', fontWeight: 600 }}>
                                    {moment(subjectData?.hcDetail.completedAt).format('DD/MM/YYYY')}
                                </Typography>
                            </Box>}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
        <Card sx={{ borderRadius: 4 }}>
            <CardHeader
                title={'Upcoming Visit'}
                //subheader={subHeader}
                //action={action}
                titleTypographyProps={{ variant: "h6", fontWeight: 600, textAlign: 'center' }}
            //sx={{ backgroundColor: theme.palette.grey[50] }}
            />
            <CardContent sx={{ paddingTop: 0 }} onClick={() => openSubjectSchedule()}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: 2 }}>
                    <Avatar
                        //alt="Remy Sharp"
                        src={visitImg}
                        sx={{ width: 80, height: 80 }} // Customize the size as needed
                    />
                    {upcomingEvent ?
                        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', columnGap: 1 }}>
                                <Typography sx={{ color: 'grey' }}>
                                    Scheduled on
                                </Typography>
                                <Typography sx={{ color: '#000', fontWeight: 600 }}>
                                    {upcomingEvent && moment(upcomingEvent.start).format('DD/MM/YYYY HH:mm:ss')}
                                </Typography>
                            </Box>
                            <Typography sx={{
                                color: '#004ad4', "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}>
                                Click here to see more details
                            </Typography>
                        </Box> :
                        <Box>
                            <Typography sx={{ color: 'grey' }}>
                                Your visits are not scheduled yet.
                            </Typography>
                        </Box>
                    }

                </Box>
            </CardContent>
        </Card>
    </Box>
}

export default SubjectDashboard;