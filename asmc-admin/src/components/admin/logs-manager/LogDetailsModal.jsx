import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Box,
    Chip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import {
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    CompareArrows as CompareArrowsIcon,
    Person as PersonIcon,
    Computer as ComputerIcon,
    Security as SecurityIcon,
    Visibility as VisibilityIcon,
    SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { JsonDiffComponent } from "json-diff-react";

const LogDetailsModal = ({ open, onClose, log }) => {
    // State for view toggle - must be called before any early returns
    const [viewMode, setViewMode] = useState("diff"); // 'diff', 'original', 'updated'

    if (!log) return null;

    const metadata = typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata || {};

    // Simple function to check if we have data to compare
    const hasComparisonData = (metadata) => {
        return metadata.originalData && metadata.updatedData;
    };

    // Clean data by removing MongoDB-specific fields and system fields
    const cleanDataForDiff = (data) => {
        if (!data) return data;

        const cleaned = { ...data };

        // Remove MongoDB and system fields
        const fieldsToRemove = [
            "_id",
            "__v",
            "createdAt",
            "updatedAt",
            "password",
            "token",
            "secret",
            "key",
            "authorization",
        ];

        fieldsToRemove.forEach((field) => {
            delete cleaned[field];
        });

        return cleaned;
    };

    // Render JSON data based on view mode
    const renderDataComparison = (originalData, updatedData) => {
        if (!originalData || !updatedData) {
            return (
                <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                        No comparison data available
                    </Typography>
                </Box>
            );
        }

        // Clean data for display
        const cleanedOriginal = cleanDataForDiff(originalData);
        const cleanedUpdated = cleanDataForDiff(updatedData);

        const getViewTitle = () => {
            switch (viewMode) {
                case "original":
                    return "Original Data (Before Update)";
                case "updated":
                    return "Updated Data (After Update)";
                default:
                    return "Data Comparison";
            }
        };

        const getViewChip = () => {
            switch (viewMode) {
                case "original":
                    return "Original Only";
                case "updated":
                    return "Updated Only";
                default:
                    return "Original vs Updated";
            }
        };

        const renderJsonData = (data, title) => (
            <Box sx={{ p: 2, maxHeight: "600px", overflow: "auto" }}>
                <TextField
                    fullWidth
                    multiline
                    rows={25}
                    value={JSON.stringify(data, null, 2)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        readOnly: true,
                        sx: {
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                            bgcolor: viewMode === "original" ? "#ffebee" : "#e8f5e8",
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                        },
                    }}
                />
            </Box>
        );

        return (
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
                {/* Header with Toggle */}
                <Box
                    sx={{
                        bgcolor: "grey.50",
                        p: 1.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {viewMode === "diff" ? (
                            <CompareArrowsIcon color="primary" fontSize="small" />
                        ) : (
                            <VisibilityIcon color="primary" fontSize="small" />
                        )}
                        <Typography variant="subtitle2" fontWeight="bold">
                            {getViewTitle()}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip label={getViewChip()} size="small" color="primary" variant="outlined" />
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, newMode) => newMode && setViewMode(newMode)}
                            size="small"
                        >
                            <ToggleButton value="original" sx={{ px: 1 }}>
                                <Typography variant="caption">Original</Typography>
                            </ToggleButton>
                            <ToggleButton value="diff" sx={{ px: 1 }}>
                                <SwapHorizIcon fontSize="small" />
                            </ToggleButton>
                            <ToggleButton value="updated" sx={{ px: 1 }}>
                                <Typography variant="caption">Updated</Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Box>

                {/* Content based on view mode */}
                {viewMode === "original" && renderJsonData(cleanedOriginal, "Original Data")}
                {viewMode === "updated" && renderJsonData(cleanedUpdated, "Updated Data")}
                {viewMode === "diff" && (
                    <Box sx={{ p: 2, maxHeight: "600px", overflow: "auto" }}>
                        <JsonDiffComponent
                            jsonA={cleanedOriginal}
                            jsonB={cleanedUpdated}
                            styleCustomization={{
                                additionLineStyle: { color: "green" },
                                deletionLineStyle: { color: "red" },
                                unchangedLineStyle: { color: "gray" },
                                frameStyle: {
                                    "font-family": "monospace",
                                    "white-space": "pre",
                                    background: "silver",
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
        );
    };

    // Check if we have comparison data
    const hasDataToCompare = hasComparisonData(metadata);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Log Details</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3}>
                    {/* Basic Information */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <SecurityIcon color="primary" />
                                <Typography variant="h6">Basic Information</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Action:
                                    </Typography>
                                    <Chip label={log.action} color="primary" size="small" />
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Module:
                                    </Typography>
                                    <Chip label={log.module} color="secondary" size="small" />
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Timestamp:
                                    </Typography>
                                    <Typography variant="body2" fontFamily="monospace">
                                        {log.createdAt ? format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Description:
                                    </Typography>
                                    <Typography variant="body2">{log.description || "N/A"}</Typography>
                                </Box>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    {/* User Information */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6">User Information</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                {log.staffInfo ? (
                                    <>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Staff Name:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {log.staffInfo.name}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Designation:
                                            </Typography>
                                            <Typography variant="body2">{log.staffInfo.designation}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Email:
                                            </Typography>
                                            <Typography variant="body2">{log.staffInfo.email}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Phone:
                                            </Typography>
                                            <Typography variant="body2">{log.staffInfo.phone || "N/A"}</Typography>
                                        </Box>
                                    </>
                                ) : log.userInfo ? (
                                    <>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                User Name:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {log.userInfo.name || "Unknown User"}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Email:
                                            </Typography>
                                            <Typography variant="body2">{log.userInfo.email}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Role:
                                            </Typography>
                                            <Chip label={log.userInfo.roles} size="small" />
                                        </Box>
                                    </>
                                ) : metadata.userEmail ? (
                                    <>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Email:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {metadata.userEmail}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Role:
                                            </Typography>
                                            <Chip label={metadata.userRole || "Unknown Role"} size="small" />
                                        </Box>
                                    </>
                                ) : (
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            User:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Unknown User
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    {/* Technical Details */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <ComputerIcon color="primary" />
                                <Typography variant="h6">Technical Details</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        IP Address:
                                    </Typography>
                                    <Typography variant="body2" fontFamily="monospace">
                                        {log.ip || "N/A"}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        User Agent:
                                    </Typography>
                                    <Typography variant="body2" sx={{ maxWidth: 300, wordBreak: "break-all" }}>
                                        {log.userAgent || "N/A"}
                                    </Typography>
                                </Box>
                                {metadata.method && (
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            HTTP Method:
                                        </Typography>
                                        <Chip label={metadata.method} size="small" />
                                    </Box>
                                )}
                                {metadata.path && (
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Path:
                                        </Typography>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {metadata.path}
                                        </Typography>
                                    </Box>
                                )}
                                {metadata.responseStatus && (
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Response Status:
                                        </Typography>
                                        <Chip
                                            label={metadata.responseStatus}
                                            size="small"
                                            color={
                                                metadata.responseStatus >= 400
                                                    ? "error"
                                                    : metadata.responseStatus >= 300
                                                    ? "warning"
                                                    : "success"
                                            }
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    {/* Data Comparison for UPDATE operations */}
                    {(log.action === "UPDATE" || log.action === "PUT" || log.action === "PATCH") &&
                        hasDataToCompare && (
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CompareArrowsIcon color="primary" />
                                        <Typography variant="h6">Data Comparison</Typography>
                                        <Chip
                                            label="Original vs Updated"
                                            size="small"
                                            color="primary"
                                            variant="filled"
                                        />
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={3}>
                                        {/* Note */}
                                        {metadata.note && (
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Note
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontStyle: "italic" }}
                                                >
                                                    {metadata.note}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider />

                                        {/* Data Comparison */}
                                        <Box>{renderDataComparison(metadata.originalData, metadata.requestBody)}</Box>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        )}

                    {/* Raw Data (for debugging) */}
                    {Object.keys(metadata).length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Raw Metadata</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={JSON.stringify(metadata, null, 2)}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                        sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogDetailsModal;
