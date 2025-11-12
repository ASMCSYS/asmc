import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Stack,
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
} from "@mui/material";
import {
    Refresh as RefreshIcon,
    Assignment as AssignmentIcon,
    PersonRemove as PersonRemoveIcon,
    Visibility as ViewIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Fingerprint as FingerprintIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { baseUrl } from "../../../helpers/constants";
import BiometricEnrollmentModal from "../../../components/admin/biometric-staff-manager/BiometricEnrollmentModal";

const BiometricStaffManagerContainer = () => {
    const dispatch = useDispatch();
    const [staff, setStaff] = useState([]);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [filters, setFilters] = useState({
        machine_id: "",
        enrolled_only: false,
    });

    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        staff_id: "",
        machine_id: "",
    });

    // Enrollment modal state
    const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
    const [selectedStaffForEnrollment, setSelectedStaffForEnrollment] = useState(null);

    // Fetch machines for filter dropdown
    const fetchMachines = async () => {
        try {
            const response = await axios.get(`/biometric/machines`);
            if (response.success) {
                setMachines(response.result.data);
            }
        } catch (error) {
            console.error("Failed to fetch machines:", error);
        }
    };

    // Fetch staff with biometric info
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                ...filters,
            };

            const response = await axios.get(`/biometric/staff`, { params });
            if (response.success) {
                setStaff(response.result.data);
                setTotalCount(response.result.count);
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Failed to fetch staff",
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
            const response = await axios.get(`/biometric/staff/stats`);
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
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [page, rowsPerPage, filters]);

    // Handle filter change
    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
        setPage(0); // Reset to first page when filters change
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle assign staff to machine
    const handleAssign = async () => {
        try {
            const response = await axios.post(`/biometric/staff/assign`, formData);

            if (response.success) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: response.message,
                        severity: "success",
                    }),
                );
                setOpenDialog(false);
                resetForm();
                fetchStaff();
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

    // Handle remove staff from machine
    const handleRemove = async (staffId) => {
        if (window.confirm("Are you sure you want to remove this staff from the biometric machine?")) {
            try {
                const response = await axios.delete(`/biometric/staff/${staffId}`);

                if (response.success) {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: response.message,
                            severity: "success",
                        }),
                    );
                    fetchStaff();
                    fetchStats();
                }
            } catch (error) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Failed to remove staff",
                        severity: "error",
                    }),
                );
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            staff_id: "",
            machine_id: "",
        });
    };

    // Handle assign dialog open
    const handleAssignDialog = (staffId) => {
        setFormData({ ...formData, staff_id: staffId });
        setOpenDialog(true);
    };

    // Handle enrollment modal open
    const handleEnrollmentDialog = (staffMember) => {
        setSelectedStaffForEnrollment(staffMember);
        setEnrollmentModalOpen(true);
    };

    // Handle enrollment modal close
    const handleEnrollmentModalClose = () => {
        setEnrollmentModalOpen(false);
        setSelectedStaffForEnrollment(null);
    };

    // Handle enrollment success
    const handleEnrollmentSuccess = () => {
        fetchStaff();
        fetchStats();
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Biometric Staff Manager
                </Typography>
                <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchStaff}>
                    Refresh
                </Button>
            </Stack>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
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
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Enrolled Staff
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {stats.enrolled_staff || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Unenrolled Staff
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {stats.unenrolled_staff || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Enrollment %
                            </Typography>
                            <Typography variant="h4" color="primary.main">
                                {stats.enrollment_percentage?.toFixed(1) || 0}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filters
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Machine</InputLabel>
                            <Select
                                value={filters.machine_id}
                                onChange={(e) => handleFilterChange("machine_id", e.target.value)}
                                label="Machine"
                            >
                                <MenuItem value="">All Machines</MenuItem>
                                {machines.map((machine) => (
                                    <MenuItem key={machine.machine_id} value={machine.machine_id}>
                                        {machine.name} ({machine.location})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <ToggleButtonGroup
                            value={filters.enrolled_only}
                            exclusive
                            onChange={(e, value) => handleFilterChange("enrolled_only", value)}
                            aria-label="enrollment filter"
                        >
                            <ToggleButton value={false} aria-label="all staff">
                                All Staff
                            </ToggleButton>
                            <ToggleButton value={true} aria-label="enrolled only">
                                Enrolled Only
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Paper>

            {/* Staff Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Staff ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Biometric Status</TableCell>
                            <TableCell>Machine</TableCell>
                            <TableCell>Attendance Count</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staff.map((member) => (
                            <TableRow key={member.staff_id}>
                                <TableCell>{member.staff_id}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.department}</TableCell>
                                <TableCell>{member.designation}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>
                                    <Chip
                                        icon={member.biometric_enrolled ? <CheckCircleIcon /> : <CancelIcon />}
                                        label={member.biometric_enrolled ? "Enrolled" : "Not Enrolled"}
                                        color={member.biometric_enrolled ? "success" : "error"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {member.machine_info ? (
                                        <Box>
                                            <Typography variant="body2">{member.machine_info.name}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {member.machine_info.location}
                                            </Typography>
                                            <Chip
                                                label={member.machine_info.status}
                                                color={member.machine_info.status === "online" ? "success" : "error"}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            Not assigned
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{member.attendance_count}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {member.biometric_enrolled ? (
                                            <>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEnrollmentDialog(member)}
                                                    title="Start Biometric Enrollment"
                                                >
                                                    <FingerprintIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemove(member.staff_id)}
                                                    title="Remove from machine"
                                                >
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAssignDialog(member.staff_id)}
                                                title="Assign to machine"
                                            >
                                                <AssignmentIcon />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Enrollment by Department */}
            {stats.enrollment_by_department && stats.enrollment_by_department.length > 0 && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Enrollment by Department
                    </Typography>
                    <Grid container spacing={2}>
                        {stats.enrollment_by_department.map((dept) => (
                            <Grid item xs={12} sm={6} md={4} key={dept._id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {dept._id}
                                        </Typography>
                                        <Typography color="textSecondary">Total: {dept.total}</Typography>
                                        <Typography color="textSecondary">Enrolled: {dept.enrolled}</Typography>
                                        <Typography color="textSecondary">
                                            Percentage: {((dept.enrolled / dept.total) * 100).toFixed(1)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {/* Assign Staff Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Staff to Machine</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Staff ID" value={formData.staff_id} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Machine</InputLabel>
                                <Select
                                    value={formData.machine_id}
                                    onChange={(e) => setFormData({ ...formData, machine_id: e.target.value })}
                                    label="Machine"
                                    required
                                >
                                    {machines.map((machine) => (
                                        <MenuItem key={machine.machine_id} value={machine.machine_id}>
                                            {machine.name} ({machine.location})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAssign} variant="contained">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Biometric Enrollment Modal */}
            <BiometricEnrollmentModal
                open={enrollmentModalOpen}
                onClose={handleEnrollmentModalClose}
                staff={selectedStaffForEnrollment}
                onSuccess={handleEnrollmentSuccess}
            />
        </Box>
    );
};

export default BiometricStaffManagerContainer;
