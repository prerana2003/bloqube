import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  bloqcibeApi,
  useMarkTrialSetupDoneMutation,
} from "../../../store/slices/apiSlice";
import CustomButton from "../../../components/@extended/CustomButton";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateTrialCost,
  numberWithCommas,
  calculateSiteCost,
} from "../../util";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import TableHeading from "../../../components/common/TableHeading";
import TableCellLabel from "../../../components/common/TableCellLabel";
import { openMessage } from "../../../store/slices/showMessageSlice";

const SummaryTab = ({ handleTabChange }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [markTrialSetupDone, { error, data }] = useMarkTrialSetupDoneMutation();
  const [getTrialDetails, { data: trialDetails }] =
    bloqcibeApi.endpoints.getTrialDetails.useLazyQuery();
  const [getTrialSiteDetails, { data: trialSiteData }] =
    bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
  const { trialId } = useParams();
  const [confirmDialog, setConfirmDialog] = useState(false);
  useEffect(() => {
    (async () => {
      if (trialId) {
        await getTrialDetails({
          id: trialId,
          sponsorId: sponsorId,
        });
        await getTrialSiteDetails({ trialId, sponsorId });
      }
    })();
  }, [dispatch]);

  const handleConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    message: "are you sure you want to cancel ?",
    buttonLabel: "OK",
  });

  const handleCancelDialogClose = () => {
    setCancelDialog({ ...cancelDialog, open: false })
  }

  const handleCancel = () => {
    setCancelDialog({ ...cancelDialog, open: false })
    navigate("/")
  }

  const costData = useMemo(() => {
    const { fixedCost, variableCost } = calculateTrialCost(
      trialDetails?.trialData
    );
    return {
      fixedCost,
      variableCost,
      totalTrialBudget: fixedCost + variableCost,
    };
  }, [trialDetails]);

  const siteCost = useMemo(() => {
    return calculateSiteCost(trialSiteData);
  }, [trialSiteData]);

  const onMarkSetupDone = async () => {
    setConfirmDialog(false);
    if (trialId) {
      const result = await markTrialSetupDone({ sponsorId, trialId });
      if (result?.data) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (error?.status == 400) {
      openMessageNotification({
        type: "error",
        message: error?.data?.message,
      });
    }
  }, [error]);

  const openMessageNotification = (message) => {
    dispatch(openMessage({message:message.message,messageSeverity:message.type}))
  };

  const LabelContainer = ({ label, value }) => {
    return (
      <Grid container pb={2}>
        <Grid item xs={4}>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.grey.A700 }}
          >
            {label}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.grey[900] }}
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid container p={3} rowGap={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={"Trial Details"}
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Grid container>
                <Grid item sm={12} md={6} sx={{ pb: 2 }}>
                  <LabelContainer
                    label={"Trial Title"}
                    value={trialDetails?.trialData?.trialTitle}
                  />
                </Grid>
                <Grid item sm={12} md={6} sx={{ pb: 2 }}>
                  <LabelContainer
                    label={"Protocol Number"}
                    value={trialDetails?.trialData?.protocolNumber}
                  />
                </Grid>
                <Grid item sm={12} md={6} sx={{ pb: 2 }}>
                  <LabelContainer
                    label={"Total Number of Subjects"}
                    value={trialDetails?.trialData?.totalSubjectNumber}
                  />
                </Grid>
                <Grid item sm={12} md={12} sx={{ pb: 2 }}>
                  <Typography
                    variant="h6"
                    color="initial"
                    sx={{
                      pb: 2,
                      color: theme.palette.grey.A700,
                    }}
                  >
                    Therapeutic Agents
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <TableHeading label={"Name of Therapeutic Agent"} />
                          </TableCell>
                          <TableCell>
                            <TableHeading
                              label={"Class of Therapeutic Agent"}
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {_.map(
                          trialDetails?.trialData?.theraeupticAgents,
                          (agent) => {
                            return (
                              <TableRow
                                key={agent.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  <TableCellLabel label={agent.agentName} />
                                </TableCell>
                                <TableCell>
                                  <TableCellLabel label={agent.agentClass} />
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* <!-- Study Detail --> */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={"Study Detail"}
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Grid container>
                <Grid item sm={12} md={6} sx={{ pb: 2 }}>
                  <LabelContainer
                    label={"Study Type"}
                    value={trialDetails?.trialData?.studyDetail?.studyType}
                  />
                </Grid>
                <Grid item sm={12} md={6} sx={{ pb: 2 }}>
                  <LabelContainer
                    label={"Number of Treatments"}
                    value={
                      trialDetails?.trialData?.studyDetail?.treatmentNumber
                    }
                  />
                </Grid>
                <Grid item sm={12} md={6} sx={{ pb: 2 }}>
                  <LabelContainer
                    label={"Total Treatment Duration"}
                    value={
                      trialDetails?.trialData?.studyDetail
                        ?.totalTreatmentDuration
                    }
                  />
                </Grid>
                <Grid item sm={12} md={12} sx={{ pb: 2 }}>
                  <Typography
                    variant="h6"
                    color="initial"
                    sx={{
                      pb: 2,
                      color: theme.palette.grey.A700,
                    }}
                  >
                    Investigational Products
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <TableHeading label={" Name of Drug"} />
                          </TableCell>
                          <TableCell>
                            <TableHeading label={"Class of Drug"} />
                          </TableCell>
                          <TableCell>
                            <TableHeading label={"Dosage"} />
                          </TableCell>
                          <TableCell>
                            <TableHeading label={"Route of Administration"} />
                          </TableCell>
                          <TableCell>
                            <TableHeading label={"Duration"} />
                          </TableCell>
                          <TableCell>
                            <TableHeading
                              label={"Frequency of Administration"}
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {_.map(
                          trialDetails?.trialData?.studyDetail?.testArticles,
                          (article) => {
                            let freqOfAdmin = null;
                            switch (article?.frequencyOfAdministration) {
                              case "BD":
                                freqOfAdmin = "Bd (twice a day)"
                                break;
                                case "TDS":
                                  freqOfAdmin = "TDS (Three times a day)"
                                break;
                                case "Qid":
                                  freqOfAdmin = "Qid (Four times a day)"
                                break;
                                case "Eod":
                                  freqOfAdmin = "Eod (Every day / Once a day)"
                                break;
                                case "Q1d":
                                  freqOfAdmin = "Q1d (Every other day)"
                                  break;
                              default:
                                return null;
                            }
                            return (
                              <TableRow
                                key={article.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  <TableCellLabel label={article.drugName} />
                                </TableCell>
                                <TableCell>
                                  <TableCellLabel label={article.drugClass} />
                                </TableCell>
                                <TableCell>
                                  <TableCellLabel label={article.dosage} />
                                </TableCell>
                                <TableCell>
                                  <TableCellLabel
                                    label={article.routesOfAdministration}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TableCellLabel label={article.duration} />
                                </TableCell>
                                <TableCell>
                                  <TableCellLabel
                                    label={freqOfAdmin}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* <!-- Study Detail --> */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={"Budget (All Costs are in USD)"}
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Grid container>
                <Grid item sm={12} md={12} sx={{ pb: 2 }}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{
                        minWidth: 650,
                        borderCollapse: "separate",
                        borderSpacing: "0px 10px",
                      }}
                      aria-label="simple table"
                      rowGap={10}
                    >
                      <TableBody>
                        <TableRow
                          sx={{
                            "td, th": {
                              border: 0,
                              background: "rgb(243,242,242)",
                            },
                          }}
                        >
                          <TableCell>Total Trial Budget</TableCell>
                          <TableCell>
                            ${numberWithCommas(costData?.totalTrialBudget)}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "td, th": {
                              border: 0,
                              background: "rgb(243,242,242)",
                            },
                          }}
                        >
                          <TableCell>Total Site Budget</TableCell>
                          <TableCell>${numberWithCommas(siteCost)}</TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            "td, th": {
                              border: 0,
                              background: "rgb(252,241,210)",
                            },
                          }}
                        >
                          <TableCell>
                            Total Trial Budget ( Trial + Sites )
                          </TableCell>
                          <TableCell>
                            $
                            {numberWithCommas(
                              costData?.totalTrialBudget + siteCost
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="outlined"
            onClick={() => setCancelDialog({ ...cancelDialog, open: true })}
            color="primary"
            size="large"
            sx={{ padding: "8px 30px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <CustomButton
            onClick={() => setConfirmDialog(true)}
            style={{ marginLeft: 15 }}
          >
            Create Trial
          </CustomButton>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={confirmDialog}
        buttonLabel={"Create"}
        message={"Do you want to Create trial?"}
        handleClose={handleConfirmDialogClose}
        handleConfirm={onMarkSetupDone}
      />

      <ConfirmationDialog
        open={cancelDialog.open}
        buttonLabel={cancelDialog.buttonLabel}
        message={cancelDialog.message}
        handleClose={handleCancelDialogClose}
        handleConfirm={handleCancel}
      />
    </>
  );
};

export default SummaryTab;
