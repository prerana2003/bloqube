import { Box, Typography } from "@mui/material";

const HtmlContentField = (props) => {
    const { label, defaultValue } = props;
    return (<Box sx={{ display:'flex', flexDirection:'column', rowGap:label ? 2 : 0 }}>
    <Typography variant="h6">{label}</Typography>
    <Typography color="text" sx={{ fontSize: 16 }} dangerouslySetInnerHTML={{ __html: defaultValue }} />
    </Box>);
}

export default HtmlContentField;