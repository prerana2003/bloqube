import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Autocomplete,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generateColorHex } from "../util";

const ScheduleFilter = (props) => {
  const {
    trials,
    selectedTrialId,
    setSelectedTrialId,
    selectedSite,
    setSelectedSite,
    siteList,
    userList,
    selectedUserList,
    setSelectedUserList,
    subjectList,
  } = props;
  const [openTrial, setOpenTrial] = useState(false);
  const [openSite, setOpenSite] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [subject, setSubject] = useState({ subjectName: "", id: "" });
  const { state } = useLocation()

  useEffect(() => {
    if (trials) {
      setOpenTrial(true);
    }
    if (selectedSite) {
      setOpenSite(true);
      setOpenUser(true);
    }
  }, [trials, selectedSite]);

  useEffect(() => {
    if (selectedUserList.length !== 0 && subjectList.length !== 0) {
      const _sub = _.find(subjectList, (sub) =>
        _.includes(selectedUserList, sub.id)
      );
      setSubject(_sub);
    }

    // return dispatch(setFilter({trialId:'',siteId:'',users:[]}))
  }, [subjectList, selectedUserList]);

  useEffect(() => {
    if (state && siteList) {

      const subjectParticipant = state.schedule.participants.find((user)=> user.role === "subject");

      if (selectedTrialId !== state.trialId) {
        setSelectedTrialId(state.trialId);
      }

      if (siteList.length !==0 && selectedSite.id !== state.siteId) {
        let _site = _.find(siteList, (site) => site.id === Number(state.siteId));
        if (_site) setSelectedSite(_site);
      }

      if (
        selectedUserList &&
        subjectParticipant &&
        !selectedUserList.includes(subjectParticipant?.userId)
      ) {
        setSelectedUserList([subjectParticipant?.userId]);
        setSubject({
          subjectName: subjectParticipant?.user.firstName,
          id: subjectParticipant?.userId,
        });
      }

    }
  }, [state, siteList, selectedUserList]);

  const _onUserCheckboxChange = (event, id) => {
    let _arr = selectedUserList;
    if (event) {
      _arr.push(id);
    } else {
      _arr = selectedUserList.filter((_id) => _id !== id);
    }
    setSelectedUserList([..._arr]);
  };

  const handleSiteDropdownChange = (siteId) => {
    if (siteList) {
      const site = _.find(siteList, (site) => site.id === siteId);
      setSelectedSite(site);
    }
  };

  const _onSubjectDropdownChange = (_, value) => {
    if (value && subject.id !== "") {
      let _arr = selectedUserList;
      _arr = selectedUserList.filter((_id) => _id !== subject.id);
      setSelectedUserList([..._arr, value.id]);
      setSubject(value);
    } else if (value) {
      _onUserCheckboxChange(true, value.id);
      setSubject(value);
    } else {
      _onUserCheckboxChange(false, subject?.id);
      setSubject({ subjectName: "", id: "" });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#E9E9E9",
          padding: 2,
          height: "calc(100vh - 250px)",
          borderRadius: 1,
          overflow: "scroll",
        }}
      >
        <Box>
          <ListItem
            button
            onClick={() => setOpenTrial(!openTrial)}
            sx={{ paddingX: 1 }}
          >
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: "grey" }}>
                  Trials
                </Typography>
              }
            />
            {openTrial ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openTrial} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: 1 }}>
              <Select
                displayEmpty
                fullWidth
                value={selectedTrialId}
                onChange={(e) => setSelectedTrialId(e.target.value)}
              >
                <MenuItem value="">
                  <em style={{ color: "#aaa", fontStyle: "normal" }}>
                    Select Trial
                  </em>
                </MenuItem>
                {trials &&
                  trials.map((trial) => (
                    <MenuItem value={trial.id} key={trial.id}>
                      {trial.protocolNumber}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </Collapse>
        </Box>
        <Box>
          <ListItem
            button
            onClick={() => setOpenSite(!openSite)}
            sx={{ paddingX: 1 }}
          >
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: "grey" }}>
                  Sites
                </Typography>
              }
            />
            {openSite ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSite} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: 1 }}>
              <Select
                displayEmpty
                fullWidth
                value={selectedSite?.id}
                onChange={(e) => handleSiteDropdownChange(e.target.value)}
              >
                <MenuItem value="">
                  <em style={{ color: "#aaa", fontStyle: "normal" }}>
                    Select Site
                  </em>
                </MenuItem>
                {siteList &&
                  siteList.map((_site) => (
                    <MenuItem value={_site.id} key={_site.id}>
                      {_site.siteName}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          </Collapse>
        </Box>
        <Box>
          <ListItem
            button
            onClick={() => setOpenUser(!openUser)}
            sx={{ paddingX: 1 }}
          >
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: "grey" }}>
                  Users
                </Typography>
              }
            />
            {openUser ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openUser} timeout="auto" unmountOnExit>
            <FormGroup sx={{ paddingLeft: 1 }}>
              {userList &&
                userList.map((user, index) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        key={index}
                        checked={selectedUserList.includes(user.value)}
                        value={selectedUserList.includes(user.value)}
                        onChange={(e) =>
                          _onUserCheckboxChange(e.target.checked, user.value)
                        }
                        sx={{
                          color: generateColorHex(user.label),
                          "&.Mui-checked": {
                            color: generateColorHex(user.label),
                          },
                        }}
                      />
                    }
                    label={user.label}
                  />
                ))}
            </FormGroup>
          </Collapse>
        </Box>
        <Box sx={{ paddingX: 1 }}>
          <Typography variant="caption" sx={{ color: "grey" }}>
            Subjects
          </Typography>
          <Box sx={{ padding: 2, paddingLeft: 1 }}>
            <Autocomplete
              size="small"
              options={subjectList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Enter subject name.." />
              )}
              value={subject && subject}
              onChange={_onSubjectDropdownChange}
              getOptionLabel={(option) => option.subjectName}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleFilter;
