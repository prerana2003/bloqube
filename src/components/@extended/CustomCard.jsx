import { Card, useTheme, Box, CardHeader, CardContent } from "@mui/material";
import React from "react";

const CustomCard = ({ children, title, subHeader, sx ,action}) => {
  const theme = useTheme();
  return (
    <Card>
      <Box
        sx={{
          width: "100%",
          height: 4,
          backgroundColor: theme.palette.primary.main,
        }}
      />
      <CardHeader
        title={title}
        subheader={subHeader}
        action={action}
        titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
        sx={{ backgroundColor: theme.palette.grey[50] }}
      />
      <CardContent sx={sx}>{children}</CardContent>
    </Card>
  );
};

export default CustomCard;
