import { Typography, useTheme } from '@mui/material'
import React from 'react'

const TableCellLabel = ({ label }) => {
    const theme = useTheme()
  return (
    <Typography
    variant="subtitle2"
    color="initial"
    sx={{
      color: theme.palette.grey[900],
    }}
  >
    {label}
  </Typography>
  )
}

export default TableCellLabel
