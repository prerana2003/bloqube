import {
    Paper,
    Typography,
  } from "@mui/material";
  import React, { useEffect } from "react";

  const GenericNotFound =() => {
    return <Paper sx={{display:'flex',flex:1,alignItems:'center',justifyContent:'center'}}>
        <Typography variant="h1">Page Not Found</Typography>
    </Paper>
  }

  export default GenericNotFound;