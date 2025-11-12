import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
    Box,
    TablePagination,
    CircularProgress,
    Tooltip,
    IconButton,
    Stack,
    Divider,
    Badge,
} from "@mui/material";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import LogDetailsModal from "./LogDetailsModal";

const LogsTable = ({ data, loading, pagination, onPageChange }) => {
    const [selectedLog, setSelectedLog] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const getActionColor = (action) => {
        switch (action) {
            // Authentication Actions
            case "LOGIN_SUCCESS":
                return "success";
            case "LOGIN_FAILED":
                return "error";
            case "LOGOUT":
                return "info";

            // Password Management Actions
            case "PASSWORD_CHANGED":
            case "PASSWORD_RESET":
                return "warning";
            case "PASSWORD_CHANGE_FAILED":
            case "PASSWORD_RESET_FAILED":
            case "PASSWORD_RESET_OTP_FAILED":
                return "error";
            case "PASSWORD_RESET_OTP_SENT":
                return "info";

            // CRUD Actions
            case "CREATE":
                return "primary";
            case "UPDATE":
                return "info";
            case "DELETE":
                return "error";
            case "READ":
                return "default";

            // HTTP Method Actions
            case "GET":
                return "default";
            case "POST":
                return "primary";
            case "PUT":
            case "PATCH":
                return "info";

            // Custom Actions
            case "CUSTOM":
                return "secondary";

            default:
                return "default";
        }
    };

    const getModuleColor = (module) => {
        switch (module) {
            // Core System Modules
            case "auth":
                return "primary";
            case "members":
                return "success";
            case "staff":
                return "warning";
            case "plans":
                return "info";
            case "common":
                return "default";
            case "activity":
                return "info";
            case "bookings":
                return "secondary";
            case "payment":
                return "success";
            case "events":
                return "error";
            case "reports":
                return "primary";
            case "halls":
                return "default";
            case "logs":
                return "secondary";

            // Biometric Modules
            case "biometric/machines":
                return "secondary";
            case "biometric/attendance":
                return "primary";
            case "biometric/staff":
                return "warning";
            case "biometric/regularization":
                return "error";
            case "biometric/notifications":
                return "info";

            // Masters Modules
            case "masters/batch":
                return "primary";
            case "masters/facility":
                return "success";
            case "masters/location":
                return "info";
            case "masters/category":
                return "warning";
            case "masters/teams":
                return "secondary";
            case "masters/gallery":
                return "default";
            case "masters/banner":
                return "primary";
            case "masters/faqs":
                return "info";
            case "masters/testimonials":
                return "success";
            case "masters/notice":
                return "warning";
            case "masters/fees-category":
                return "error";

            // CMS Modules
            case "cms/home-page":
                return "primary";
            case "cms/about-page":
                return "info";
            case "cms/settings":
                return "secondary";

            // Legacy support for old module names
            case "biometric":
                return "info";
            case "machines":
                return "secondary";
            case "attendance":
                return "primary";
            case "notifications":
                return "warning";
            case "regularization":
                return "error";
            case "activities":
                return "info";
            case "bookings":
                return "secondary";
            case "payments":
                return "success";
            case "events":
                return "error";
            case "halls":
                return "default";

            default:
                return "default";
        }
    };

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setDetailDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailDialogOpen(false);
        setSelectedLog(null);
    };

    const formatMetadata = (metadata, staffInfo) => {
        if (!metadata) return "N/A";

        try {
            const parsed = typeof metadata === "string" ? JSON.parse(metadata) : metadata;
            const relevantFields = [];

            if (parsed.userEmail) relevantFields.push(`Email: ${parsed.userEmail}`);
            if (parsed.userRole) relevantFields.push(`Role: ${parsed.userRole}`);
            if (parsed.loginType) relevantFields.push(`Type: ${parsed.loginType}`);
            if (parsed.staffId) relevantFields.push(`Staff ID: ${parsed.staffId}`);
            if (staffInfo) relevantFields.push(`Staff: ${staffInfo.name} (${staffInfo.designation})`);
            if (parsed.memberId) relevantFields.push(`Member ID: ${parsed.memberId}`);
            if (parsed.attemptedEmail) relevantFields.push(`Attempted: ${parsed.attemptedEmail}`);
            if (parsed.errorMessage) relevantFields.push(`Error: ${parsed.errorMessage}`);
            if (parsed.changeType) relevantFields.push(`Change: ${parsed.changeType}`);
            if (parsed.resetType) relevantFields.push(`Reset: ${parsed.resetType}`);
            if (parsed.otpSent) relevantFields.push(`OTP: Sent`);

            return relevantFields.length > 0 ? relevantFields.join(", ") : "N/A";
        } catch (error) {
            return "N/A";
        }
    };

    const handleChangePage = (event, newPage) => {
        onPageChange(newPage + 1); // Convert to 1-based indexing
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="logs table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Module</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>User Information</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No logs found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((log, index) => {
                                const metadata =
                                    typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata || {};
                                const responseStatus = metadata.responseStatus;

                                return (
                                    <TableRow key={log._id || index} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {log.createdAt
                                                    ? format(new Date(log.createdAt), "MM-dd HH:mm:ss")
                                                    : "N/A"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {log.createdAt ? format(new Date(log.createdAt), "yyyy-MM-dd") : ""}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Chip
                                                    label={log.action}
                                                    color={getActionColor(log.action)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                {(log.action === "UPDATE" ||
                                                    log.action === "PUT" ||
                                                    log.action === "PATCH") &&
                                                    metadata.changes &&
                                                    Object.keys(metadata.changes).length > 0 && (
                                                        <Tooltip
                                                            title={`${
                                                                Object.keys(metadata.changes).length
                                                            } field(s) changed`}
                                                        >
                                                            <Chip
                                                                icon={<EditIcon />}
                                                                label={Object.keys(metadata.changes).length}
                                                                size="small"
                                                                color="primary"
                                                                variant="filled"
                                                            />
                                                        </Tooltip>
                                                    )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.module}
                                                color={getModuleColor(log.module)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 250, wordBreak: "break-word" }}>
                                                {log.description || "N/A"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {log.staffInfo ? (
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {log.staffInfo.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {log.staffInfo.designation} • {log.staffInfo.email}
                                                    </Typography>
                                                </Box>
                                            ) : log.userInfo ? (
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {log.userInfo.name || "Unknown User"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {log.userInfo.email} • {log.userInfo.roles}
                                                    </Typography>
                                                </Box>
                                            ) : metadata.userEmail ? (
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {metadata.userEmail}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {metadata.userRole || "Unknown Role"}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Unknown User
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                                {log.ip || "N/A"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {responseStatus && (
                                                <Chip
                                                    label={responseStatus}
                                                    size="small"
                                                    color={
                                                        responseStatus >= 400
                                                            ? "error"
                                                            : responseStatus >= 300
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="View Details" placement="top">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewDetails(log)}
                                                        color="primary"
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip
                                                    title={formatMetadata(log.metadata, log.staffInfo)}
                                                    placement="top"
                                                    arrow
                                                >
                                                    <IconButton size="small" color="info">
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1} // Convert to 0-based indexing
                onPageChange={handleChangePage}
                rowsPerPage={pagination.limit}
                rowsPerPageOptions={[10, 25, 50, 100]}
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
            />

            {/* Log Details Dialog */}
            <LogDetailsModal open={detailDialogOpen} onClose={handleCloseDetails} log={selectedLog} />
        </Box>
    );
};

export default LogsTable;
