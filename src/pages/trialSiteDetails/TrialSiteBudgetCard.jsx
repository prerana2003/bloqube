import React, { useMemo } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import { Box, CardContent, Typography, useTheme } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import _ from "lodash";
import { calculateSingleSiteCost } from "../util";

ChartJS.register(ArcElement, Tooltip, Legend);

const TrialSiteBudgetCard = ({ siteDetails }) => {
  const theme = useTheme()
  const data = useMemo(() => {
    let { fixedCost, variableCost, totalCost } =
      calculateSingleSiteCost(siteDetails);
    return {
      chartData: {
        labels: ["Fixed Cost Budget", "Variable Cost Budget"],
        datasets: [
          {
            label: "Cost",
            data: [variableCost, fixedCost],
            backgroundColor: ["#A5D027", "#004078"],
            borderColor: ["#A5D027", "#004078"],
            borderWidth: 1,
          },
        ],
      },
      totalCost: totalCost,
    };
  }, [siteDetails]);
  return (
    <CustomCard title="Site Budget" subHeader={"(All costs are in USD)"}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pie data={data?.chartData} style={{ height: 400 }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            pt: 2,
          }}
        >
          <Typography variant="h6" color="initial">
            Total Budget
          </Typography>
          <Typography variant="h3" color="initial">
            ${data.totalCost}
          </Typography>
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default TrialSiteBudgetCard;
