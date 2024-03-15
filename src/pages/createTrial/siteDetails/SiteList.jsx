import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";
import { getIn } from "formik";
import { bloqcibeApi, useGetSiteBasicDetailsQuery } from "../../../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/@extended/CustomButton";

const siteAdmin = [
    {
        label: "Admin 1",
        value: "admin1",
    },
    {
        label: "Admin 2",
        value: "admin2",
    },
    {
        label: "Admin3",
        value: "admin3",
    },
];

const SiteList = ({ trialSiteData, openSiteForm, openMemberDetails }) => {
    const theme = useTheme();
    
    return (
        <Card>
            <CardHeader
                title={"Site Details"}
                titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CustomButton variant="contained" onClick={() => openSiteForm()}>Add New Site</CustomButton>
                </Box>
                {
                    (!trialSiteData || trialSiteData.length < 1) ? <Box sx={{ textAlign: 'center', paddingY: 10 }}><Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                        sx={{ pb: 0.5 }}
                    >
                        No site available.
                    </Typography></Box> :
                        <>{
                            trialSiteData?.map((row) => {
                                return (<Box key={row.siteId} sx={{ marginTop: 3, border: '1px solid #e7e7e7', padding: 3, borderRadius: 1,backgroundColor:'#fbfbfb' }}>
                                    <Box sx={{ display: 'flex', marginBottom: 2 }}>
                                        <Typography sx={{ flexGrow: 1, fontWeight: 'bold', color: 'grey' }}>{row?.site?.orgname}</Typography>
                                        <Button variant="outlined" sx={{ marginX: 2 }} onClick={() => openSiteForm(row)}>View Details</Button>
                                        <Button variant="outlined" onClick={() => openMemberDetails(row)}>Manage Members</Button>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item sm={12} md={2}>
                                            <Typography sx={{ color: 'grey' }}>{'Site Address:'}</Typography>
                                        </Grid>
                                        <Grid item sm={12} md={10}>
                                            <Typography sx={{ color: 'grey', fontWeight: 'medium' }}>{row?.site?.address}</Typography>
                                        </Grid>
                                        <Grid item sm={12} md={2}>
                                            <Typography sx={{ color: 'grey' }}>{'Total Subjects:'}</Typography>
                                        </Grid>
                                        <Grid item sm={12} md={10}>
                                            <Typography sx={{ color: 'grey', fontWeight: 'medium' }}>{row.totalSubjects}</Typography>
                                        </Grid>
                                        <Grid item sm={12} md={2}>
                                            <Typography sx={{ color: 'grey' }}>{'Fax:'}</Typography>
                                        </Grid>
                                        <Grid item sm={12} md={10}>
                                            <Typography sx={{ color: 'grey', fontWeight: 'medium' }}>{row?.site?.fax}</Typography>
                                        </Grid>
                                        {/* <Grid item sm={12} md={2}>
                                            <Typography sx={{ color: 'grey' }}>{'Fixed Cost:'}</Typography>
                                        </Grid> */}
                                        {/* <Grid item sm={12} md={10}>
                                            <Typography sx={{ color: 'grey', fontWeight: 'medium' }}>{row.fixedCost}</Typography>
                                        </Grid> */}
                                        {/* <Grid item sm={12} md={2}>
                                            <Typography sx={{ color: 'grey' }}>{'Variable Cost:'}</Typography>
                                        </Grid> */}
                                        {/* <Grid item sm={12} md={10}>
                                            <Typography sx={{ color: 'grey', fontWeight: 'medium' }}>{row.variableCost}</Typography>
                                        </Grid> */}
                                    </Grid>
                                </Box>)
                            })}</>
                        }
  
        </CardContent>
        </Card>
    );
};

export default SiteList;
