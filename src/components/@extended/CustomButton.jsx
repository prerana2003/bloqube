import { Button, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme, variant }) => ({
  color: variant === "outlined" ? theme.palette.primary.main : theme.palette.common.white,
  backgroundColor: variant === "outlined" ? "transparent" : theme.palette.primary.main,
  border: variant === "outlined" ? `2px solid ${theme.palette.primary.light}` : "none",
  textTransform: "none",
  fontWeight:"600",
  padding:variant === "outlined" ?"8px 28px": "10px 30px",
  "&:hover": {
    backgroundColor: variant === "outlined" ? "transparent" : "#001833",
    border: variant === "outlined" ? `2px solid #001833` : "none",
    color: variant === "outlined" ? "#001833" : theme.palette.common.white,
  },
}));

export default CustomButton;
