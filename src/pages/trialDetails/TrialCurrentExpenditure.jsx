import React, { useMemo } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import { Box, CardContent, Typography, useTheme } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrialCurrentExpenditureCard = ({details, calculateFunction, title}) => {
  const theme = useTheme();
  const data1 = useMemo(() => {
    const { fixedCost, variableCost } = calculateFunction(details);
    
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
      totalCost: fixedCost + variableCost,
    };
  }, [details, theme]);

  const options = {
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
  return (
    <CustomCard
      title={title+" Current Expenditure"}
      subHeader={"(All costs are in USD)"}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Bar options={options} data={data1.chartData} />
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
            {data1.totalCost ? `$${data1.totalCost}` : "$31"}
          </Typography>
        </Box>
      </CardContent>
    </CustomCard>
  );
};

export default TrialCurrentExpenditureCard;
