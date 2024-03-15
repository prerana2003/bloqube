import {  Snackbar, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import MuiAlert from '@mui/material/Alert';
import { closeMessage } from "../../store/slices/showMessageSlice";


const Alert = React.forwardRef(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

const ShowMessage = () => {
    const dispatch = useDispatch();
    const showMessage = useSelector((state) => state.showMessage.showMessage);
    const message = useSelector((state) => state.showMessage.message);
    const messageSeverity = useSelector((state) => state.showMessage.messageSeverity);

    const handleClose = () => {
        dispatch(closeMessage());
    };
    // anchorOrigin={{ vertical: "top", horizontal: "center" }}

    return (
        <Stack spacing={2} sx={{
            width: '100%', '& .MuiSnackbar-anchorOriginTopRight': {
            top:70
        } }}>
            <Snackbar open={showMessage} autoHideDuration={5000} onClose={handleClose}  anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert onClose={handleClose} severity={messageSeverity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

        </Stack>
    )
}
export default ShowMessage;