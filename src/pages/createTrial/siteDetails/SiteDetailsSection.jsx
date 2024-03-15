import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";
import { getIn } from "formik";
import { useGetSiteBasicDetailsQuery } from "../../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import AddSite from "./AddSite";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const SiteDetailsSection = ({
  formik,
  trialSiteData,
  selectedSite,
  openMessageNotification,
}) => {
  const theme = useTheme();
  const sponsorId = useSelector((state) => state.auth.sponsorId);

  const { data: siteDetails } = useGetSiteBasicDetailsQuery({
    sponsorId: sponsorId,
  });
  const [siteDetail, setSiteDetail] = useState({
    siteNumber: "",
    Fax: "",
    address: "",
  });
  const [showCreateSite, setshowCreateSite] = useState(false);

  const handleCreateSiteClose = () => {
    setshowCreateSite(false);
  };

  useEffect(() => {
    if (siteDetails) {
      siteDetails.map((site) => {
        if (site.id === formik.values.siteId) {
          setSiteDetail((prevState) => ({
            ...prevState,
            Fax: site.fax,
            address: site.address,
          }));
        }
      });
    }
  }, [formik.values.siteId, siteDetails]);

  return (
    <>
      <Card>
        <CardHeader
          title={"Site Details"}
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Grid container>
            <Grid item sm={12} md={5} sx={{ py: 1 }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                    sx={{ pb: 0.5 }}
                  >
                    Site Name
                  </Typography>
                  <FormControl
                    sx={{ width: "98%" }}
                    error={Boolean(getIn(formik.errors, "siteId"))}
                  >
                    <Select
                      name={"siteId"}
                      value={getIn(formik.values, "siteId")}
                      onChange={formik.handleChange}
                      fullWidth={true}
                      placeholder="Select Site"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      input={<OutlinedInput size="small" />}
                    >
                      <MenuItem disabled value="">
                        <em>Select Site</em>
                      </MenuItem>
                      {siteDetails &&
                        siteDetails
                          .filter((_siteDetail) => {
                            if (!trialSiteData) return true;
                            if (selectedSite?.siteId === _siteDetail.id) {
                              return true;
                            }
                            const _rec = trialSiteData.find(
                              (_siteData) => _siteData.siteId == _siteDetail.id
                            );
                            if (_rec) {
                              return false;
                            }
                            return true;
                          })
                          .map((option) => {
                            return (
                              <MenuItem key={option.id} value={option.id}>
                                {option.orgname}
                              </MenuItem>
                            );
                          })}
                    </Select>
                    <FormHelperText>
                      {getIn(formik.touched, "siteId") &&
                        getIn(formik.errors, "siteId")}
                    </FormHelperText>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    pt: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    aria-label="Add"
                    onClick={() => setshowCreateSite(true)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            <Grid item sm={0} md={1} />
            <Grid item sm={12} md={5} sx={{ py: 1 }}>
              <TextFieldContainer
                name={"totalSubjects"}
                placeholder={"Enter number of subjects"}
                label={"Number of Subjects"}
                formik={formik}
                type={"number"}
              />
            </Grid>
            <Grid item sm={0} md={1} />

            <Grid item sm={12} md={5} sx={{ display: "flex", py: 1 }}>
              <Grid item sm={6}>
                <Box sx={{ pb: 0.5 }}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Site Number
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="initial"
                    sx={{ py: 1 }}
                  >
                    {siteDetail.siteNumber ? siteDetail.siteNumber : "NA"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item sm={6}>
                <Box sx={{ pb: 0.5 }}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Fax
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="initial"
                    sx={{ py: 1 }}
                  >
                    {siteDetail.Fax ? siteDetail.Fax : "NA"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item sm={0} md={1} />
            <Grid item sm={12} md={5} sx={{ py: 1 }}>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.secondary}
                sx={{ pb: 0.5 }}
              >
                Site Address
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                type={"text"}
                value={siteDetail.address}
                placeholder={"Site Address"}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <AddSite
        open={showCreateSite}
        handleClose={handleCreateSiteClose}
        openMessageNotification={openMessageNotification}
      />
    </>
  );
};

export default SiteDetailsSection;
