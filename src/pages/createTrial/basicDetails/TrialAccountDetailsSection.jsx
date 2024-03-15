import React from "react";
import { Card, CardContent, CardHeader, Grid, Button } from "@mui/material";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";
import { useUpdateTrialBankDetailMutation } from "../../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/@extended/CustomButton";

const TrialAccountDetailsSection = ({ formik, trialId }) => {
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [updateTrialBankDetail] = useUpdateTrialBankDetailMutation();
  const handleUpdate = () => {
    formik.handleSubmit();
    if (formik.isValid) {
      let bankDetails = formik.values.bankDetail;
      updateTrialBankDetail({ sponsorId, trialId, bankDetails: bankDetails });
    }
  };
  return (
    <Card>
      <CardHeader
        title={"Trial Account Details"}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"bankDetail.accountNumber"}
              placeholder={"Enter account number"}
              label={"Bank Account Number"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"bankDetail.accountNumber2"}
              placeholder={"Re-enter account number"}
              label={"Confirm Account Number"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={0} md={4}></Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"bankDetail.routingNumber"}
              placeholder={"Enter routing number"}
              label={"Routing Number"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"bankDetail.abaNumber"}
              placeholder={"Enter ABA number"}
              label={"ABA Number"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"bankDetail.swiftNumber"}
              placeholder={"Enter swift number"}
              label={"Swift Number"}
              formik={formik}
            />
          </Grid>
          {formik.values.bankDetail.id && (
            <Grid
              item
              sm={12}
              md={12}
              sx={{ py: 2, display: "flex", justifyContent: "flex-end", pr: 5 }}
            >
              <CustomButton
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUpdate}
                sx={{ color: "white" }}
              >
                Update
              </CustomButton>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrialAccountDetailsSection;
