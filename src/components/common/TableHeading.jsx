import { Typography, useTheme } from '@mui/material'
import React from 'react'

const TableHeading = ({ label }) => {
    const theme = useTheme()
  return (
    <Typography
        variant="subtitle1"
        color="initial"
        sx={{
          color: theme.palette.grey.A700,
        }}
      >
        {label}
      </Typography>
  )
}

export default TableHeading
