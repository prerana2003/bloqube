// material-ui
import {
    Box,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    useTheme,
  } from "@mui/material";
  import { useNavigate } from "react-router-dom";
  import { useLoginMutation } from "../../store/slices/apiSlice";
  import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
  import logo from "../../assets/images/logo/bitmap@2x.jpg";
  import vector from "../../assets/images/login/undrawMedicineB1Ol@3x.png";
  import CustomButton from "../../components/@extended/CustomButton";
  import * as Yup from "yup";
  import YupPassword from 'yup-password'
  
  import { useFormik } from "formik";
  import ShowMessage from "../../components/showMessage/ShowMessage";
  import { useDispatch } from "react-redux";
  import { openMessage } from "../../store/slices/showMessageSlice";
  import { useState } from "react";
  import { useResponsive } from "../../hooks/ResponsiveProvider";
  import { Visibility, VisibilityOff } from "@mui/icons-material";



const Reset=()=>{
    const { isSmallScreen } = useResponsive();
    const theme = useTheme();
    const navigate = useNavigate();
    const docSchema = Yup.object().shape({
        userId: Yup.string().required("Username/Email Id is required"),
      });

    const formik = useFormik({
        initialValues: {
          userId: "",
        },
        validationSchema: docSchema,
      //   onSubmit: async (values) => {
      //     const result = await login({
      //       userId: values.userId,
      //     });
      //     if (!result?.error) {
      //       navigate("/");
      //     } else {
      //       openMessageNotification({
      //         message: result?.error?.data?.error_description,
      //         type: "error",
      //       });
      //     }
      //   },
      });

      const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        formik.handleSubmit();
      };
    
    return(
        <>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4, paddingTop: isSmallScreen ? 8 : 4 }}>
                <Typography variant="h5" color="initial">
                  Forgot Password
                </Typography>
              </Box>
              <form onSubmit={handleFormSubmit}>
                <Grid container rowSpacing={3}>
                  <Grid item xs={12} px={3}>
                    <Typography variant="body1" color="#5d5d5d" pb={1}>
                      Username/Email Id
                    </Typography>
                    <TextField
                      name="userId"
                      fullWidth
                      placeholder="Username/Email Id"
                      onChange={formik.handleChange}
                      value={formik.values.userId}
                      onBlur={formik.handleBlur}
                      helperText={formik.touched.userId && formik.errors.userId}
                      error={formik.touched.userId && Boolean(formik.errors.userId)}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: 'space-between', px: 3 }}>
                  <Button
                    variant="text"
                    sx={{ width: 150, color: theme.palette.primary.light }}
                    size="large"
                    onClick={()=>{navigate("/login")}}
                  >
                    Back to Login
                  </Button>
                    <CustomButton
                      // onClick={formik.handleSubmit}
                      size="large"
                      type="submit"
                      sx={{
                        width: 150,
                        backgroundColor: theme.palette.primary.light,
                      }}
                    >
                      Submit
                    </CustomButton>
                  </Grid>

                </Grid>
              </form>
        </>
    )
}



