import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Divider,
    IconButton,
} from "@mui/material";
import {
    Close as CloseIcon,
    CloudUpload as UploadIcon,
    Download as DownloadIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
} from "@mui/icons-material";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";
import coreAxios from "axios";
import { getCookie } from "../../../helpers/cookies";

const AttendanceMachineImportModal = ({ open, onClose, onSuccess, machines }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedMachine, setSelectedMachine] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileFormat, setFileFormat] = useState("csv");
    const [importing, setImporting] = useState(false);
    const [validating, setValidating] = useState(false);
    const [validationResults, setValidationResults] = useState(null);
    const [importResults, setImportResults] = useState(null);
    const [error, setError] = useState("");

    const steps = ["Select Machine", "Upload File", "Validate Data", "Import Results"];

    const handleClose = () => {
        setActiveStep(0);
        setSelectedMachine("");
        setSelectedFile(null);
        setFileFormat("csv");
        setImporting(false);
        setValidating(false);
        setValidationResults(null);
        setImportResults(null);
        setError("");
        onClose();
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const ext = file.name.split(".").pop().toLowerCase();
            setFileFormat(ext === "csv" ? "csv" : "txt");
            setError("");
        }
    };

    const downloadSampleFile = async () => {
        try {
            // Use coreAxios directly to bypass the interceptor that modifies blob responses
            const response = await coreAxios.get(`${baseUrl}/biometric/attendance/import/sample?format=${fileFormat}`, {
                responseType: "blob",
                headers: {
                    Authorization: `BEARER ${getCookie("asmc_token")}`,
                },
            });

            // Check if response is successful
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create blob from response data
            const blob = new Blob([response.data], {
                type: fileFormat === "csv" ? "text/csv" : "text/plain",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `machine_attendance_sample.${fileFormat}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            setError(`Failed to download sample file: ${error.message}`);
        }
    };

    const validateData = async () => {
        if (!selectedFile || !selectedMachine) {
            setError("Please select a machine and file");
            return;
        }

        setValidating(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("machine_id", selectedMachine);

            const response = await axios.post(`${baseUrl}/biometric/attendance/import/validate`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.success) {
                setValidationResults(response.result);
                // Don't automatically go to next step - let user click Next manually
            } else {
                setError(response.message || "Validation failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Validation failed");
        } finally {
            setValidating(false);
        }
    };

    const importData = async () => {
        if (!selectedFile || !selectedMachine) {
            setError("Please select a machine and file");
            return;
        }

        setImporting(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("machine_id", selectedMachine);

            const response = await axios.post(`${baseUrl}/biometric/attendance/import`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.success) {
                setImportResults(response.result);
                handleNext();
                onSuccess(); // Refresh the main data
            } else {
                setError(response.message || "Import failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Import failed");
        } finally {
            setImporting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "success":
                return <CheckCircleIcon color="success" fontSize="small" />;
            case "error":
                return <ErrorIcon color="error" fontSize="small" />;
            case "duplicate":
                return <WarningIcon color="warning" fontSize="small" />;
            default:
                return <InfoIcon color="info" fontSize="small" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "success";
            case "error":
                return "error";
            case "duplicate":
                return "warning";
            default:
                return "default";
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ p: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Machine</InputLabel>
                            <Select
                                value={selectedMachine}
                                onChange={(e) => setSelectedMachine(e.target.value)}
                                label="Select Machine"
                            >
                                {machines.map((machine) => (
                                    <MenuItem key={machine.machine_id} value={machine.machine_id}>
                                        {machine.name} ({machine.location})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Select the machine that the exported data belongs to. This will be used for staff mapping
                            and duplicate detection.
                        </Alert>
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Upload Machine Export File
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Upload the attendance data exported from your biometric machine.
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={downloadSampleFile}
                                sx={{ mr: 2 }}
                            >
                                Download Sample ({fileFormat.toUpperCase()})
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                    setFileFormat(fileFormat === "csv" ? "txt" : "csv");
                                    downloadSampleFile();
                                }}
                            >
                                Download Sample ({fileFormat === "csv" ? "TXT" : "CSV"})
                            </Button>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <input
                                accept=".csv,.txt"
                                style={{ display: "none" }}
                                id="file-upload"
                                type="file"
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="file-upload">
                                <Button variant="contained" component="span" startIcon={<UploadIcon />} sx={{ mr: 2 }}>
                                    Choose File
                                </Button>
                            </label>
                            {selectedFile && (
                                <Chip
                                    label={selectedFile.name}
                                    onDelete={() => setSelectedFile(null)}
                                    color="primary"
                                />
                            )}
                        </Box>

                        <Alert severity="info">Supported formats: CSV, TXT. Maximum file size: 10MB.</Alert>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ p: 2 }}>
                        {validating ? (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Validating data...</Typography>
                            </Box>
                        ) : validationResults ? (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Validation Results
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                        <Chip
                                            label={`Total: ${validationResults.total_records}`}
                                            color="default"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Valid: ${validationResults.valid_count}`}
                                            color="success"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Duplicates: ${validationResults.duplicate_count}`}
                                            color="warning"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Errors: ${validationResults.error_count}`}
                                            color="error"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Staff Mapping
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Chip
                                            label={`Mapped: ${validationResults.staff_mapping.mapped}`}
                                            color="success"
                                            size="small"
                                        />
                                        <Chip
                                            label={`Unmapped: ${validationResults.staff_mapping.unmapped}`}
                                            color="warning"
                                            size="small"
                                        />
                                    </Stack>
                                </Box>

                                {validationResults.validation_results &&
                                    validationResults.validation_results.length > 0 && (
                                        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                                            <TableContainer component={Paper} variant="outlined">
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Row</TableCell>
                                                            <TableCell>Device User ID</TableCell>
                                                            <TableCell>Staff</TableCell>
                                                            <TableCell>Timestamp</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Issues</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {validationResults.validation_results
                                                            .slice(0, 20)
                                                            .map((result, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{result.row}</TableCell>
                                                                    <TableCell>{result.device_user_id}</TableCell>
                                                                    <TableCell>
                                                                        {result.staff_name}
                                                                        {result.staff_id && (
                                                                            <Typography
                                                                                variant="caption"
                                                                                display="block"
                                                                            >
                                                                                ID: {result.staff_id}
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>{result.timestamp}</TableCell>
                                                                    <TableCell>
                                                                        {result.issues.length === 0 ? (
                                                                            <Chip
                                                                                label="Valid"
                                                                                color="success"
                                                                                size="small"
                                                                            />
                                                                        ) : (
                                                                            <Chip
                                                                                label="Issues"
                                                                                color="error"
                                                                                size="small"
                                                                            />
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {result.issues.length > 0 ? (
                                                                            <Typography variant="caption" color="error">
                                                                                {result.issues.join(", ")}
                                                                            </Typography>
                                                                        ) : (
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="success"
                                                                            >
                                                                                No issues
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            {validationResults.validation_results.length > 20 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                                    Showing first 20 rows. Total:{" "}
                                                    {validationResults.validation_results.length}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                            </Box>
                        ) : null}
                    </Box>
                );

            case 3:
                return (
                    <Box sx={{ p: 2 }}>
                        {importing ? (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Importing data...</Typography>
                            </Box>
                        ) : importResults ? (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Import Results
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                        <Chip
                                            label={`Total: ${importResults.total_records}`}
                                            color="default"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Imported: ${importResults.imported_count}`}
                                            color="success"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Duplicates: ${importResults.duplicate_count}`}
                                            color="warning"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Errors: ${importResults.error_count}`}
                                            color="error"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Staff Mapping
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Chip
                                            label={`Mapped: ${importResults.staff_mapping.mapped}`}
                                            color="success"
                                            size="small"
                                        />
                                        <Chip
                                            label={`Unmapped: ${importResults.staff_mapping.unmapped}`}
                                            color="warning"
                                            size="small"
                                        />
                                    </Stack>
                                </Box>

                                {importResults.import_details && importResults.import_details.length > 0 && (
                                    <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                                        <TableContainer component={Paper} variant="outlined">
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Row</TableCell>
                                                        <TableCell>Device User ID</TableCell>
                                                        <TableCell>Staff</TableCell>
                                                        <TableCell>Timestamp</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Message</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {importResults.import_details.slice(0, 20).map((detail, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{detail.row}</TableCell>
                                                            <TableCell>{detail.device_user_id}</TableCell>
                                                            <TableCell>
                                                                {detail.staff_name}
                                                                {detail.staff_id && (
                                                                    <Typography variant="caption" display="block">
                                                                        ID: {detail.staff_id}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{detail.timestamp}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={detail.status}
                                                                    color={getStatusColor(detail.status)}
                                                                    size="small"
                                                                    icon={getStatusIcon(detail.status)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="caption">
                                                                    {detail.message}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        {importResults.import_details.length > 20 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                                Showing first 20 rows. Total: {importResults.import_details.length}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        ) : null}
                    </Box>
                );

            default:
                return null;
        }
    };

    const getStepActions = (step) => {
        switch (step) {
            case 0:
                return (
                    <Button onClick={handleNext} disabled={!selectedMachine} variant="contained">
                        Next
                    </Button>
                );
            case 1:
                return (
                    <Button onClick={handleNext} disabled={!selectedFile} variant="contained">
                        Next
                    </Button>
                );
            case 2:
                return (
                    <Box>
                        <Button onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                        </Button>
                        {!validationResults ? (
                            <Button onClick={validateData} disabled={validating} variant="contained">
                                {validating ? "Validating..." : "Validate Data"}
                            </Button>
                        ) : (
                            <Button onClick={handleNext} variant="contained" sx={{ mr: 1 }}>
                                Next
                            </Button>
                        )}
                        {validationResults && (
                            <Button onClick={importData} disabled={importing} variant="contained" color="success">
                                {importing ? "Importing..." : "Import Data"}
                            </Button>
                        )}
                    </Box>
                );
            case 3:
                return (
                    <Button onClick={handleClose} variant="contained">
                        Close
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Import Machine Data</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {renderStepContent(index)}
                                <Box sx={{ mb: 2 }}>{getStepActions(index)}</Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceMachineImportModal;
