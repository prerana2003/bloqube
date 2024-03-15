import { Box, Card, CardContent, CardHeader, Grid, Typography, useTheme } from "@mui/material";
import FieldDetails from "./FieldDetails";
import CustomCard from "../../../components/@extended/CustomCard";
import FieldList from "./FieldList";
import { IconButton, Collapse } from "@mui/material"
import { ArrowDropDown, ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { useState } from "react";

const CategoryDetails = (props) => {
    const [expand, setExpand] = useState(false)
    const { details } = props;
    const theme = useTheme();
    return (<Box>
        {/* <Card sx={{ flexGrow: 1
         }}>
            <Box
                sx={{
                    width: "100%",
                    height: 4,
                    backgroundColor: theme.palette.primary.main,
                }}
            />
            <CardHeader
                title={details.label}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
                sx={{ backgroundColor: theme.palette.grey[50] }}
                action={<IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ArrowUpward /> : <ArrowDownward/> }
              </IconButton>}
            />
            <CardContent sx={{
                paddingBottom: '0 !important',
                paddingTop: 4
            }}>
                <Collapse in={expand}>
                <Grid container spacing={4}>
                    {details && details.fields &&
                        <FieldList {...props} fieldArr={details.fields} parentKey={details.key} categoryKey={details.key}/>
                    }
                </Grid>
                </Collapse>
            </CardContent>
        </Card> */}
        <Box sx={{ marginY: 4 }}><Typography sx={{ fontSize: 22, fontWeight: 400 }}>{details.label}</Typography></Box>
        <Grid container spacing={4} sx={{ paddingX:2 }}>
            {details && details.fields &&
                <FieldList {...props} fieldArr={details.fields} parentKey={details.key} categoryKey={details.key} />
            }
        </Grid>
    </Box>)
}

export default CategoryDetails;