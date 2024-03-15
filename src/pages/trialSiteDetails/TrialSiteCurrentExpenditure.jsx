import React, { useMemo } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Typography, useTheme } from "@mui/material";
import { calculateSingleSiteCost } from "../util";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  options: {
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          max: 1000,
          min: 0,
        },
      },
      y: {
        ticks: {
          beginAtZero: false,
          max: 8,
          min: -3,
        },
      },
    },
  },
};

const TrialSiteCurrentExpenditure = ({ siteDetails }) => {
  let { fixedCost, variableCost, totalCost } =
    calculateSingleSiteCost(siteDetails);
  const data = useMemo(() => {
    let max = fixedCost > variableCost ? fixedCost : variableCost
    let min = fixedCost > variableCost ? variableCost : fixedCost
    return {
      chartData: {
        labels: [""],
        datasets: [
          {
            label: "Total Budget",
            data: [max],
            borderColor: "#FF4000",
            backgroundColor: "#FF4000",
          },
          {
            label: "Current Expenditure",
            data: [min],
            borderColor: '#602EB5',
            backgroundColor: '#602EB5',
          },
        ],
      },
      totalCost,
    };
  });
  return (
    <CustomCard
      title={"Site Current Expenditure"}
      subHeader={"(all costs are in USD)"}
    >
      <Bar options={options} data={data.chartData} />
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
          {data.totalCost ? `$${data.totalCost}` : "$0"}
        </Typography>
      </Box>
    </CustomCard>
  );
};

export default TrialSiteCurrentExpenditure;
