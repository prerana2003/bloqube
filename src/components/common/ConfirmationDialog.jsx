import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmationDialog = (props) => {
  const { open, handleClose, handleConfirm, message, buttonLabel } = props;
  return (
    <Dialog open={open}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" color="initial">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>{buttonLabel}</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
