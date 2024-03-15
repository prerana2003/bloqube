import { Box, Typography } from "@mui/material";
import CustomButton from "../../../components/@extended/CustomButton";

const ButtonField = (props) => {
    const { label, readOnly } = props;
    return (<Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <CustomButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={readOnly}
        >
            {label}
        </CustomButton>
    </Box>);
}

export default ButtonField;