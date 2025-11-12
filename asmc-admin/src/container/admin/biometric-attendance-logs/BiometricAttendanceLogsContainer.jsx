import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Add as AddIcon, Sync as SyncIcon, CloudUpload as ImportIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";
import { format } from "date-fns";
import AttendanceLogAddDrawer from "../../../components/admin/biometric-attendance-logs/AttendanceLogAddDrawer";
import RegularizationRequestDrawer from "../../../components/admin/biometric-attendance-logs/RegularizationRequestDrawer";
import RegularizationHistoryDrawer from "../../../components/admin/biometric-attendance-logs/RegularizationHistoryDrawer";
import AttendanceLogsTable from "../../../components/admin/biometric-attendance-logs/AttendanceLogsTable";
import AttendanceStats from "../../../components/admin/biometric-attendance-logs/AttendanceStats";
import AttendanceFilters from "../../../components/admin/biometric-attendance-logs/AttendanceFilters";
import AttendanceMachineImportModal from "../../../components/admin/biometric-attendance-logs/AttendanceMachineImportModal";

const BiometricAttendanceLogsContainer = () => {
    const dispatch = useDispatch();
    const [logs, setLogs] = useState([]);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [stats, setStats] = useState({});

    // Pagination state
    const [pagination, setPagination] = useState({
        pageNo: 0,
        limit: 25,
        sortBy: -1,
        sortField: "timestamp",
        keywords: "",
        filter_by: "any_word",
    });

    // Filters
    const [filters, setFilters] = useState({
        machine_id: "",
        type: "",
        start_date: null,
        end_date: null,
    });

    const [openDrawer, setOpenDrawer] = useState(false);
    const [openRegularizationDrawer, setOpenRegularizationDrawer] = useState(false);
    const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    // Fetch machines for filter dropdown
    const fetchMachines = async () => {
        try {
            const response = await axios.get(`${baseUrl}/biometric/machines`);
            if (response.success) {
                setMachines(response.result.data);
            }
        } catch (error) {
            console.error("Failed to fetch machines:", error);
        }
    };

    // Fetch attendance logs
    const fetchLogs = async (customPagination = pagination) => {
        setLoading(true);
        try {
            const params = {
                page: customPagination.pageNo + 1,
                limit: customPagination.limit,
                sortBy: customPagination.sortBy,
                sortField: customPagination.sortField,
                keywords: customPagination.keywords,
                filter_by: customPagination.filter_by,
                ...filters,
            };

            // Convert dates to ISO string
            if (filters.start_date) {
                params.start_date = format(filters.start_date, "yyyy-MM-dd");
            }
            if (filters.end_date) {
                params.end_date = format(filters.end_date, "yyyy-MM-dd");
            }

            const response = await axios.get(`${baseUrl}/biometric/attendance`, { params });
            if (response.success) {
                setLogs(response.result.data);
                setPagination((prev) => ({
                    ...prev,
                    ...customPagination,
                    totalCount: response.result.pagination.total_count,
                }));
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Failed to fetch attendance logs",
                    severity: "error",
                }),
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const params = {};
            if (filters.machine_id) params.machine_id = filters.machine_id;
            if (filters.start_date) params.start_date = format(filters.start_date, "yyyy-MM-dd");
            if (filters.end_date) params.end_date = format(filters.end_date, "yyyy-MM-dd");

            const response = await axios.get(`${baseUrl}/biometric/attendance/stats`, { params });
            if (response.success) {
                setStats(response.result);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [filters]);

    // Handle filter change
    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
        setPagination((prev) => ({ ...prev, pageNo: 0 })); // Reset to first page when filters change
    };

    // Handle pagination
    const handlePagination = (newPagination) => {
        setPagination((prev) => ({ ...prev, ...newPagination }));
        fetchLogs({ ...pagination, ...newPagination });
    };

    // Handle drawer success
    const handleDrawerSuccess = () => {
        fetchLogs();
        fetchStats();
    };

    // Handle regularization request
    const handleRegularizationRequest = (log) => {
        setSelectedLog(log);
        setOpenRegularizationDrawer(true);
    };

    // Handle view regularization history
    const handleViewHistory = (log) => {
        setSelectedLog(log);
        setOpenHistoryDrawer(true);
    };

    // Sync attendance logs from device
    const syncAttendanceLogs = async (machineId) => {
        setSyncing(true);
        try {
            const response = await axios.post(`${baseUrl}/biometric/attendance/sync/${machineId}`);
            if (response.success) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: `Synced ${response.result.synced_count} logs from device`,
                        severity: "success",
                    }),
                );
                // Refresh logs and stats after sync
                fetchLogs();
                fetchStats();
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Sync failed",
                    severity: "error",
                }),
            );
        } finally {
            setSyncing(false);
        }
    };

    // Sync all machines
    const syncAllMachines = async () => {
        setSyncing(true);
        try {
            const syncPromises = machines.map((machine) =>
                axios.post(`${baseUrl}/biometric/attendance/sync/${machine.machine_id}`),
            );

            const results = await Promise.allSettled(syncPromises);
            let totalSynced = 0;

            results.forEach((result, index) => {
                if (result.status === "fulfilled" && result.value.success) {
                    totalSynced += result.value.result.synced_count;
                }
            });

            dispatch(
                setSnackBar({
                    open: true,
                    message: `Synced ${totalSynced} logs from all devices`,
                    severity: "success",
                }),
            );

            // Refresh logs and stats after sync
            fetchLogs();
            fetchStats();
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Sync failed",
                    severity: "error",
                }),
            );
        } finally {
            setSyncing(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Biometric Attendance Logs
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ImportIcon />}
                        onClick={() => setOpenImportModal(true)}
                        disabled={machines.length === 0}
                    >
                        Import Machine Data
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SyncIcon />}
                        onClick={syncAllMachines}
                        disabled={syncing || machines.length === 0}
                    >
                        {syncing ? "Syncing..." : "Sync All Devices"}
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDrawer(true)}>
                        Add Log Entry
                    </Button>
                </Stack>
            </Stack>

            {/* Statistics Cards */}
            <AttendanceStats stats={stats} />

            {/* Filters */}
            <AttendanceFilters
                filters={filters}
                machines={machines}
                onFilterChange={handleFilterChange}
                onSyncDevice={syncAttendanceLogs}
                onRefresh={() => {
                    fetchLogs();
                    fetchStats();
                }}
                pagination={pagination}
                handlePagination={handlePagination}
                syncing={syncing}
                loading={loading}
            />

            {/* Attendance Logs Table */}
            <AttendanceLogsTable
                data={logs}
                loading={loading}
                pagination={pagination}
                handlePagination={handlePagination}
                count={pagination.totalCount || 0}
                onRegularizationRequest={handleRegularizationRequest}
                onViewHistory={handleViewHistory}
            />

            {/* Add Log Entry Drawer */}
            <AttendanceLogAddDrawer
                show={openDrawer}
                close={() => setOpenDrawer(false)}
                onSuccess={handleDrawerSuccess}
            />

            {/* Regularization Request Drawer */}
            <RegularizationRequestDrawer
                show={openRegularizationDrawer}
                close={() => setOpenRegularizationDrawer(false)}
                onSuccess={handleDrawerSuccess}
                attendanceLog={selectedLog}
            />

            {/* Regularization History Drawer */}
            <RegularizationHistoryDrawer
                show={openHistoryDrawer}
                close={() => setOpenHistoryDrawer(false)}
                attendanceLogId={selectedLog?.log_id}
            />

            {/* Machine Data Import Modal */}
            <AttendanceMachineImportModal
                open={openImportModal}
                onClose={() => setOpenImportModal(false)}
                onSuccess={handleDrawerSuccess}
                machines={machines}
            />
        </Box>
    );
};

export default BiometricAttendanceLogsContainer;
