import React from "react";
import { TableRow, TableCell, Chip, Stack, Button } from "@mui/material";
import { Edit as EditIcon, History as HistoryIcon } from "@mui/icons-material";
import TableCommon from "../../Common/Table";
import { format } from "date-fns";

const AttendanceLogsTable = ({
    data,
    loading,
    pagination,
    handlePagination,
    count,
    onRegularizationRequest,
    onViewHistory,
}) => {
    const columns = [
        {
            title: "Staff ID",
            field: "staff_id",
            align: "left",
            sort: true,
        },
        {
            title: "Staff Name",
            field: "staff_name",
            align: "left",
            sort: true,
        },
        {
            title: "Machine",
            field: "machine_id",
            align: "left",
            sort: false,
        },
        {
            title: "Type",
            field: "type",
            align: "center",
            sort: true,
        },
        {
            title: "Timestamp",
            field: "timestamp",
            align: "center",
            sort: true,
        },
        {
            title: "Location",
            field: "location",
            align: "left",
            sort: true,
        },
        {
            title: "Status",
            field: "status",
            align: "center",
            sort: true,
        },
        {
            title: "Actions",
            field: "actions",
            align: "center",
            sort: false,
        },
    ];

    // Get type color
    const getTypeColor = (type) => {
        switch (type) {
            case "check-in":
                return "success";
            case "check-out":
                return "error";
            case "break-start":
                return "warning";
            case "break-end":
                return "info";
            default:
                return "default";
        }
    };

    // Get method color
    const getMethodColor = (method) => {
        switch (method) {
            case "fingerprint":
                return "primary";
            case "card":
                return "secondary";
            case "password":
                return "warning";
            case "face":
                return "info";
            default:
                return "default";
        }
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map((log) => (
                <TableRow key={log.log_id} sx={{ "td, th": { border: 0, padding: "10px" } }}>
                    <TableCell align="left">{log.staff_id?.name || log.staff_name || "N/A"}</TableCell>
                    <TableCell align="left">{log.staff_name}</TableCell>
                    <TableCell align="left">
                        {log.machine_id?.name || "N/A"}
                        <br />
                        <span style={{ fontSize: "0.75rem", color: "#666" }}>{log.machine_id?.location || "N/A"}</span>
                    </TableCell>
                    <TableCell align="center">
                        <Chip label={log.type} color={getTypeColor(log.type)} size="small" />
                    </TableCell>
                    <TableCell align="center">{format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss")}</TableCell>
                    <TableCell align="left">{log.location}</TableCell>
                    <TableCell align="center">
                        <Chip label={log.status} color={log.status === "success" ? "success" : "error"} size="small" />
                    </TableCell>
                    <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => onRegularizationRequest(log)}
                                variant="outlined"
                            >
                                Regularize
                            </Button>
                            <Button
                                size="small"
                                startIcon={<HistoryIcon />}
                                onClick={() => onViewHistory(log)}
                                variant="outlined"
                            >
                                History
                            </Button>
                        </Stack>
                    </TableCell>
                </TableRow>
            ))
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={8} align="center">
                    {loading ? "Loading..." : "No data found"}
                </TableCell>
            </TableRow>
        );

    return (
        <TableCommon
            columns={columns}
            tableData={renderTableData}
            count={count}
            loading={loading}
            pagination={pagination}
            handlePagination={handlePagination}
            maxHeight="70vh"
        />
    );
};

export default AttendanceLogsTable;
