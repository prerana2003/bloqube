import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Field, Form, Formik, useField, useFormik } from "formik";
import PhoneInput from "react-phone-number-input";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { getIn } from "formik";
import * as Yup from "yup";
import { useAddSiteMemberMutation } from "../../../store/slices/apiSlice";
import { openMessage } from "../../../store/slices/showMessageSlice";
import CustomPhoneInput from "../../dynamicFormEngine/FormFields/CustomPhoneInput";

const Phone = ({ form, ...props }) => {
    const [field, meta, helpers] = useField(props.field.name);
    return (
      <PhoneInput
        {...form}
        {...field}
        placeholder={props.placeholder}
        value={field.value}
        defaultCountry="IN"
        size="small"
        onChange={(value) => {
          if (!form.touched[field.name]) form.setFieldTouched(field.name);
          form.setFieldValue(field.name, value);
        }}
        label={props.label}
        inputComponent={CustomPhoneInput}
      />
    );
};

const AddMember = ({ siteId, onAddMember, handleClose, open }) => {
    const dispatch = useDispatch()
    const openMessageNotification = (message) => {
        dispatch(openMessage({ message: message.message, messageSeverity: message.type }))
    };

    const sponsorId = useSelector((state) => state.auth.sponsorId);
    const [addSiteMember] = useAddSiteMemberMutation();
    const docSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Please enter a valid email"),
        firstName: Yup.string()
            .required("First name is required")
            .min(2, "Minimum 2 characters are required")
            .max(50, "Maximum 50 characters are allowed"),
        lastName: Yup.string()
            .required("Last name is required")
            .min(2, "Minimum 2 characters are required")
            .max(50, "Maximum 50 characters are allowed"),
        address: Yup.string()
            .required("Adress is required")
            .min(2, "Minimum 2 characters are required")
            .max(500, "Maximum 500 characters are allowed"),
        contactNumber: Yup.string()
            .required("Contact number is required"),
        // .matches(/^\+[1-9]\d{0,2}[1-9]\d{6,14}$/, "Invalid contact number"),
    });

    const onCloseModal = () => {
        //formik.resetForm();
        handleClose();
    }
    return (<>
        <Formik
            initialValues={{
                email: "",
                firstName: '',
                lastName: '',
                address: '',
                contactNumber: '',
            }}
            validationSchema={docSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                console.log(values);
                const result = await addSiteMember({
                    data: { ...values, userName: values.email, siteId },
                    sponsorId: sponsorId,
                });
                if (result.data) {
                    openMessageNotification({
                        message: "Submitted Successfully",
                        type: "success",
                    });
                } else if (result.error) {
                    if (result.error.data.message.includes("user_name", "cannot contain duplicate values")) {
                        openMessageNotification({
                            message: "User with given email Id is already Exists",
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
                onAddMember();
            }}
        >
            {({ isSubmitting, handleSubmit, handleChange, values, touched, errors }) => (
                <Dialog
                    //fullWidth={true}
                    maxWidth={"sm"}
                    //sx={{minHeight: '50%'}}
                    //PaperProps={{ sx: { minHeight: "50%" } }}
                    scroll={"paper"}
                    open={open}
                    onClose={onCloseModal}
                >

                    <DialogTitle>Add Member</DialogTitle>
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
                                        label="Email"
                                        onChange={handleChange}
                                        name="email"
                                        fullWidth
                                        value={values.email}
                                        size="small"
                                        variant="outlined"
                                        helperText={touched.email && errors.email}
                                        error={touched.email && Boolean(errors.email)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field name="contactNumber" component={Phone} label="Contact Number"/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="First Name"
                                        onChange={handleChange}
                                        fullWidth
                                        name="firstName"
                                        value={values.firstName}
                                        size="small"
                                        variant="outlined"
                                        helperText={touched.firstName && errors.firstName}
                                        error={touched.firstName && Boolean(errors.firstName)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Last Name"
                                        onChange={handleChange}
                                        fullWidth
                                        name="lastName"
                                        value={values.lastName}
                                        size="small"
                                        variant="outlined"
                                        helperText={touched.lastName && errors.lastName}
                                        error={touched.lastName && Boolean(errors.lastName)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        label="Address"
                                        onChange={handleChange}
                                        fullWidth
                                        name="address"
                                        value={values.address}
                                        size="small"
                                        variant="outlined"
                                        helperText={touched.address && errors.address}
                                        error={touched.address && Boolean(errors.address)}
                                    />
                                </Grid>
                            </Grid>
                        </Form>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onCloseModal}>Close</Button>
                        <Button onClick={() => handleSubmit()}>Save</Button>
                    </DialogActions>

                </Dialog>
            )}
        </Formik>
    </>)
}

export default AddMember;