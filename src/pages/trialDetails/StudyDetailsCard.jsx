import React from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Box,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../components/@extended/CustomTable";
import { useSelector } from "react-redux";

const Label = ({ children }) => {
  return (
    <Typography
      variant="subtitle2"
      color="initial"
      sx={{ fontWeight: 600, pr: 2 }}
    >
      {children}
    </Typography>
  );
};

const columns = [
  {
    id: "drugName",
    label: `Name of Drug`,
    minWidth: 200,
    align: "left",
  },
  {
    id: "drugClass",
    label: "Class of Drug",
    minWidth: 200,
    align: "center",
  },
  {
    id: "dosage",
    label: "Dosage",
    minWidth: 170,
    align: "center",
  },
  {
    id: "routesOfAdministration",
    label: "Route",
    minWidth: 200,
    align: "center",
  },
  { id: "duration", label: "Duration", minWidth: 170, align: "center" },
  {
    id: "frequencyOfAdministration",
    label: "Frequency",
    minWidth: 100,
    align: "center",
  },
];

const StudyDetailsCard = () => {
  const theme = useTheme();
  const trialDetail = useSelector((state) => state.trial.currentTrial);
  return (
    <CustomCard title="Study Details">
      <Grid container>
        <Grid item md={6} sm={12}>
          <Box sx={{ display: "flex", pb: 1.5 }}>
            <Label> Study Type :</Label>

            <Typography variant="subtitle2" color="initial" pl={2}>
              {trialDetail?.studyDetail?.studyType}
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Grid item md={6} sm={12}>
          <Box sx={{ display: "flex", pb: 1.5 }}>
            <Label>Number of Treatments :</Label>
            <Typography variant="subtitle2" color="initial">
              {trialDetail?.studyDetail?.treatmentNumber}
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Grid item md={12} sm={12}>
          <Box sx={{ display: "flex", py: 1.5 }}>
            <Label>Total treatment Duration :</Label>
            <Typography variant="subtitle2" color="initial">
              {trialDetail?.studyDetail?.totalTreatmentDuration} Months
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Grid item md={12} sm={12}>
          <Box sx={{ display: "flex", py: 1.5, flexDirection: "column" }}>
            <Typography
              variant="subtitle1"
              color="initial"
              sx={{ pt: 1, pb: 1, fontWeight: 600 }}
            >
             Investigational Products
            </Typography>
            <TableContainer
              sx={{
                maxHeight: 250,
                border: `1px ${theme.palette.grey[100]} solid `,
              }}
            >
              <Table>
                <CustomTableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <CustomTableHeadCell key={column.id} align={column.align}>
                        {column.label}
                      </CustomTableHeadCell>
                    ))}
                  </TableRow>
                </CustomTableHead>
                <TableBody>
                  {trialDetail?.studyDetail?.testArticles.map((article) => {
                    return (
                      <TableRow tabIndex={-1} key={article.id}>
                        {columns.map((column) => {
                          const value = article[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default StudyDetailsCard;
