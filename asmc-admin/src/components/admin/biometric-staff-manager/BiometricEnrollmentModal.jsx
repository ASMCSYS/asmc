import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Card,
    CardContent,
    Grid,
    Chip,
    LinearProgress,
    Alert,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Fingerprint as FingerprintIcon,
    Face as FaceIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";

const BiometricEnrollmentModal = ({ open, onClose, staff, onSuccess }) => {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [enrollmentType, setEnrollmentType] = useState("both");
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [enrollmentResult, setEnrollmentResult] = useState(null);

    const steps = ["Select Enrollment Type", "Start Automatic Enrollment", "Monitor Progress", "Verification"];

    useEffect(() => {
        if (open && staff) {
            setActiveStep(0);
            setEnrollmentStatus(null);
            setEnrollmentResult(null);
            checkCurrentStatus();
        }
    }, [open, staff]);

    const checkCurrentStatus = async () => {
        if (!staff?.staff_id) return;

        setIsCheckingStatus(true);
        try {
            const response = await axios.get(`${baseUrl}/biometric/staff/${staff.staff_id}/enrollment/status`);

            if (response.success) {
                setEnrollmentStatus(response.result.enrollment);
            }
        } catch (error) {
            console.error("Failed to check enrollment status:", error);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    const handleStartEnrollment = async () => {
        if (!staff?.staff_id) return;

        setIsLoading(true);
        setActiveStep(2);

        try {
            const response = await axios.post(
                `${baseUrl}/biometric/staff/${staff.staff_id}/enrollment/start-automatic`,
                { enrollmentType },
            );

            if (response.success) {
                setEnrollmentResult(response.result);

                // Set initial status to show the enrollment is in progress
                setEnrollmentStatus({
                    status: "in_progress",
                    instructions: "Device is in enrollment mode. Please interact with the device.",
                    fingerprint: { enrolled: false },
                    face: { enrolled: false },
                    startedAt: new Date().toISOString(),
                });

                setActiveStep(3);

                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Automatic enrollment started successfully!",
                        severity: "success",
                    }),
                );

                // Start polling for status updates
                pollEnrollmentStatus();
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Failed to start enrollment",
                    severity: "error",
                }),
            );
            setActiveStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    const pollEnrollmentStatus = () => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${baseUrl}/biometric/staff/${staff.staff_id}/enrollment/status`);

                if (response.success) {
                    const status = response.result.enrollment;
                    setEnrollmentStatus(status);

                    if (status.status === "completed" || status.status === "failed") {
                        clearInterval(interval);

                        if (status.status === "completed") {
                            dispatch(
                                setSnackBar({
                                    open: true,
                                    message: "Biometric enrollment completed successfully!",
                                    severity: "success",
                                }),
                            );
                            if (onSuccess) onSuccess();
                        } else {
                            dispatch(
                                setSnackBar({
                                    open: true,
                                    message: "Enrollment failed. Please try again.",
                                    severity: "error",
                                }),
                            );
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to poll enrollment status:", error);
            }
        }, 3000); // Poll every 3 seconds

        // Clear interval after 5 minutes
        setTimeout(() => clearInterval(interval), 300000);
    };

    const handleCancelEnrollment = async () => {
        if (!staff?.staff_id) return;

        try {
            const response = await axios.delete(`${baseUrl}/biometric/staff/${staff.staff_id}/enrollment/cancel`);

            if (response.success) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Enrollment cancelled successfully",
                        severity: "info",
                    }),
                );
                setEnrollmentStatus(null);
                setActiveStep(0);
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Failed to cancel enrollment",
                    severity: "error",
                }),
            );
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "success";
            case "in_progress":
                return "warning";
            case "failed":
                return "error";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircleIcon />;
            case "failed":
                return <ErrorIcon />;
            default:
                return null;
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Select Biometric Enrollment Type
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Choose which biometric data you want to enroll for {staff?.name}
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Enrollment Type</InputLabel>
                            <Select
                                value={enrollmentType}
                                onChange={(e) => setEnrollmentType(e.target.value)}
                                label="Enrollment Type"
                            >
                                <MenuItem value="fingerprint">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <FingerprintIcon />
                                        Fingerprint Only
                                    </Box>
                                </MenuItem>
                                <MenuItem value="face">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <FaceIcon />
                                        Face Only
                                    </Box>
                                </MenuItem>
                                <MenuItem value="both">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <FingerprintIcon />
                                        <FaceIcon />
                                        Both Fingerprint & Face
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>

                        {enrollmentStatus && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Current Status: {enrollmentStatus.status}
                                {enrollmentStatus.instructions && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {enrollmentStatus.instructions}
                                    </Typography>
                                )}
                            </Alert>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Ready to Start Automatic Enrollment
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            The system will automatically enroll {enrollmentType} biometric data for {staff?.name}
                        </Typography>

                        <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Enrollment Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Staff Name:
                                        </Typography>
                                        <Typography variant="body1">{staff?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Staff ID:
                                        </Typography>
                                        <Typography variant="body1">{staff?.staff_id}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Device User ID:
                                        </Typography>
                                        <Typography variant="body1">
                                            {staff?.biometric?.deviceUserId || "N/A"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Enrollment Type:
                                        </Typography>
                                        <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                                            {enrollmentType}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Alert severity="info">
                            <Typography variant="body2">
                                The system will put the biometric device in enrollment mode. You will need to physically
                                interact with the device to complete the enrollment process.
                            </Typography>
                        </Alert>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Device in Enrollment Mode
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            The biometric device is now in enrollment mode. Please go to the device and follow the
                            prompts.
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <LinearProgress />
                            <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                                Waiting for user interaction with device...
                            </Typography>
                        </Box>

                        {enrollmentResult && (
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Enrollment Details
                                    </Typography>
                                    <Typography variant="body2">
                                        Machine: {enrollmentResult.machine?.name} ({enrollmentResult.machine?.location})
                                    </Typography>
                                    <Typography variant="body2">
                                        IP Address: {enrollmentResult.machine?.ip_address}
                                    </Typography>
                                    <Typography variant="body2">
                                        Device User ID: {enrollmentResult.deviceUserId}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                );

            case 3:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Enrollment Status
                        </Typography>

                        {isCheckingStatus ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2">Fetching status...</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ mb: 3 }}>
                                <Button
                                    startIcon={<RefreshIcon />}
                                    onClick={checkCurrentStatus}
                                    variant="outlined"
                                    size="small"
                                >
                                    Refresh Status
                                </Button>
                            </Box>
                        )}

                        {enrollmentStatus && (
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                        <Chip
                                            icon={getStatusIcon(enrollmentStatus.status)}
                                            label={enrollmentStatus.status?.toUpperCase()}
                                            color={getStatusColor(enrollmentStatus.status)}
                                            variant="filled"
                                        />
                                        {enrollmentStatus.instructions && (
                                            <Typography variant="body2" color="textSecondary">
                                                {enrollmentStatus.instructions}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <FingerprintIcon />
                                                <Typography variant="body2">
                                                    Fingerprint:{" "}
                                                    {enrollmentStatus.fingerprint?.enrolled
                                                        ? "✓ Enrolled"
                                                        : "✗ Not Enrolled"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <FaceIcon />
                                                <Typography variant="body2">
                                                    Face:{" "}
                                                    {enrollmentStatus.face?.enrolled ? "✓ Enrolled" : "✗ Not Enrolled"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {enrollmentStatus.startedAt && (
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ mt: 2, display: "block" }}
                                        >
                                            Started: {new Date(enrollmentStatus.startedAt).toLocaleString()}
                                        </Typography>
                                    )}

                                    {enrollmentStatus.completedAt && (
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ mt: 1, display: "block" }}
                                        >
                                            Completed: {new Date(enrollmentStatus.completedAt).toLocaleString()}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    const handleNext = () => {
        if (activeStep === 1) {
            handleStartEnrollment();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = () => {
        setActiveStep(0);
        setEnrollmentStatus(null);
        setEnrollmentResult(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { minHeight: "600px" },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Biometric Enrollment - {staff?.name}</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {renderStepContent(index)}
                                <Box sx={{ mb: 2, mt: 2 }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                            disabled={isLoading || isCheckingStatus}
                                        >
                                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                                        </Button>
                                        <Button
                                            disabled={activeStep === 0 || isLoading}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                        {activeStep === 2 && (
                                            <Button
                                                color="error"
                                                onClick={handleCancelEnrollment}
                                                sx={{ mt: 1 }}
                                                disabled={isLoading}
                                            >
                                                Cancel Enrollment
                                            </Button>
                                        )}
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>{activeStep === steps.length - 1 ? "Close" : "Cancel"}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BiometricEnrollmentModal;
