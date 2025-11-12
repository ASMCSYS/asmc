import React from "react";
import {
    Drawer,
    Box,
    Typography,
    Grid,
    Switch,
    FormControlLabel,
    FormGroup,
    FormControl,
    FormLabel,
    Checkbox,
    FormHelperText,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useAddNewStaffMutation, useUpdateStaffMutation } from "../../../store/staff/staffApis";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import IconButtonIcons from "../../Common/IconButtonIcons";
import { Close } from "@mui/icons-material";
import PermissionCheckboxGroup from "../../Common/PermissionCheckboxGroup";
import { PERMISSION_GROUPS } from "../../../helpers/constants";

const defaultStaff = {
    name: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    address: "",
    status: true,
    joiningDate: "",
    smartOfficeId: "",
    team: "",
    reportingTo: "",
    permissions: [],
    biometric: {
        thumbprint: "",
        deviceId: "",
        registeredAt: "",
    },
};

const StaffValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    designation: yup.string().required("Designation is required"),
    department: yup.string().required("Department is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    address: yup.string().required("Address is required"),
    permissions: yup.array().min(1, "Select at least one permission"),
});

export const StaffAddDrawer = ({ show, close, formType, initialValues = {} }) => {
    const dispatch = useDispatch();
    const [addNewStaff, { isLoading: addStaffLoading }] = useAddNewStaffMutation();
    const [updateStaff, { isLoading: updateStaffLoading }] = useUpdateStaffMutation();

    const onFormSubmit = async (values) => {
        try {
            if (formType === "Edit") {
                await updateStaff(values).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Staff updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewStaff(values).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Staff created successfully",
                        severity: "success",
                    }),
                );
            }
            close();
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={StaffValidation}
            enableReinitialize
            onSubmit={(values) => onFormSubmit(values)}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Drawer
                    anchor={"right"}
                    open={show}
                    PaperProps={{
                        sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
                    }}
                    onClose={() => close()}
                >
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons
                                    color="default"
                                    title="Close"
                                    IconComponent={Close}
                                    onClick={() => close()}
                                />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">{formType} Staff</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && errors.name}
                                        helperText={touched.name && errors.name}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Designation"
                                        name="designation"
                                        value={values.designation}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.designation && errors.designation}
                                        helperText={touched.designation && errors.designation}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Department"
                                        name="department"
                                        value={values.department}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.department && errors.department}
                                        helperText={touched.department && errors.department}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && errors.email}
                                        helperText={touched.email && errors.email}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Phone"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phone && errors.phone}
                                        helperText={touched.phone && errors.phone}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Address"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.address && errors.address}
                                        helperText={touched.address && errors.address}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={values.status} onChange={handleChange} name="status" />
                                        }
                                        label="Active"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Joining Date"
                                        name="joiningDate"
                                        type="date"
                                        value={values.joiningDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.joiningDate && errors.joiningDate}
                                        helperText={touched.joiningDate && errors.joiningDate}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Smart Office ID"
                                        name="smartOfficeId"
                                        value={values.smartOfficeId}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Team"
                                        name="team"
                                        value={values.team}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        label="Reporting To"
                                        name="reportingTo"
                                        value={values.reportingTo}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <PermissionCheckboxGroup
                                        permissionGroups={PERMISSION_GROUPS}
                                        values={values.permissions}
                                        setFieldValue={setFieldValue}
                                        fieldName="permissions"
                                        title="Permissions"
                                    />
                                    <FormHelperText error={touched.permissions && errors.permissions}>
                                        {errors.permissions}
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            flexShrink={0}
                            borderTop={1}
                            borderColor={"rgba(152, 188, 252, 0.16)"}
                            sx={{ padding: "8px 16px" }}
                        >
                            <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Grid
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Button size="large" color="warning" type="button" onClick={() => close()}>
                                        Cancel
                                    </Button>
                                    <Button
                                        size="large"
                                        type="submit"
                                        loading={addStaffLoading || updateStaffLoading}
                                        onClick={() => handleSubmit()}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Drawer>
            )}
        </Formik>
    );
};
