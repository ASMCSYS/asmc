import React, { useState } from "react";
import { Drawer, Typography, Grid, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import Button from "../../Common/Button";
import DateTimePickerComponent from "../../Common/DateTimePicker";
import IconButtonIcons from "../../Common/IconButtonIcons";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";
import StyledTextarea from "../../Common/StyledTextarea";

const RegularizationValidation = yup.object().shape({
    timestamp: yup.date().required("New timestamp is required"),
    reason: yup.string().required("Reason is required"),
});

export const RegularizationRequestDrawer = ({ show, close, onSuccess, attendanceLog }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const defaultData = {
        timestamp: attendanceLog?.timestamp ? new Date(attendanceLog.timestamp) : new Date(),
        reason: "",
    };

    const handleClose = () => {
        close();
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        if (isLoading) return; // Prevent double submission

        setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/biometric/regularization`, {
                attendance_log_id: attendanceLog?.log_id,
                request_type: "time_change",
                original_data: {
                    timestamp: attendanceLog?.timestamp,
                    status: attendanceLog?.status,
                    type: attendanceLog?.type,
                    method: attendanceLog?.method,
                },
                requested_data: {
                    timestamp: values.timestamp?.toISOString(),
                    status: attendanceLog?.status,
                    type: attendanceLog?.type,
                    method: attendanceLog?.method,
                },
                reason: values.reason,
            });

            if (response.success) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: response.message,
                        severity: "success",
                    }),
                );
                resetForm();
                handleClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Failed to create regularization request",
                    severity: "error",
                }),
            );
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={defaultData}
            validationSchema={RegularizationValidation}
            onSubmit={(values, action) => {
                handleSubmit(values, action);
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
                <Drawer
                    anchor="right"
                    open={show}
                    PaperProps={{
                        sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
                    }}
                    onClose={() => handleClose()}
                >
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                        <Grid
                            container
                            flex={0}
                            px={1}
                            py={1}
                            borderBottom={1}
                            justifyContent={"space-between"}
                            borderColor={"rgba(5, 5, 5, 0.06)"}
                        >
                            <Grid item display={"flex"}>
                                <Grid item alignSelf={"center"}>
                                    <IconButtonIcons
                                        color="default"
                                        title="Close"
                                        IconComponent={CloseIcon}
                                        onClick={() => handleClose()}
                                    />
                                </Grid>
                                <Grid item alignSelf={"center"}>
                                    <Typography variant="h6">Request Regularization</Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                {/* Attendance Log Info */}
                                {attendanceLog && (
                                    <Grid item xs={12}>
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Current Log Details:
                                            </Typography>
                                            <Typography variant="body2">
                                                Staff: {attendanceLog.staff_name || "N/A"}
                                            </Typography>
                                            <Typography variant="body2">
                                                Time: {new Date(attendanceLog.timestamp).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2">Type: {attendanceLog.type}</Typography>
                                            <Typography variant="body2">Status: {attendanceLog.status}</Typography>
                                        </Alert>
                                    </Grid>
                                )}

                                {/* New Timestamp */}
                                <Grid item xs={12}>
                                    <DateTimePickerComponent
                                        label="New Timestamp *"
                                        value={values.timestamp}
                                        onChange={(date) => setFieldValue("timestamp", date)}
                                        error={Boolean(errors.timestamp)}
                                        helperText={errors.timestamp}
                                    />
                                </Grid>

                                {/* Reason */}
                                <Grid item xs={12}>
                                    <StyledTextarea
                                        id="reason"
                                        name="reason"
                                        label="Reason for Regularization *"
                                        onChange={handleChange("reason")}
                                        value={values?.reason || ""}
                                        error={Boolean(errors.reason)}
                                        helperText={errors.reason}
                                        fullWidth
                                        minRows={3}
                                        placeholder="Please provide a detailed reason for changing the timestamp..."
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid
                            flexShrink={0}
                            borderTop={1}
                            borderColor={"rgba(152, 188, 252, 0.16)"}
                            sx={{ padding: "8px 16px" }}
                        >
                            <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Button size="large" color="warning" type="button" onClick={() => handleClose()}>
                                        Cancel
                                    </Button>
                                    <Button
                                        size="large"
                                        type="submit"
                                        loading={isLoading}
                                        onClick={() => handleSubmit()}
                                    >
                                        Submit Request
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

export default RegularizationRequestDrawer;
