import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";
import { format } from "date-fns";

const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return "success";
        case "rejected":
            return "error";
        case "pending":
            return "warning";
        default:
            return "default";
    }
};

const getRequestTypeLabel = (type) => {
    switch (type) {
        case "time_change":
            return "Time Change";
        case "status_change":
            return "Status Change";
        case "add_log":
            return "Add Log";
        case "delete_log":
            return "Delete Log";
        default:
            return type;
    }
};

export const RegularizationHistoryDrawer = ({ show, close, attendanceLogId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && attendanceLogId) {
            fetchRegularizationHistory();
        }
    }, [show, attendanceLogId]);

    const fetchRegularizationHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseUrl}/biometric/regularization/history/${attendanceLogId}`);
            if (response.success) {
                setHistory(response.result);
            } else {
                setError("Failed to fetch regularization history");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch regularization history");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        close();
        setHistory([]);
        setError(null);
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
                        Regularization History
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                {/* Content */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : history.length === 0 ? (
                    <Alert severity="info">No regularization history found for this attendance log.</Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Request Type</TableCell>
                                    <TableCell>Requested By</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Approved By</TableCell>
                                    <TableCell>Approval Reason</TableCell>
                                    <TableCell>Request Date</TableCell>
                                    <TableCell>Approval Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {getRequestTypeLabel(item.request_type)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{item.requested_by_name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                {item.reason}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.status}
                                                color={getStatusColor(item.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{item.approved_by_name || "N/A"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                {item.approval_reason || "N/A"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {format(new Date(item.created_at), "dd/MM/yyyy HH:mm")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {item.approved_at
                                                    ? format(new Date(item.approved_at), "dd/MM/yyyy HH:mm")
                                                    : "N/A"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Drawer>
    );
};

export default RegularizationHistoryDrawer;
