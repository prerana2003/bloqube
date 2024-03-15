import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";

const SiteAccountSection = ({ formik }) => {
  return (
    <Card>
      <CardHeader
        title={"Site Account Details"}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"siteTrialAccountDetail.accountNumber"}
              placeholder={"Enter account number"}
              label={"Bank Account Number"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"siteTrialAccountDetail.accountNumber2"}
              placeholder={"Re-enter account number"}
              label={"Confirm Account Number"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={0} md={4}></Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"siteTrialAccountDetail.routingNumber"}
              placeholder={"Enter routing number"}
              label={"Routing Number"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"siteTrialAccountDetail.abaNumber"}
              placeholder={"Enter ABA number"}
              label={"ABA Number"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"siteTrialAccountDetail.swiftNumber"}
              placeholder={"Enter swift number"}
              label={"Swift Number"}
              formik={formik}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SiteAccountSection;
