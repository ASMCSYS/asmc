import React, { Fragment, useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, Grid, Paper, Stack, Typography, Chip } from "@mui/material";
import DatePickerComponent from "../../../components/Common/DatePicker";
import BasicSelect from "../../../components/Common/Select";
import Button from "../../../components/Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "../../../helpers/utils";
import AutoCompleteSelect from "../../../components/Common/AutoCompleteSelect";
import LogsTable from "../../../components/admin/logs-manager/LogsTable";
import LogsStats from "../../../components/admin/logs-manager/LogsStats";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const LogsContainer = () => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [logsData, setLogsData] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
    });

    // Filter states
    const [selectedAction, setSelectedAction] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedUserRole, setSelectedUserRole] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    // Action options - Comprehensive list based on actual system actions
    const actionOptions = [
        { value: "", label: "All Actions" },

        // Authentication Actions
        { value: "LOGIN_SUCCESS", label: "Login Success" },
        { value: "LOGIN_FAILED", label: "Login Failed" },
        { value: "LOGOUT", label: "Logout" },

        // Password Management Actions
        { value: "PASSWORD_CHANGED", label: "Password Changed" },
        { value: "PASSWORD_CHANGE_FAILED", label: "Password Change Failed" },
        { value: "PASSWORD_RESET", label: "Password Reset" },
        { value: "PASSWORD_RESET_FAILED", label: "Password Reset Failed" },
        { value: "PASSWORD_RESET_OTP_SENT", label: "Password Reset OTP Sent" },
        { value: "PASSWORD_RESET_OTP_FAILED", label: "Password Reset OTP Failed" },

        // CRUD Actions
        { value: "CREATE", label: "Create" },
        { value: "READ", label: "Read" },
        { value: "UPDATE", label: "Update" },
        { value: "DELETE", label: "Delete" },

        // HTTP Method Actions
        { value: "GET", label: "GET Request" },
        { value: "POST", label: "POST Request" },
        { value: "PUT", label: "PUT Request" },
        { value: "PATCH", label: "PATCH Request" },

        // Custom Actions
        { value: "CUSTOM", label: "Custom" },
    ];

    // Module options - Comprehensive list based on actual system routes
    const moduleOptions = [
        { value: "", label: "All Modules" },

        // Core System Modules
        { value: "auth", label: "Authentication" },
        { value: "members", label: "Members" },
        { value: "staff", label: "Staff" },
        { value: "plans", label: "Plans" },
        { value: "common", label: "Common" },
        { value: "activity", label: "Activities" },
        { value: "bookings", label: "Bookings" },
        { value: "payment", label: "Payments" },
        { value: "events", label: "Events" },
        { value: "reports", label: "Reports" },
        { value: "halls", label: "Halls" },
        { value: "logs", label: "Logs" },

        // Biometric Modules
        { value: "biometric/machines", label: "Biometric Machines" },
        { value: "biometric/attendance", label: "Biometric Attendance" },
        { value: "biometric/staff", label: "Biometric Staff" },
        { value: "biometric/regularization", label: "Biometric Regularization" },
        { value: "biometric/notifications", label: "Biometric Notifications" },

        // Masters Modules (Nested)
        { value: "masters/batch", label: "Masters - Batch" },
        { value: "masters/facility", label: "Masters - Facility" },
        { value: "masters/location", label: "Masters - Location" },
        { value: "masters/category", label: "Masters - Category" },
        { value: "masters/teams", label: "Masters - Teams" },
        { value: "masters/gallery", label: "Masters - Gallery" },
        { value: "masters/banner", label: "Masters - Banner" },
        { value: "masters/faqs", label: "Masters - FAQs" },
        { value: "masters/testimonials", label: "Masters - Testimonials" },
        { value: "masters/notice", label: "Masters - Notice" },
        { value: "masters/fees-category", label: "Masters - Fees Category" },

        // CMS Modules
        { value: "cms/home-page", label: "CMS - Home Page" },
        { value: "cms/about-page", label: "CMS - About Page" },
        { value: "cms/settings", label: "CMS - Settings" },
    ];

    // User role options
    const userRoleOptions = [
        { value: "", label: "All Roles" },
        { value: "admin", label: "Admin" },
        { value: "super", label: "Super" },
        { value: "staff", label: "Staff" },
        { value: "member", label: "Member" },
    ];

    // Fetch logs data
    const fetchLogsData = async (page = 1) => {
        try {
            setLoading(true);
            let url = `/logs/search?page=${page}&limit=${pagination.limit}`;

            // Add filters
            if (startDate) {
                url += `&startDate=${format(startDate, "yyyy-MM-dd")}`;
            }
            if (endDate) {
                url += `&endDate=${format(endDate, "yyyy-MM-dd")}`;
            }
            if (selectedAction) {
                url += `&action=${selectedAction}`;
            }
            if (selectedModule) {
                url += `&module=${selectedModule}`;
            }
            if (selectedUserRole) {
                url += `&userRole=${selectedUserRole}`;
            }
            if (searchKeyword) {
                url += `&keywords=${searchKeyword}`;
            }

            const response = await axios.get(url);
            setLogsData(response.result.data || []);
            setPagination((prev) => ({
                ...prev,
                page,
                total: response.result.total || 0,
            }));
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Failed to fetch logs data",
                    severity: "error",
                }),
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await axios.get("/logs/stats");
            setStatsData(response.result);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        fetchLogsData(newPage);
    };

    // Handle export
    const handleExport = async () => {
        try {
            setExporting(true);
            let url = `/logs/export`;
            const params = [];

            // Add filters
            if (startDate) {
                params.push(`startDate=${format(startDate, "yyyy-MM-dd")}`);
            }
            if (endDate) {
                params.push(`endDate=${format(endDate, "yyyy-MM-dd")}`);
            }
            if (selectedAction) {
                params.push(`action=${selectedAction}`);
            }
            if (selectedModule) {
                params.push(`module=${selectedModule}`);
            }
            if (selectedUserRole) {
                params.push(`userRole=${selectedUserRole}`);
            }
            if (searchKeyword) {
                params.push(`keywords=${searchKeyword}`);
            }

            if (params.length > 0) {
                url += `?${params.join("&")}`;
            }

            const response = await axios.get(url, { responseType: "blob" });
            const urlBlob = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", `logs_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            dispatch(
                setSnackBar({
                    open: true,
                    message: "Logs exported successfully",
                    severity: "success",
                }),
            );
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Failed to export logs",
                    severity: "error",
                }),
            );
        } finally {
            setExporting(false);
        }
    };

    // Apply filters
    const applyFilters = () => {
        fetchLogsData(1);
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectedAction("");
        setSelectedModule("");
        setSelectedUserRole("");
        setSearchKeyword("");
        fetchLogsData(1);
    };

    // Initial data fetch
    useEffect(() => {
        fetchLogsData();
        fetchStats();
    }, []);

    return (
        <Stack gap={2}>
            {/* Header */}
            <Paper sx={{ padding: 2 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h5">System Logs</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Monitor and analyze system activities and user actions
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Cards */}
            {statsData && <LogsStats stats={statsData} />}

            {/* Filters */}
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Filters
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <DatePickerComponent
                            id="start_date"
                            name="start_date"
                            label="Start Date"
                            onChange={(val) => setStartDate(val)}
                            value={startDate}
                            fullWidth
                            minDate={null}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePickerComponent
                            id="end_date"
                            name="end_date"
                            label="End Date"
                            onChange={(val) => setEndDate(val)}
                            value={endDate}
                            fullWidth
                            minDate={null}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <BasicSelect
                            size="small"
                            value={selectedAction}
                            onChange={(e) => setSelectedAction(e.target.value)}
                            displayEmpty
                            label="Action Type"
                            name="action"
                            id="action"
                            items={actionOptions}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <BasicSelect
                            size="small"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            displayEmpty
                            label="Module"
                            name="module"
                            id="module"
                            items={moduleOptions}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <BasicSelect
                            size="small"
                            value={selectedUserRole}
                            onChange={(e) => setSelectedUserRole(e.target.value)}
                            displayEmpty
                            label="User Role"
                            name="userRole"
                            id="userRole"
                            items={userRoleOptions}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <input
                            type="text"
                            placeholder="Search keywords..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack direction="row" spacing={2}>
                            <Button size="large" type="button" onClick={applyFilters} loading={loading}>
                                Apply Filters
                            </Button>
                            <Button size="large" type="button" onClick={clearFilters} variant="outlined">
                                Clear Filters
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Export Button */}
            <Paper sx={{ padding: 2 }}>
                <Grid container justifyContent="flex-end">
                    <HasPermission permission={PERMISSIONS.LOGS.EXPORT} fallback={null}>
                        <Button size="large" type="button" onClick={handleExport} loading={exporting}>
                            Export Logs
                        </Button>
                    </HasPermission>
                </Grid>
            </Paper>

            {/* Logs Table */}
            <Paper sx={{ width: "100%" }}>
                <LogsTable data={logsData} loading={loading} pagination={pagination} onPageChange={handlePageChange} />
            </Paper>
        </Stack>
    );
};

export default LogsContainer;
