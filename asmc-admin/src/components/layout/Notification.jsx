import React, { useRef, useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Badge,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Popper,
    Typography,
    useMediaQuery,
    Card,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

// assets
import NotificationsIcon from "@mui/icons-material/Notifications";
import Transitions from "../Common/Transition";
import { Close, CheckCircle, Cancel } from "@mui/icons-material";
import { axios } from "../../helpers/axios";
import { baseUrl } from "../../helpers/constants";
import { format } from "date-fns";

// sx styles
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: "1rem",
};

const actionSX = {
    mt: "6px",
    ml: 1,
    top: "auto",
    right: "auto",
    alignSelf: "flex-start",
    transform: "none",
};

// Helper functions
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

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [approvalDialog, setApprovalDialog] = useState(false);
    const [approvalReason, setApprovalReason] = useState("");
    const [processing, setProcessing] = useState(false);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseUrl}/biometric/notifications?limit=10`);
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

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? "profile-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge badgeContent={notifications.filter((n) => !n.is_read).length} color="primary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popper
                placement={matchesXs ? "bottom" : "bottom-end"}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [matchesXs ? -5 : 0, 9],
                            },
                        },
                    ],
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.shadows,
                                width: "100%",
                                minWidth: 285,
                                maxWidth: 420,
                                [theme.breakpoints.down("md")]: {
                                    maxWidth: 285,
                                },
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Card
                                    title="Notification"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <IconButton size="small" onClick={handleToggle}>
                                            <Close />
                                        </IconButton>
                                    }
                                >
                                    <List
                                        component="nav"
                                        sx={{
                                            p: 0,
                                            "& .MuiListItemButton-root": {
                                                py: 0.5,
                                                "& .MuiAvatar-root": avatarSX,
                                                "& .MuiListItemSecondaryAction-root": {
                                                    ...actionSX,
                                                    position: "relative",
                                                },
                                            },
                                        }}
                                    >
                                        {loading ? (
                                            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : error ? (
                                            <Alert severity="error" sx={{ m: 1 }}>
                                                {error}
                                            </Alert>
                                        ) : notifications.length === 0 ? (
                                            <ListItemButton disableTouchRipple>
                                                <ListItemText
                                                    primary={<Typography variant="body1">No notifications</Typography>}
                                                />
                                            </ListItemButton>
                                        ) : (
                                            notifications.map((notification, index) => (
                                                <React.Fragment key={notification._id}>
                                                    <ListItemButton
                                                        onClick={() => handleNotificationClick(notification)}
                                                        sx={{
                                                            backgroundColor: notification.is_read
                                                                ? "transparent"
                                                                : "action.hover",
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    <Typography variant="subtitle2">
                                                                        {getNotificationTypeLabel(notification.type)}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={notification.priority}
                                                                        color={getNotificationTypeColor(
                                                                            notification.type,
                                                                        )}
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
                                                                        {format(
                                                                            new Date(notification.created_at),
                                                                            "dd/MM/yyyy HH:mm",
                                                                        )}
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
                                                    </ListItemButton>
                                                    {index < notifications.length - 1 && <Divider />}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </List>
                                </Card>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>

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
        </Box>
    );
};

export default Notification;
