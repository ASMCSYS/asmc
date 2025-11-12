import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { Close, CheckCircle, Cancel } from "@mui/icons-material";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";
import { format } from "date-fns";

const getNotificationTypeColor = (type) => {
    switch (type) {
        case "regularization_request":
            return "warning";
        case "regularization_approved":
            return "success";
        case "regularization_rejected":
            return "error";
        default:
            return "default";
    }
};

const getNotificationTypeLabel = (type) => {
    switch (type) {
        case "regularization_request":
            return "Regularization Request";
        case "regularization_approved":
            return "Request Approved";
        case "regularization_rejected":
            return "Request Rejected";
        default:
            return type;
    }
};

export const NotificationDrawer = ({ show, close, onNotificationClick }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [approvalDialog, setApprovalDialog] = useState(false);
    const [approvalReason, setApprovalReason] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (show) {
            fetchNotifications();
        }
    }, [show]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseUrl}/biometric/notifications`);
            if (response.success) {
                setNotifications(response.result.data);
            } else {
                setError("Failed to fetch notifications");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`${baseUrl}/biometric/notifications/${notificationId}/read`);
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId ? { ...notification, is_read: true } : notification,
                ),
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        await markAsRead(notification._id);

        if (notification.type === "regularization_request") {
            setSelectedNotification(notification);
            setApprovalDialog(true);
        } else if (onNotificationClick) {
            onNotificationClick(notification);
        }
    };

    const handleApprove = async () => {
        if (!selectedNotification) return;

        setProcessing(true);
        try {
            // Handle both populated object and direct ID
            const regularizationId =
                selectedNotification.regularization_id?._id || selectedNotification.regularization_id;
            const response = await axios.put(`${baseUrl}/biometric/regularization/${regularizationId}/approve`, {
                approval_reason: approvalReason,
            });

            if (response.success) {
                setApprovalDialog(false);
                setSelectedNotification(null);
                setApprovalReason("");
                fetchNotifications();
            }
        } catch (error) {
            console.error("Failed to approve regularization:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedNotification) return;

        setProcessing(true);
        try {
            // Handle both populated object and direct ID
            const regularizationId =
                selectedNotification.regularization_id?._id || selectedNotification.regularization_id;
            const response = await axios.put(`${baseUrl}/biometric/regularization/${regularizationId}/reject`, {
                approval_reason: approvalReason,
            });

            if (response.success) {
                setApprovalDialog(false);
                setSelectedNotification(null);
                setApprovalReason("");
                fetchNotifications();
            }
        } catch (error) {
            console.error("Failed to reject regularization:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        close();
        setNotifications([]);
        setError(null);
        setSelectedNotification(null);
        setApprovalDialog(false);
        setApprovalReason("");
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={show}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: { xs: "100%", sm: "500px" } },
                }}
            >
                <Box sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5" component="h1">
                            Notifications
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
                    ) : notifications.length === 0 ? (
                        <Alert severity="info">No notifications found.</Alert>
                    ) : (
                        <List>
                            {notifications.map((notification) => (
                                <React.Fragment key={notification._id}>
                                    <ListItem
                                        button
                                        onClick={() => handleNotificationClick(notification)}
                                        sx={{
                                            backgroundColor: notification.is_read ? "transparent" : "action.hover",
                                            borderRadius: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        {getNotificationTypeLabel(notification.type)}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.priority}
                                                        color={getNotificationTypeColor(notification.type)}
                                                        size="small"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        {!notification.is_read && (
                                            <ListItemSecondaryAction>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        backgroundColor: "primary.main",
                                                    }}
                                                />
                                            </ListItemSecondaryAction>
                                        )}
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>
            </Drawer>

            {/* Approval Dialog */}
            <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Approve/Reject Regularization Request</DialogTitle>
                <DialogContent>
                    {selectedNotification && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Request from: {selectedNotification.requested_by_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Staff:{" "}
                                {selectedNotification.metadata?.staff_name || selectedNotification.attendance_log_id}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Reason: {selectedNotification.metadata?.reason}
                            </Typography>
                        </Box>
                    )}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Approval/Rejection Reason"
                        value={approvalReason}
                        onChange={(e) => setApprovalReason(e.target.value)}
                        placeholder="Please provide a reason for your decision..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApprovalDialog(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReject}
                        color="error"
                        startIcon={<Cancel />}
                        disabled={processing || !approvalReason.trim()}
                    >
                        {processing ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                        onClick={handleApprove}
                        color="success"
                        startIcon={<CheckCircle />}
                        disabled={processing || !approvalReason.trim()}
                    >
                        {processing ? "Processing..." : "Approve"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NotificationDrawer;
