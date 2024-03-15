import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import Label from "../../../components/common/Label";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useEffect, useMemo, useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import CommentHistory from "../commentHistory/CommentHistory";
import { extractFilenameFromKey } from "../../../util/util";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DataLabel from "./Fields/DataLabel";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
const FieldDetails = (props) => {
    const { details, answer, handleDownloadSignature, answers,  allAnswers, handleDownload } = props;
    const theme = useTheme()
    const [sign, setSign] = useState(null);
    const [signDate, setSignDate] = useState(null);
    const [critical, setCritical] = useState(false)
    const [openCommentHistory, setOpenCommentHistory] = useState(false);
    const VALID_FIELDS = ['INLINE_TEXT_FIELD', 'DROP_DOWN', 'RADIO_BUTTONS', 'CHECK_BOX', 'SLIDER', 'PHONE_INPUT'];
    useEffect(() => {
        if (details.type && details.type === 'SIGNATURE') {
            let signTime =null;
            if (details.currentDateKey) {
                signTime = props.parentKey
                  ? answers?.[props.parentKey]?.[details.currentDateKey]
                  : answers?.[details.currentDateKey];
              } else {
                signTime = answers?.[props.parentKey]?.[`${details.key}_sign_date`] ?? answers?.[`${details.key}_sign_date`];
              }
              if (signTime) {
                setSignDate(signTime);
              }
            handleDownloadSignature(answer, setSign)
        }
        if (details.criticalKey && details.criticalValue && allAnswers) {
            allAnswers[details.criticalKey] === details.criticalValue && setCritical(true)
        }
    }, [details])
    const [isHovered, setIsHovered] = useState(false);


    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const openHistory = () => {
        setIsHovered(false);
        setOpenCommentHistory(true);
    }
    const onCloseHistory = () => {
        setIsHovered(false);
        setOpenCommentHistory(false)
    }
    return (<Box onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {VALID_FIELDS.includes(details.type) && <Box sx={{ display: "flex", alignItems: 'start' }}>
            <Box sx={{ width: details.tableRow && !details.label ? 0 : '50%' }}>
                {
                    details.tableRow ? <Label>{details.label ? details.label + ':' : '' }</Label> : 
                    <Label>{details.label ? details.label : 'Additional Info'}:</Label>
                }
            </Box>
            <Typography variant="subtitle2" color="initial" sx={{ flexGrow: 1, fontWeight: critical ? 600 : 500, color: critical ? theme.palette.error.light : theme.palette.grey[900] }}>
                {answer}
            </Typography>
            {isHovered && <IconButton color="primary" onClick={openHistory} sx={{
                width: '24px',
                height: '24px'
            }}>
                <CommentIcon />
            </IconButton>}
        </Box>}
        {details.type == "LABEL" && (
            <Box sx={{ display: "flex" }}>
                <Box sx={{ width: '100%' }}><Label sx={{ fontWeight: details.tableRow ? 500 : 600 }}>{details.label}</Label>
                </Box>
            </Box>
        )}
        {details.type == "FILE_UPLOAD" && (
            <Box sx={{ display: "flex", alignItems: 'start' }}>
                <Box sx={{ width: '50%' }}>
                    <Label>{details.label ? details.label : 'Uploaded Doc'}:</Label>
                </Box>
                <Typography variant="subtitle2" color="initial" sx={{ flexGrow: 1, fontWeight: critical ? 600 : 500, color: critical ? theme.palette.error.light : theme.palette.grey[900] }}>
                    {extractFilenameFromKey(answer)}
                </Typography>
                {answer&&<Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: 2, cursor: 'pointer' }} onClick={() => handleDownload(answer, extractFilenameFromKey(answer))}>
                    <FileDownloadOutlinedIcon sx={{ color: "#3C6FEB", marginLeft: 1 }} />
                </Box>}
                {isHovered && <IconButton color="primary" onClick={openHistory} sx={{
                    width: '24px',
                    height: '24px'
                }}>
                    <CommentIcon />
                </IconButton>}
            </Box>
        )}
        {details.type == "CHECK_BOX_GROUP" && (
            <Stack spacing={1}>
                {details?.options?.values.map((_option) =>
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        {
                            answer && answer.includes(_option) ?
                                <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
                        }
                        <Typography>
                            {_option}
                        </Typography>
                    </Box>
                )}
            </Stack>
        )}
        {details.type === "DATA_LABEL" && (
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ width: '50%' }}>
                    <Label>{details.label ? details.label : 'Additional Info'}:</Label>
                </Box>
                <Box sx={{ flexGrow: 1 }}><DataLabel field={details} values={answers} /></Box>
                {isHovered && <IconButton color="primary" onClick={openHistory} sx={{
                    width: '24px',
                    height: '24px'
                }}>
                    <CommentIcon />
                </IconButton>}
            </Box>
        )}
        {details.type === "SIGNATURE" && (
            <Box>
                <Box sx={{ display: 'flex',  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, width:'50%' }}>Place:</Typography>
                    <Tooltip title={`${answers['']?.locationLatitude},${answers['']?.locationLongitude}`}><LocationOnOutlinedIcon sx={{color:theme.palette.primary.main}}/></Tooltip>
                </Box>
                {signDate&&<Box sx={{ display: 'flex', marginY: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, width:'50%' }}>Date:</Typography>
                    <Typography>{signDate}</Typography>
                </Box>}
                <Box sx={{ display: 'flex', border: '1px solid #808080', marginY: 2 }}><Box
                    sx={{
                        //   boxShadow:
                        //     "1px 1px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.10)",
                        height: 80,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {sign && (
                        <img
                            src={sign}
                            width={250}
                            height={70}
                        />
                    )}
                </Box>
                    {isHovered && <IconButton color="primary" onClick={openHistory}>
                        <CommentIcon />
                    </IconButton>}
                </Box>
            </Box>
        )}
        {openCommentHistory && <CommentHistory
            {...props}
            field={details}
            answer={answer}
            onCloseHistory={onCloseHistory}
            open={openCommentHistory} />}
    </Box>)
}

export default FieldDetails;