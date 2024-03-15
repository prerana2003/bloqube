import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { bloqcibeApi, useGetOngoingTrialsQuery, useGetScheduleMutation } from "../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import ScheduleCalendar from "./ScheduleCalendar";
import { getSeriesColor } from "../../util/util";
import { Button, Typography } from "@mui/material";
import RightArrow from "../../components/icons/RightArrow";

const SubjectSchedule = (props) => {
    const { trialId, siteId, subjectId } = useParams();
    const navigate = useNavigate();
    const [visibleDateRange, setVisibleDateRange] = useState({
        start: null,
        end: null,
    });
    const sponsorId = useSelector((state) => state.auth?.sponsorId);
    const [getTrialSiteDetails] =
        bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
    const { data: ongoingTrials } = useGetOngoingTrialsQuery(sponsorId);
    const [calanderEvents, setCalanderEvents] = useState([]);
    const [selectedSite, setSelectedSite] = useState("");
    const [getSchedule] = useGetScheduleMutation();
    useEffect(() => {
        (async () => {
            if (visibleDateRange.start) {
                const _siteList = await getTrialSiteDetails({
                    sponsorId,
                    trialId: trialId,
                });
                if (_siteList?.data) {
                    const _list = _siteList.data.map((_site) => {
                        return { siteName: _site?.site?.orgname, id: _site.siteId };
                    });
                    if (!selectedSite.id || _list.includes((site) => site.id !== selectedSite.id)) {
                        setSelectedSite(_list[0]);
                    }
                    await _fetchEvents(visibleDateRange, _list[0]);
                }
            }
        })()
    }, [visibleDateRange]);
    const _fetchEvents = async (visibleDateRange, _site) => {
        const response = await getSchedule({
            trialId: trialId,
            payload: {
                loggedinUserId: subjectId,
                siteId: siteId,
                startDate: visibleDateRange.start,
                endDate: visibleDateRange.end,
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
            setCalanderEvents(scheduleEvents);
        }
    };
    const _events = useMemo(() => {
        if (calanderEvents) {
            return calanderEvents;
        }
    }, [calanderEvents]);
    return (
        <>
            <Button
                type="text"
                onClick={() => navigate(-1)}
                startIcon={<RightArrow leftArrow />}
            >
                <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
                    Back
                </Typography>
            </Button>
            <ScheduleCalendar
                //handleAddComment={handleAddComment}
                //handleUpdateSchedule={onUpdateSchedule}
                visibleRange={visibleDateRange}
                setVisibleRange={setVisibleDateRange}
                events={_events}
            />
        </>

    )
};

export default SubjectSchedule;