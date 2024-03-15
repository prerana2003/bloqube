import React from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Box,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import Label from "../../components/common/Label";

const TrialSiteDetailsCard = ({ siteDetails }) => {
  const theme = useTheme();
  return (
    <CustomCard title="Site Details">
      <CardContent>
        <Grid container>
          <Grid item md={6} sm={12}>
            <Box sx={{ display: "flex", py: 1.5 }}>
              <Label>Site Name :</Label>
              <Typography variant="subtitle2" color="initial">
                {siteDetails?.site?.orgname ? siteDetails?.site?.orgname : "--"}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={6} sm={12}>
            <Box
              sx={{
                display: "flex",
                py: 1.5,
              }}
            >
              <Label>Site Address :</Label>
              <Typography variant="subtitle2" color="initial">
                {siteDetails?.site?.address ? siteDetails?.site?.address : "--"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <Grid container>
              <Grid item sm={12} md={6}>
                <Box sx={{ display: "flex", py: 1.5 }}>
                  <Label>FAX :</Label>
                  <Typography variant="subtitle2" color="initial">
                    {siteDetails?.site?.fax ? siteDetails?.site?.fax : "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item sm={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    py: 1.5,
                  }}
                >
                  <Label>Total Number of subjects :</Label>
                  <Typography variant="subtitle2" color="initial">
                    {siteDetails?.totalSubjects
                      ? siteDetails?.totalSubjects
                      : "--"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </CustomCard>
  );
};

export default TrialSiteDetailsCard;
