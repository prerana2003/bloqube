import { Typography } from "@mui/material";

const Label = ({ children,sx }) => {
  return (
    <Typography
      variant="subtitle2"
      color="initial"
      sx={{ fontWeight: 600, pr: 2,...sx }}
    >
      {children}
    </Typography>
  );
};

export default Label;