const Confirm=()=>{
    const theme = useTheme();
    const { isSmallScreen } = useResponsive();
    const [newShowPassword, setNewShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    
    const docSchema = Yup.object().shape({
        tempPassword: Yup.string().required("Temp password is required"),
        newPassword: Yup.string().required("New password is required")
          .matches(/^\S*$/, 'Whitespace is not allowed')
          .min(8,"Password must be 8 to 16 characters long")
          .max(16,"Password must be 8 to 16 characters long")
          .matches(/(?=.*[0-9])/, "Password requires a number")
          .matches(/(?=.*[A-Z])/, "Password requires a uppercase letter")
          .matches(/(?=.*[a-z])/, "Password requires a lowercase letter")
          .matches(/(?=.*\W)/, "Password requires a special character"),
        confirmPassword: Yup.string().required("Confirm password is required").oneOf([Yup.ref('newPassword'),null], "Password must match"),
    });

    const formik = useFormik({
        initialValues: {
            tempPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: docSchema,
        // onSubmit: async (values) => {
        // const result = await login({
        //     tempPassword: values.tempPassword,
        //     newPassword: values.newPassword,
        //     confirmPassword: values.confirmPassword,
        // });
        // if (!result?.error) {
        //     navigate("/");
        // } else {
        //     openMessageNotification({
        //     message: result?.error?.data?.error_description,
        //     type: "error",
        //     });
        // }
        // },
    });

    const handleClickNewShowPassword = () => {
        setNewShowPassword(!newShowPassword)
    };

    const handleClickConfirmShowPassword = () => {
        setConfirmShowPassword(!confirmShowPassword)
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        formik.handleSubmit();
    };

    // const openMessageNotification = (message) => {
    //     dispatch(openMessage({ message: message.message, messageSeverity: message.type }))
    // };


    return(
        <>
            <Box sx={{ display: "flex", justifyContent: "center", py: 4, paddingTop: isSmallScreen ? 8 : 4 }}>
              <Typography variant="h5" color="initial">
                Forgot password
              </Typography>
            </Box>

            <form onSubmit={handleFormSubmit}>

              <Grid container rowSpacing={0} >
                <Grid item xs={12} px={3} >
                    <Typography variant="body1" color="#5d5d5d" pb={0}>
                        Temporary Password
                    </Typography>
                    <TextField
                        size="small"
                        sx={{height:"65px"}}
                        name="tempPassword"
                        fullWidth
                        placeholder="Password"
                        type= "password"
                        onChange={formik.handleChange}
                        value={formik.values.tempPassword}
                        onBlur={formik.handleBlur}
                        helperText={formik.touched.tempPassword && formik.errors.tempPassword}
                        error={
                          formik.touched.tempPassword && Boolean(formik.errors.tempPassword)
                        }
                    />
                </Grid>
                <Grid item xs={12} px={3}>
                  <Typography variant="body1" color="#5d5d5d" pb={0}>
                    New Password
                  </Typography>
                  <TextField
                    size="small"
                    sx={{height:"65px"}}
                    name="newPassword"
                    fullWidth
                    placeholder="Password"
                    type={newShowPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                    error={
                      formik.touched.newPassword && Boolean(formik.errors.newPassword)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ pr: 1 }}>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickNewShowPassword}
                            edge="end"
                          >
                            {newShowPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} px={3}>
                  <Typography variant="body1" color="#5d5d5d" pb={1}>
                    Confirm Password
                  </Typography>
                  <TextField
                    size="small"
                    sx={{height:"65px"}}
                    name="confirmPassword"
                    fullWidth
                    placeholder="Password"
                    type={confirmShowPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    error={
                      formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ pr: 1 }}>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickConfirmShowPassword}
                            edge="end"
                          >
                            {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ display: "flex", justifyContent: 'right', px: 3 }}>
                  <CustomButton
                    // onClick={formik.handleSubmit}
                    size="large"
                    type="submit"
                    sx={{
                      width: 150,
                      backgroundColor: theme.palette.primary.light,
                    }}
                  >
                    Submit
                  </CustomButton>
                </Grid>
              </Grid>
            </form>
        </>
    )
}


const Forgot = () => {
  
  const theme = useTheme();
  const { isSmallScreen } = useResponsive();
  const[mailVerified,setmailVerified]= useState(true);
  


  // const openMessageNotification = (message) => {
  //   dispatch(openMessage({ message: message.message, messageSeverity: message.type }))
  // };

  return (
    <>
      <Grid container sx={{ height: "100vh", width: '100%' }}>
        {!isSmallScreen && <Grid item xs={12} maxHeight={100}>
          <Box sx={{ p: 4, position:'absolute', right:0, display: "flex", justifyContent: isSmallScreen ? "center" : 'flex-end' }}>
            <Button
              size="large"
              variant="outlined"
              sx={{ textTransform: "none", color: theme.palette.primary.light }}
              startIcon={
                <HelpOutlineOutlinedIcon
                  sx={{ color: theme.palette.primary.light }}
                />
              }
            >
              Help & Support
            </Button>
          </Box>
        </Grid>}
        <Grid
          item
          md={6}
          //sm={12}
          style={{
            display: "flex", justifyContent: isSmallScreen ? 'center' : "flex-end", ...(isSmallScreen && {
              alignItems: 'center',
            })
          }}
        >
          <Paper sx={{
            height: isSmallScreen ? 'auto' : 550, ...(!isSmallScreen && {
              width: 480,
            })
          }} elevation={isSmallScreen?0:5}>
            <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
              <img src={logo} alt="Bloqcube" width="200" />
            </Box>

            {mailVerified ? <Confirm/> : <Reset/>} 

          </Paper>
        </Grid>
        {!isSmallScreen && <Grid
          item
          md={6}
          style={{ display: "flex", justifyContent: "center " }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
            <img src={vector} alt="Bloqcube" width="100%" height={"65%"} />
          </Box>
        </Grid>}
      </Grid>
      <ShowMessage />
    </>
  );
};
  
export default Forgot;
  