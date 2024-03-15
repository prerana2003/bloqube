import { Box, Typography } from "@mui/material";

const LabelField = (props) => {
    const { label, textFontWeight, verticalAlignCenter } = props;
    return (<Box sx={{ 
        ...(verticalAlignCenter && {
            height: '100%',
            display:'flex',
            alignItems:'center'
          }),
     }}>
        <Typography variant="subtitle1" color="initial" sx={{ fontWeight: textFontWeight ? textFontWeight : 400 }}>{label}</Typography>
    </Box>);
}

export default LabelField;