import {
    Avatar,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    ListItem,
    ListItemText,
    List,
    TextField,
    Typography,
    useTheme,
    Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import dayjs from "dayjs";
import DateTimeField from "./FormikDateField";
import moment from "moment";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import { useEffect, useMemo, useState } from "react";
import { Edit } from "@mui/icons-material";
import { bloqcibeApi } from "../../store/slices/apiSlice";
import FormikMultiSelect from "./FormikMultiselect";
import _ from "lodash";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const SubjectEvents = ({
    handleClose,
    open,
    event
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const [getTrialSiteMembers] =
        bloqcibeApi.endpoints.getTrialSiteMembers.useLazyQuery();
    const [comment, setComment] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [userList, setUserList] = useState([]);
    const sponsorId = useSelector((state) => state.auth.sponsorId);

    const onCloseModal = () => {
        handleClose();
    };

    useEffect(() => {
        (async () => {
            const _userList = await getTrialSiteMembers({
                sponsorId,
                trialId: event.trial.id,
                siteId: event.site.id,
            });
            if (_userList?.data) {
                const _list = _userList.data.map((_user) => ({
                    label: `${_user.user.firstName} ${_user.user.lastName}`,
                    value: _user.userId,
                    role: _user.role,
                }));
                setUserList(_list);
            }
        })();
    }, [openEdit]);

    const participantIds = useMemo(() => {
        if (event) {
            return _.filter(
                event.users,
                (participant) => participant.role !== "subject"
            ).map((user) => user.userId);
        }
    }, [event]);

    const subjectParticipant = useMemo(() => {
        return _.find(event.users, (user) => user.role === "subject");
    }, [event]);

    const adminParticipant = useMemo(() => {
        return _.filter(event.users, (user) => user.role !== "subject");
    }, [event]);

    return (
        <>
            <Dialog scroll={"paper"} open={open} onClose={onCloseModal}>
                <DialogTitle>{event.title}</DialogTitle>
                <DialogContent>
                    <Box>
                        <Box>
                            <Typography color={'grey'}>Trial</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{event.trial.protocolNumber}</Typography>
                        </Box>
                        <Divider sx={{ marginY:1 }}/>
                        <Box>
                            <Typography color={'grey'}>Site</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{event.site?.siteName}</Typography>
                        </Box>
                        <Divider sx={{ marginY:1 }}/>
                        <Box>
                            <Typography color={'grey'}>Users</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: 16 }}>
                                {adminParticipant &&
                                    adminParticipant
                                        .map((participant) => {
                                            return `${participant.user?.firstName} ${participant.user?.lastName}`;
                                        })
                                        .join(", ")}
                            </Typography>
                        </Box>
                        <Divider sx={{ marginY:1 }}/>
                        <Box>
                            <Typography color={'grey'}>Start Date Time</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{dayjs(event.start).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                        </Box>
                        <Divider sx={{ marginY:1 }}/>
                        <Box>
                            <Typography color={'grey'}>End Date Time</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{dayjs(event.end).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SubjectEvents;
