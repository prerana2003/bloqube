import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  OutlinedInput,
  TextField,
  Select, Typography, useTheme, Tooltip
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import { Field, Form, Formik, useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  useAddDepartmentInMetaMutation,
  useCreateSiteMutation,
} from "../../../store/slices/apiSlice";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import { useGetDepartmentMetaQuery } from "../../../store/slices/apiSlice";
import Phone from "../../../components/common/Phone";
import { openMessage } from "../../../store/slices/showMessageSlice";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddSite = ({ handleClose, open, openMessageNotification }) => {
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const { data: deptMeta } = useGetDepartmentMetaQuery();
  const theme = useTheme()
  const dispatch = useDispatch()
  const [showAddDept, setShowAddDept] = useState(false)
  const [dept,setDept]=useState("")
  const [createSite] = useCreateSiteMutation();
  const [addDepartmentInMeta]=useAddDepartmentInMetaMutation()
  const docSchema = Yup.object().shape({
    orgname: Yup.string()
      .required("Site name is required")
      .min(2, "Minimum 2 characters are required")
      .max(50, "Maximum 50 characters are allowed"),
    fax: Yup.string()
      .required("Fax is required")
      .min(2, "Minimum 2 characters are required")
      .max(50, "Maximum 50 characters are allowed"),
    address: Yup.string()
      .required("address is required")
      .min(2, "Minimum 2 characters are required")
      .max(500, "Maximum 500 characters are allowed"),
  });

  const onCloseModal = () => {
    handleClose();
  };

  const handleAddDepartment = async() => {
    if (dept) {
      if (
        deptMeta?.filter(
          (department) =>
            department.title.split(" ").join("").toLowerCase() === dept.split(" ").join("").toLowerCase().replace(/[^a-z0-9 ]/g, '')
        ).length !== 0
      ) {
          dispatch(
            openMessage({
              messageSeverity: "warning",
              message: "Department Already exist!",
            })
          );
      } else {
         const res =  await addDepartmentInMeta(dept)
          if (res.data) {
            dispatch(openMessage({ messageSeverity: "success", message: "Department Added Successfully!" }));
            setShowAddDept(false)
            setDept("")
          }
      }
  
    } else {
      dispatch(openMessage({  messageSeverity: "warning", message: "Enter Department name!" }));
      setShowAddDept(false)
      setDept("")
    }
  }


  return (
    <>
      <Formik
            initialValues={{
              orgname: "",
              fax: "",
              address: "",
              departments: [],
            }}
            validationSchema={docSchema}
            onSubmit={async (values,{setSubmitting, resetForm}) => {
              const result = await createSite({
                siteData: { ...values },
                sponsorId: sponsorId,
              });
              if (result.data) {
                openMessageNotification({
                  message: "Submitted Successfully",
                  type: "success",
                });
              } else if (result.error) {
                if (result.error.data[0].message.includes("orgname","must be unique")) {
                  openMessageNotification({
                    message: "Site with this name is already exists",
                    type: "error",
                  });
                } else {
                  openMessageNotification({
                    message: "Unable to Submit",
                    type: "error",
                  });
                }
              }
              resetForm();
              handleClose();
            }}
      >
        {({ isSubmitting, handleSubmit, handleChange, values, touched, errors,setValues,setFieldValue }) => (
          <Dialog
          maxWidth={"sm"}
          scroll={"paper"}
          open={open}
          onClose={onCloseModal}
        >
          <DialogTitle>Add Site</DialogTitle>
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
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Site Name"
                  onChange={handleChange}
                  name="orgname"
                  fullWidth
                  size="small"
                  value={values.orgname}
                  variant="outlined"
                  helperText={ touched.orgname &&  errors.orgname}
                  error={ touched.orgname && Boolean( errors.orgname)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field name="fax" component={Phone} label="fax"/>
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Address"
                  onChange={ handleChange}
                  name="address"
                  size="small"
                  fullWidth
                  value={ values.address}
                  variant="outlined"
                  helperText={ touched.address &&  errors.address}
                  error={ touched.address && Boolean( errors.address)}
                />
              </Grid>
              <Grid item xs={12} sx={ {display:'flex'}}>
                <FormControl sx={{ width: "91.33%" }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Departments
                  </InputLabel>
                  <Select
                    multiple
                    value={ values.departments}
                    onChange={(event) => {
                      const { value } = event.target;
                      setFieldValue("departments", value);
                    }}
                    size="small"  
                    input={<OutlinedInput label="Departments" />}
                    renderValue={(selected) => {
                      // Show department names based on their IDs
                      const selectedDepartments = deptMeta.filter((dept) =>
                        selected?.includes(dept.id)
                      );
                      return selectedDepartments
                        .map((dept) => dept.title)
                        .join(", ");
                    }}
                    MenuProps={MenuProps}
                  >
                    {deptMeta?.map((deptMeta) => (
                      <MenuItem key={deptMeta.id} value={deptMeta.id}>
                        <Checkbox
                          checked={ values?.departments?.includes(
                            deptMeta.id
                          )}
                        />
                        <ListItemText primary={deptMeta.title} />
                      </MenuItem>
                    ))}
                  </Select>
                    </FormControl>
                    <Box sx={{width:'8.77%', display: 'flex', alignItems: 'center',justifyContent:'center' }}><Tooltip title={"Add Department"}><AddCircleOutlineIcon onClick={()=>setShowAddDept(true) } sx={{color:theme.palette.grey[600]}}/></Tooltip></Box>
                  </Grid>
                  {showAddDept&&<>
                  <Grid item xs={12} sx={{display:'flex'}}><TextField value={dept} onChange={(e) => setDept(e.target.value)} label={ "Add Department"} size="small" fullWidth sx={{width:'91.33%'}}/><Button color="primary" onClick={handleAddDepartment}>{dept.length>2?"Add":"Cancel"}</Button></Grid>
                  </>}
              </Grid>
              </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseModal}>Close</Button>
            <Button onClick={() =>  handleSubmit()}>Save</Button>
          </DialogActions>
        </Dialog>
        )}
      </Formik>
    </>
  );
};

export default AddSite;