import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, Grid, IconButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Close } from "@mui/icons-material";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import BasicSelect from "../../Common/Select";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import DateTimePickerComponent from "../../Common/DateTimePicker";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";

const defaultLogData = {
    staff_id: "",
    machine_id: "",
    type: "check-in",
    timestamp: new Date(),
    method: "fingerprint",
    remarks: "",
};

const LogValidation = yup.object().shape({
    staff_id: yup.string().required("Staff is required"),
    machine_id: yup.string().required("Machine is required"),
    type: yup.string().required("Type is required"),
    timestamp: yup.date().required("Timestamp is required"),
    method: yup.string().required("Method is required"),
});

const attendanceTypes = [
    { value: "check-in", label: "Check-in" },
    { value: "check-out", label: "Check-out" },
    { value: "break-start", label: "Break Start" },
    { value: "break-end", label: "Break End" },
];

const attendanceMethods = [
    { value: "fingerprint", label: "Fingerprint" },
    { value: "card", label: "Card" },
    { value: "password", label: "Password" },
    { value: "face", label: "Face" },
];

export const AttendanceLogAddDrawer = ({ show, close, onSuccess }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [initialStaffData, setInitialStaffData] = useState([]);
    const [initialMachineData, setInitialMachineData] = useState([]);
    console.log(initialStaffData, "initialStaffData");

    const handleClose = () => {
        close();
    };

    // Load initial data when drawer opens
    useEffect(() => {
        if (show) {
            loadInitialData();
        }
    }, [show]);

    const loadInitialData = async () => {
        try {
            // Load initial staff data
            const staffResponse = await axios.get(`${baseUrl}/biometric/staff`, {
                params: {
                    limit: 10,
                },
            });
            setInitialStaffData(staffResponse.result.data || []);

            // Load initial machine data
            const machineResponse = await axios.get(`${baseUrl}/biometric/machines`, {
                params: {
                    limit: 10,
                    is_active: true,
                },
            });
            setInitialMachineData(machineResponse.result.data || []);
        } catch (error) {
            console.error("Failed to load initial data:", error);
        }
    };

    const handleFetchStaff = async (searchParams) => {
        try {
            // Extract the actual search term from the input value
            // AutoCompleteServerSide passes { keywords: inputValue, ...apiParams }
            const searchValue = searchParams?.keywords || "";

            console.log("Staff search called with:", searchParams, "extracted:", searchValue);

            // If no search term, return initial data
            if (searchValue.length < 1) {
                return { data: { result: initialStaffData } };
            }

            const response = await axios.get(`${baseUrl}/biometric/staff`, {
                params: {
                    search: searchValue,
                    limit: 50,
                },
            });
            // Transform the response to match what AutoCompleteServerSide expects
            return {
                data: {
                    result: response.result.data || [],
                },
            };
        } catch (error) {
            console.error("Failed to fetch staff:", error);
            return { data: { result: [] } };
        }
    };

    const handleFetchMachines = async (searchParams) => {
        try {
            // Extract the actual search term from the input value
            // AutoCompleteServerSide passes { keywords: inputValue, ...apiParams }
            const searchValue = searchParams?.keywords || "";

            console.log("Machine search called with:", searchParams, "extracted:", searchValue);

            // If no search term, return initial data
            if (searchValue.length < 1) {
                return { data: { result: initialMachineData } };
            }

            const response = await axios.get(`${baseUrl}/biometric/machines`, {
                params: {
                    search: searchValue,
                    limit: 50,
                    is_active: true,
                },
            });
            // Transform the response to match what AutoCompleteServerSide expects
            return {
                data: {
                    result: response.result.data || [],
                },
            };
        } catch (error) {
            console.error("Failed to fetch machines:", error);
            return { data: { result: [] } };
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/biometric/attendance`, {
                ...values,
                timestamp: values.timestamp.toISOString(),
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
                    message: error.response?.data?.message || "Failed to add attendance log",
                    severity: "error",
                }),
            );
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={show}
            PaperProps={{
                sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
            }}
            onClose={() => handleClose()}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" component="h1">
                        Add Manual Log Entry
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                {/* Form */}
                <Formik initialValues={defaultLogData} validationSchema={LogValidation} onSubmit={handleSubmit}>
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Staff Selection */}
                                <Grid item xs={12}>
                                    <AutoCompleteServerSide
                                        fetchDataFunction={handleFetchStaff}
                                        id="staff_id"
                                        label="Select Staff"
                                        onChange={(selectedStaff) => {
                                            setFieldValue("staff_id", selectedStaff?.staff_id || "");
                                        }}
                                        keyname="name"
                                        error={touched.staff_id && errors.staff_id}
                                        helperText={touched.staff_id && errors.staff_id}
                                        initialOptions={initialStaffData}
                                    />
                                </Grid>

                                {/* Machine Selection */}
                                <Grid item xs={12}>
                                    <AutoCompleteServerSide
                                        fetchDataFunction={handleFetchMachines}
                                        id="machine_id"
                                        label="Select Machine"
                                        onChange={(selectedMachine) => {
                                            setFieldValue("machine_id", selectedMachine?.machine_id || "");
                                        }}
                                        keyname="name"
                                        error={touched.machine_id && errors.machine_id}
                                        helperText={touched.machine_id && errors.machine_id}
                                        initialOptions={initialMachineData}
                                    />
                                </Grid>

                                {/* Attendance Type */}
                                <Grid item xs={12} sm={6}>
                                    <BasicSelect
                                        id="type"
                                        name="type"
                                        label="Attendance Type"
                                        value={values.type}
                                        onChange={handleChange}
                                        items={attendanceTypes}
                                        error={touched.type && errors.type}
                                        helperText={touched.type && errors.type}
                                    />
                                </Grid>

                                {/* Method */}
                                <Grid item xs={12} sm={6}>
                                    <BasicSelect
                                        id="method"
                                        name="method"
                                        label="Method"
                                        value={values.method}
                                        onChange={handleChange}
                                        items={attendanceMethods}
                                        error={touched.method && errors.method}
                                        helperText={touched.method && errors.method}
                                    />
                                </Grid>

                                {/* Timestamp */}
                                <Grid item xs={12}>
                                    <DateTimePickerComponent
                                        label="Timestamp"
                                        value={values.timestamp}
                                        onChange={(date) => setFieldValue("timestamp", date)}
                                        error={touched.timestamp && errors.timestamp}
                                        helperText={touched.timestamp && errors.timestamp}
                                    />
                                </Grid>

                                {/* Remarks */}
                                <Grid item xs={12}>
                                    <Input
                                        name="remarks"
                                        label="Remarks"
                                        value={values.remarks}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        multiline
                                        rows={3}
                                        error={touched.remarks && errors.remarks}
                                        helperText={touched.remarks && errors.remarks}
                                    />
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                        <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" loading={isLoading}>
                                            Add Log Entry
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Box>
        </Drawer>
    );
};

export default AttendanceLogAddDrawer;
