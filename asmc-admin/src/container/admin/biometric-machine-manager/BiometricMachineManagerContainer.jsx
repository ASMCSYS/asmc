import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Visibility as ViewIcon,
    Computer as ComputerIcon,
    Wifi as WifiIcon,
    WifiOff as WifiOffIcon,
    Link as ConnectIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    AccessTime as AccessTimeIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";

const BiometricMachineManagerContainer = () => {
    const dispatch = useDispatch();
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMachine, setEditingMachine] = useState(null);
    const [testingConnection, setTestingConnection] = useState({});
    const [connectionResults, setConnectionResults] = useState({});
    const [networkInfo, setNetworkInfo] = useState(null);
    const [scanningNetwork, setScanningNetwork] = useState(false);
    const [foundDevices, setFoundDevices] = useState([]);
    const [testingESSL, setTestingESSL] = useState({});
    const [esslData, setEsslData] = useState({});
    const [formData, setFormData] = useState({
        machine_id: "",
        name: "",
        ip_address: "",
        port: 4370,
        location: "",
        description: "",
    });

    // Fetch network information
    const fetchNetworkInfo = async () => {
        try {
            const response = await axios.get(`${baseUrl}/biometric/machines/network-info`);
            if (response.success) {
                setNetworkInfo(response.result);
            }
        } catch (error) {
            console.error("Failed to fetch network info:", error);
        }
    };

    // Scan network for biometric devices
    const handleScanNetwork = async () => {
        setScanningNetwork(true);
        setFoundDevices([]);

        try {
            const response = await axios.get(`${baseUrl}/biometric/machines/scan-network`);
            if (response.success) {
                const result = response.result;
                setFoundDevices(result.devices || []);

                dispatch(
                    setSnackBar({
                        open: true,
                        message: `Network scan completed! Found ${result.devices?.length || 0} devices on ${
                            result.networkScanned
                        }`,
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Network scan failed",
                    severity: "error",
                }),
            );
        } finally {
            setScanningNetwork(false);
        }
    };

    // Test ESSL device info
    const handleTestESSLInfo = async (machineId) => {
        setTestingESSL((prev) => ({ ...prev, [machineId]: true }));

        try {
            const response = await axios.get(`${baseUrl}/biometric/machines/${machineId}/essl-info`);
            if (response.success) {
                setEsslData((prev) => ({ ...prev, [machineId]: response.result }));

                dispatch(
                    setSnackBar({
                        open: true,
                        message: "ESSL device info retrieved successfully!",
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Failed to get ESSL device info",
                    severity: "error",
                }),
            );
        } finally {
            setTestingESSL((prev) => ({ ...prev, [machineId]: false }));
        }
    };

    // Test ESSL attendance logs
    const handleTestESSLAttendance = async (machineId) => {
        setTestingESSL((prev) => ({ ...prev, [`${machineId}_attendance`]: true }));

        try {
            const response = await axios.get(`${baseUrl}/biometric/machines/${machineId}/essl-attendance`);
            if (response.success) {
                setEsslData((prev) => ({ ...prev, [`${machineId}_attendance`]: response.result }));

                dispatch(
                    setSnackBar({
                        open: true,
                        message: `ESSL attendance logs retrieved! Found ${response.result.count} logs`,
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Failed to get ESSL attendance logs",
                    severity: "error",
                }),
            );
        } finally {
            setTestingESSL((prev) => ({ ...prev, [`${machineId}_attendance`]: false }));
        }
    };

    // Test ESSL users
    const handleTestESSLUsers = async (machineId) => {
        setTestingESSL((prev) => ({ ...prev, [`${machineId}_users`]: true }));

        try {
            const response = await axios.get(`${baseUrl}/biometric/machines/${machineId}/essl-users`);
            if (response.success) {
                setEsslData((prev) => ({ ...prev, [`${machineId}_users`]: response.result }));

                dispatch(
                    setSnackBar({
                        open: true,
                        message: `ESSL users retrieved! Found ${response.result.count} users`,
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Failed to get ESSL users",
                    severity: "error",
                }),
            );
        } finally {
            setTestingESSL((prev) => ({ ...prev, [`${machineId}_users`]: false }));
        }
    };

    // Fetch machines data
    const fetchMachines = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/biometric/machines`);
            if (response.success) {
                setMachines(response.result.data);
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Failed to fetch machines",
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
            const response = await axios.get(`${baseUrl}/biometric/machines/stats`);
            if (response.success) {
                setStats(response.result);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    useEffect(() => {
        fetchMachines();
        fetchStats();
        fetchNetworkInfo();
    }, []);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const url = editingMachine
                ? `${baseUrl}/biometric/machines/${editingMachine.machine_id}`
                : `${baseUrl}/biometric/machines`;

            const method = editingMachine ? "put" : "post";

            const response = await axios[method](url, formData);

            if (response.success) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: response.message,
                        severity: "success",
                    }),
                );
                setOpenDialog(false);
                setEditingMachine(null);
                resetForm();
                fetchMachines();
                fetchStats();
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Operation failed",
                    severity: "error",
                }),
            );
        }
    };

    // Handle delete machine
    const handleDelete = async (machineId) => {
        if (window.confirm("Are you sure you want to delete this machine?")) {
            try {
                const response = await axios.delete(`${baseUrl}/biometric/machines/${machineId}`);
                if (response.success) {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: response.message,
                            severity: "success",
                        }),
                    );
                    fetchMachines();
                    fetchStats();
                }
            } catch (error) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Failed to delete machine",
                        severity: "error",
                    }),
                );
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            machine_id: "",
            name: "",
            ip_address: "",
            port: 4370,
            location: "",
            description: "",
        });
    };

    // Handle edit
    const handleEdit = (machine) => {
        setEditingMachine(machine);
        setFormData({
            machine_id: machine.machine_id,
            name: machine.name,
            ip_address: machine.ip_address,
            port: machine.port,
            location: machine.location,
            description: machine.description || "",
        });
        setOpenDialog(true);
    };

    // Handle add new
    const handleAddNew = () => {
        setEditingMachine(null);
        resetForm();
        setOpenDialog(true);
    };

    // Handle connection test
    const handleTestConnection = async (machineId) => {
        setTestingConnection((prev) => ({ ...prev, [machineId]: true }));

        try {
            const response = await axios.get(`${baseUrl}/biometric/machines/${machineId}/test-connection`);

            if (response.success) {
                const result = response.result;
                setConnectionResults((prev) => ({ ...prev, [machineId]: result }));

                dispatch(
                    setSnackBar({
                        open: true,
                        message: `Connection test completed: ${result.status} (${result.response_time})`,
                        severity: result.status === "online" ? "success" : "error",
                    }),
                );

                // Refresh machines to update status
                fetchMachines();
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Connection test failed",
                    severity: "error",
                }),
            );
        } finally {
            setTestingConnection((prev) => ({ ...prev, [machineId]: false }));
        }
    };

    // Handle network test for specific IP
    const handleNetworkTest = async (ipAddress) => {
        try {
            const response = await axios.post(`${baseUrl}/biometric/machines/test-network`, {
                ip_address: ipAddress,
            });

            if (response.success) {
                const result = response.result;
                dispatch(
                    setSnackBar({
                        open: true,
                        message: `Network test completed: ${result.reachable ? "Reachable" : "Not Reachable"}`,
                        severity: result.reachable ? "success" : "error",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error.response?.data?.message || "Network test failed",
                    severity: "error",
                }),
            );
        }
    };

    // Handle test all connections
    const handleTestAllConnections = async () => {
        const offlineMachines = machines.filter(
            (machine) => machine.status === "offline" || machine.status === "unknown",
        );

        if (offlineMachines.length === 0) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "All machines are already online",
                    severity: "info",
                }),
            );
            return;
        }

        dispatch(
            setSnackBar({
                open: true,
                message: `Testing connections for ${offlineMachines.length} machines...`,
                severity: "info",
            }),
        );

        // Test connections for all offline machines
        const testPromises = offlineMachines.map((machine) => handleTestConnection(machine.machine_id));

        try {
            await Promise.all(testPromises);
            dispatch(
                setSnackBar({
                    open: true,
                    message: "All connection tests completed",
                    severity: "success",
                }),
            );
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Some connection tests failed",
                    severity: "warning",
                }),
            );
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "online":
                return "success";
            case "offline":
                return "error";
            default:
                return "default";
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case "online":
                return <WifiIcon />;
            case "offline":
                return <WifiOffIcon />;
            default:
                return <ComputerIcon />;
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
            }}
        >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Biometric Machine Manager
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ConnectIcon />}
                        onClick={handleTestAllConnections}
                        disabled={machines.length === 0}
                    >
                        Test All Connections
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
                        Add Machine
                    </Button>
                </Stack>
            </Stack>

            {/* Network Diagnostics Alert */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Network Troubleshooting:</strong> If devices show as offline, check that your computer is on
                    the same network segment as the biometric device.
                </Typography>
                {networkInfo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Your current network: <strong>{networkInfo.primaryNetwork}</strong>
                        {networkInfo.interfaces.length > 1 && (
                            <span>
                                {" "}
                                (Multiple interfaces detected: {networkInfo.interfaces.map((i) => i.network).join(", ")}
                                )
                            </span>
                        )}
                    </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {/* <Button size="small" variant="outlined" onClick={() => handleNetworkTest("192.168.31.1")}>
                        Test: 192.168.31.1
                    </Button> */}
                    <Button size="small" variant="outlined" onClick={fetchNetworkInfo}>
                        Refresh Network Info
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleScanNetwork}
                        disabled={scanningNetwork}
                    >
                        {scanningNetwork ? "Scanning..." : "Scan Network for Devices"}
                    </Button>
                </Stack>
            </Alert>

            {/* Found Devices Section */}
            {foundDevices.length > 0 && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        🔍 Found {foundDevices.length} Device(s) on Network
                    </Typography>
                    <Grid container spacing={2}>
                        {foundDevices.map((device, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="primary">
                                        Device {index + 1}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>IP:</strong> {device.ip}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Port:</strong> {device.port}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong> {device.status}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                ip_address: device.ip,
                                                port: device.port,
                                            }));
                                            setOpenDialog(true);
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        Add as Machine
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Alert>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Machines
                            </Typography>
                            <Typography variant="h4">{stats.total_machines || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Online Machines
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {stats.online_machines || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Offline Machines
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {stats.offline_machines || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Staff
                            </Typography>
                            <Typography variant="h4">{stats.total_staff || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Machines Grid */}
            <Grid container spacing={3}>
                {machines.map((machine) => (
                    <Grid item xs={12} sm={6} md={4} key={machine.machine_id}>
                        <Card>
                            <CardHeader
                                title={machine.name}
                                subheader={machine.location}
                                action={
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleTestConnection(machine.machine_id)}
                                            disabled={testingConnection[machine.machine_id]}
                                            color={machine.status === "online" ? "success" : "primary"}
                                            title="Test Connection"
                                        >
                                            {testingConnection[machine.machine_id] ? (
                                                <RefreshIcon sx={{ animation: "spin 1s linear infinite" }} />
                                            ) : (
                                                <ConnectIcon />
                                            )}
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleEdit(machine)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(machine.machine_id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                }
                            />
                            <CardContent>
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleTestESSLInfo(machine.machine_id)}
                                        disabled={testingESSL[machine.machine_id]}
                                        startIcon={
                                            testingESSL[machine.machine_id] ? (
                                                <RefreshIcon sx={{ animation: "spin 1s linear infinite" }} />
                                            ) : (
                                                <ComputerIcon />
                                            )
                                        }
                                    >
                                        {testingESSL[machine.machine_id] ? "Testing..." : "ESSL Info"}
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleTestESSLAttendance(machine.machine_id)}
                                        disabled={testingESSL[`${machine.machine_id}_attendance`]}
                                        startIcon={
                                            testingESSL[`${machine.machine_id}_attendance`] ? (
                                                <RefreshIcon sx={{ animation: "spin 1s linear infinite" }} />
                                            ) : (
                                                <AccessTimeIcon />
                                            )
                                        }
                                    >
                                        {testingESSL[`${machine.machine_id}_attendance`] ? "Loading..." : "Attendance"}
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleTestESSLUsers(machine.machine_id)}
                                        disabled={testingESSL[`${machine.machine_id}_users`]}
                                        startIcon={
                                            testingESSL[`${machine.machine_id}_users`] ? (
                                                <RefreshIcon sx={{ animation: "spin 1s linear infinite" }} />
                                            ) : (
                                                <PeopleIcon />
                                            )
                                        }
                                    >
                                        {testingESSL[`${machine.machine_id}_users`] ? "Loading..." : "Users"}
                                    </Button>
                                </Stack>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Machine ID: {machine.machine_id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            IP Address: {machine.ip_address}:{machine.port}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Chip
                                            icon={getStatusIcon(machine.status)}
                                            label={machine.status}
                                            color={getStatusColor(machine.status)}
                                            size="small"
                                        />
                                    </Box>

                                    {/* Connection Test Results */}
                                    {connectionResults[machine.machine_id] && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="textSecondary">
                                                Last Test: {connectionResults[machine.machine_id].response_time}
                                            </Typography>
                                            {connectionResults[machine.machine_id].error && (
                                                <Typography variant="caption" color="error" display="block">
                                                    Error: {connectionResults[machine.machine_id].error}
                                                </Typography>
                                            )}

                                            {/* Network Diagnostics */}
                                            {connectionResults[machine.machine_id].diagnostics && (
                                                <Box sx={{ mt: 1 }}>
                                                    {connectionResults[machine.machine_id].networkIssue && (
                                                        <Alert severity="warning" sx={{ mb: 1, fontSize: "0.75rem" }}>
                                                            <Typography variant="caption">
                                                                Network Issue: Device may be on different network
                                                                segment
                                                            </Typography>
                                                        </Alert>
                                                    )}

                                                    {connectionResults[machine.machine_id].diagnostics.pingTest && (
                                                        <Typography variant="caption" display="block">
                                                            Ping:{" "}
                                                            {connectionResults[machine.machine_id].diagnostics.pingTest
                                                                .reachable
                                                                ? "✅"
                                                                : "❌"}
                                                        </Typography>
                                                    )}

                                                    {connectionResults[machine.machine_id].diagnostics.portTest && (
                                                        <Typography variant="caption" display="block">
                                                            Port {machine.port}:{" "}
                                                            {connectionResults[machine.machine_id].diagnostics.portTest
                                                                .open
                                                                ? "✅"
                                                                : "❌"}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2">Users: {machine.total_users}</Typography>
                                        <Typography variant="body2">Logs: {machine.total_logs}</Typography>
                                    </Box>

                                    {machine.description && (
                                        <Typography variant="body2" color="textSecondary">
                                            {machine.description}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingMachine ? "Edit Machine" : "Add New Machine"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Machine ID"
                                value={formData.machine_id}
                                onChange={(e) => setFormData({ ...formData, machine_id: e.target.value })}
                                disabled={!!editingMachine}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Machine Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="IP Address"
                                value={formData.ip_address}
                                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Port"
                                type="number"
                                value={formData.port}
                                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingMachine ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BiometricMachineManagerContainer;
