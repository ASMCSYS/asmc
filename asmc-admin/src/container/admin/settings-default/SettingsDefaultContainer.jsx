import React, { useEffect } from "react";
import { Chip, FormControl, FormHelperText, Grid, InputLabel, Paper, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { CommonFileUploadToServer } from "../../../components/Common/CommonFileUploadToServer";
import Input from "../../../components/Common/Input";
import Button from "../../../components/Common/Button";
import RichTextEditor from "../../../components/Common/editor/RichTextEditor";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { useGetSettingsDefaultCmsQuery, useUpdateSettingsDefaultCmsMutation } from "../../../store/common/commonApis";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const Validation = yup.object().shape({
    booking_prior_days: yup.string().required("Required"),
    hall_booking_prior_days: yup.string().required("Required"),
    booked_dates: yup.mixed().required("Required"),
    // Activity renew settings - allow any number including 0 and negative
    activity_renew_start_days: yup.number().min(-365).max(365).required("Required"),
    activity_renew_end_days: yup.number().min(-365).max(365).required("Required"),
    // Membership renew settings - allow any number including 0 and negative
    membership_renew_start_days: yup.number().min(-365).max(365).required("Required"),
    membership_renew_end_days: yup.number().min(-365).max(365).required("Required"),
});

const SettingsDefaultContainer = () => {
    const dispatch = useDispatch();
    const { data } = useGetSettingsDefaultCmsQuery();
    const [updateSettingsDefault] = useUpdateSettingsDefaultCmsMutation();

    const [selectedDate, setSelectedDate] = React.useState(null);

    const onFormSubmit = async (values) => {
        try {
            await updateSettingsDefault(values);

            dispatch(
                setSnackBar({
                    open: true,
                    message: "Settings updated successfully",
                    severity: "success",
                }),
            );
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
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">Settings Default</Typography>
                    </Grid>
                </Grid>

                <Formik
                    enableReinitialize
                    initialValues={
                        data?.json || {
                            booking_prior_days: "",
                            hall_booking_prior_days: "",
                            booked_dates: [],
                            // Activity renew defaults
                            activity_renew_start_days: 30,
                            activity_renew_end_days: 15,
                            // Membership renew defaults
                            membership_renew_start_days: 30,
                            membership_renew_end_days: 15,
                        }
                    }
                    onSubmit={(values, { resetForm }) => {
                        onFormSubmit(values);
                        resetForm();
                    }}
                    validationSchema={Validation}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                        <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                            <Grid flex={1} px={2} py={5} overflow={"auto"}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="booking_prior_days"
                                            name="booking_prior_days"
                                            label="Booking Prior in Days *"
                                            onChange={handleChange("booking_prior_days")}
                                            value={values?.booking_prior_days || ""}
                                            error={Boolean(errors.booking_prior_days)}
                                            helperText={errors.booking_prior_days}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="hall_booking_prior_days"
                                            name="hall_booking_prior_days"
                                            label="Hall Booking Prior in Days *"
                                            onChange={handleChange("hall_booking_prior_days")}
                                            value={values?.hall_booking_prior_days || ""}
                                            error={Boolean(errors.hall_booking_prior_days)}
                                            helperText={errors.hall_booking_prior_days}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                {/* Activity Renew Button Configuration Section */}
                                <Paper sx={{ marginTop: "24px" }}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Activity Renew Button Configuration</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} mt={2}>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="activity_renew_start_days"
                                                name="activity_renew_start_days"
                                                label="Days Before Expiry to Show Renew Button *"
                                                type="number"
                                                onChange={(e) => {
                                                    const value = e.target.value === "" ? "" : Number(e.target.value);
                                                    setFieldValue("activity_renew_start_days", value);
                                                }}
                                                value={values?.activity_renew_start_days ?? ""}
                                                error={Boolean(errors.activity_renew_start_days)}
                                                helperText={
                                                    errors.activity_renew_start_days ||
                                                    "Show renew button X days before activity plan expiry (can be negative, 0, or positive)"
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="activity_renew_end_days"
                                                name="activity_renew_end_days"
                                                label="Days After Expiry to Show Renew Button *"
                                                type="number"
                                                onChange={(e) => {
                                                    const value = e.target.value === "" ? "" : Number(e.target.value);
                                                    setFieldValue("activity_renew_end_days", value);
                                                }}
                                                value={values?.activity_renew_end_days ?? ""}
                                                error={Boolean(errors.activity_renew_end_days)}
                                                helperText={
                                                    errors.activity_renew_end_days ||
                                                    "Hide renew button X days after activity plan expiry (can be negative, 0, or positive)"
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                Example: With 30 days before and 15 days after, renew button will be
                                                visible from 30 days before activity expiry to 15 days after expiry.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Membership Renew Button Configuration Section */}
                                <Paper sx={{ marginTop: "24px" }}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Membership Renew Button Configuration</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} mt={2}>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="membership_renew_start_days"
                                                name="membership_renew_start_days"
                                                label="Days Before Expiry to Show Renew Button *"
                                                type="number"
                                                onChange={(e) => {
                                                    const value = e.target.value === "" ? "" : Number(e.target.value);
                                                    setFieldValue("membership_renew_start_days", value);
                                                }}
                                                value={values?.membership_renew_start_days ?? ""}
                                                error={Boolean(errors.membership_renew_start_days)}
                                                helperText={
                                                    errors.membership_renew_start_days ||
                                                    "Show renew button X days before membership plan expiry (can be negative, 0, or positive)"
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="membership_renew_end_days"
                                                name="membership_renew_end_days"
                                                label="Days After Expiry to Show Renew Button *"
                                                type="number"
                                                onChange={(e) => {
                                                    const value = e.target.value === "" ? "" : Number(e.target.value);
                                                    setFieldValue("membership_renew_end_days", value);
                                                }}
                                                value={values?.membership_renew_end_days ?? ""}
                                                error={Boolean(errors.membership_renew_end_days)}
                                                helperText={
                                                    errors.membership_renew_end_days ||
                                                    "Hide renew button X days after membership plan expiry (can be negative, 0, or positive)"
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                Example: With 30 days before and 15 days after, renew button will be
                                                visible from 30 days before membership expiry to 15 days after expiry.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Paper sx={{ marginTop: "24px" }}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Default Booked Hall Dates</Typography>
                                        </Grid>
                                    </Grid>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Grid container spacing={2} mt={2}>
                                            <Grid item xs={12} md={6}>
                                                <DatePicker
                                                    label="Select Booked Date"
                                                    defaultValue={selectedDate}
                                                    onChange={(newValue) => {
                                                        if (newValue) {
                                                            const dateString = format(newValue, "yyyy-MM-dd");
                                                            if (!values?.booked_dates.includes(dateString)) {
                                                                setFieldValue("booked_dates", [
                                                                    ...values?.booked_dates,
                                                                    dateString,
                                                                ]);
                                                            }
                                                        }
                                                        setSelectedDate(null);
                                                    }}
                                                    slotProps={{
                                                        textField: { fullWidth: true, size: "small" },
                                                    }}
                                                />
                                                {errors?.booked_dates && (
                                                    <FormHelperText error>{errors?.booked_dates}</FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                                    {values?.booked_dates?.map((date, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={date}
                                                            onDelete={() =>
                                                                setFieldValue("booked_dates", [
                                                                    ...values?.booked_dates.filter(
                                                                        (item) => item !== date,
                                                                    ),
                                                                ])
                                                            }
                                                            deleteIcon={<Delete />}
                                                            color="error"
                                                        />
                                                    ))}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </LocalizationProvider>
                                </Paper>
                            </Grid>
                            <Grid
                                flexShrink={0}
                                borderTop={1}
                                borderColor={"rgba(152, 188, 252, 0.16)"}
                                sx={{ padding: "8px 16px" }}
                            >
                                <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <HasPermission permission={PERMISSIONS.SETTINGS.UPDATE} fallback={null}>
                                            <Button size="large" type="submit" onClick={() => handleSubmit()}>
                                                Save
                                            </Button>
                                        </HasPermission>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Formik>
            </Paper>
        </Stack>
    );
};

export default SettingsDefaultContainer;
