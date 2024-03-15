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
import { useFormik } from "formik";
import ShowMessage from "../../components/showMessage/ShowMessage";
import { useDispatch } from "react-redux";
import { openMessage } from "../../store/slices/showMessageSlice";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useResponsive } from "../../hooks/ResponsiveProvider";

const Login = () => {
  const [login, { error }] = useLoginMutation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsive();
  const [showPassword, setShowPassword] = useState(false);

  const docSchema = Yup.object().shape({
    userId: Yup.string().required("Username/Email Id is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      userId: "",
      password: "",
    },
    validationSchema: docSchema,
    onSubmit: async (values) => {
      const result = await login({
        userId: values.userId,
        password: values.password,
      });
      if (!result?.error) {
        navigate("/");
      } else {
        openMessageNotification({
          message: result?.error?.data?.error_description,
          type: "error",
        });
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    formik.handleSubmit();
  };

  const openMessageNotification = (message) => {
    dispatch(openMessage({ message: message.message, messageSeverity: message.type }))
  };

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
            <Box sx={{ display: "flex", justifyContent: "center", py: 4, paddingTop: isSmallScreen ? 8 : 4 }}>
              <Typography variant="h5" color="initial">
                Login to your account
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
                <Grid item xs={12} px={3}>
                  <Typography variant="body1" color="#5d5d5d" pb={1}>
                    Password
                  </Typography>
                  <TextField
                    name="password"
                    fullWidth
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.password && formik.errors.password}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ pr: 1 }}>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: 'space-between', px: 3 }}>
                  <Button
                    variant="text"
                    sx={{ width: 'fit-content', color: theme.palette.primary.light, p:0, ":hover":'none' }}
                    size="large"
                    onClick={()=>{navigate("/forgotPassword")}}
                  >
                    Forgot password?
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
                    Login
                  </CustomButton>
                </Grid>
              </Grid>
            </form>
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

export default Login;
