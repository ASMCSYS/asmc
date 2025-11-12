import React from "react";
import { Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button, Stack } from "@mui/material";
import { Refresh as RefreshIcon, Sync as SyncIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SearchRecords } from "../../Common/SearchRecords";

const AttendanceFilters = ({
    filters,
    machines,
    onFilterChange,
    onSyncDevice,
    onRefresh,
    onSearch,
    pagination,
    handlePagination,
    syncing,
    loading,
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Filters & Search
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Machine</InputLabel>
                            <Select
                                value={filters.machine_id}
                                onChange={(e) => onFilterChange("machine_id", e.target.value)}
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

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filters.type}
                                onChange={(e) => onFilterChange("type", e.target.value)}
                                label="Type"
                            >
                                <MenuItem value="">All Types</MenuItem>
                                <MenuItem value="check-in">Check-in</MenuItem>
                                <MenuItem value="check-out">Check-out</MenuItem>
                                <MenuItem value="break-start">Break Start</MenuItem>
                                <MenuItem value="break-end">Break End</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="Start Date"
                            size="small"
                            value={filters.start_date}
                            onChange={(date) => onFilterChange("start_date", date)}
                            slotProps={{
                                textField: { fullWidth: true, size: "small" },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="End Date"
                            size="small"
                            value={filters.end_date}
                            onChange={(date) => onFilterChange("end_date", date)}
                            slotProps={{
                                textField: { fullWidth: true, size: "small" },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <SearchRecords
                            handlePagination={handlePagination}
                            pagination={pagination}
                            type="filter_by_with"
                            filterOptions={[
                                { label: "Any Word", value: "any_word" },
                                { label: "Staff Name", value: "staff_name" },
                                { label: "Staff ID", value: "staff_id" },
                                { label: "Location", value: "location" },
                                { label: "Type", value: "type" },
                            ]}
                            filterLabel="Filter By"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                startIcon={<SyncIcon />}
                                onClick={() => onSyncDevice(filters.machine_id)}
                                disabled={syncing || !filters.machine_id}
                                size="small"
                            >
                                {syncing ? "Syncing..." : "Sync Selected Device"}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={onRefresh}
                                disabled={loading}
                                size="small"
                            >
                                {loading ? "Loading..." : "Refresh Logs"}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </LocalizationProvider>
    );
};

export default AttendanceFilters;
