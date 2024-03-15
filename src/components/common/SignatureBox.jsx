import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import CloseIcon from "@mui/icons-material/Close";
import { useResponsive } from "../../hooks/ResponsiveProvider";
const SignatureBox = (props) => {
  const { onCloseModal, open, handleClose, saveSign } = props;
  const {isSmallScreen} = useResponsive();
  const padRef = useRef(null);
  const theme = useTheme();

  const handleGetCanvas = useCallback(() => {
    if (padRef.current.isEmpty()) {
      return saveSign(null);
    } else {
      const canvas = padRef?.current?.getTrimmedCanvas();
      const data = canvas?.toDataURL();
      saveSign(data);
    }
  }, []);
  const handleClearCanvas = useCallback(() => {
    padRef?.current?.clear();
  }, []);

  return (
    <Dialog
      //fullWidth={true}
      maxWidth={"lg"}
      PaperProps={{ sx: { minHeight: "50%" } }}
      scroll={"paper"}
      open={open}
      onClose={onCloseModal}
    >
      <DialogTitle>Sign Here</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Paper sx={{ width: isSmallScreen?260:500, marginTop: 2 }}>
          <Box
            sx={{
              borderRadius: 3,
              boxShadow:
                "1px 1px 4px 0 rgba(0, 0, 0, 0.2), 0 1px 8px 0 rgba(0, 0, 0, 0.10)",
            }}
          >
            <SignatureCanvas
              ref={padRef}
              canvasProps={{
                //style: { width: "100%", height: 200 },
                width: isSmallScreen?260:500, height: isSmallScreen?150:250
              }}
            />
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearCanvas}>Clear</Button>
        <Button onClick={handleGetCanvas}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignatureBox;
