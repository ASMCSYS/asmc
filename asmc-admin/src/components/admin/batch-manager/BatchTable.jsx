import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Box, FormControlLabel, Switch, TableCell, TableRow, Typography, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { baseUrl, PERMISSIONS } from "../../../helpers/constants";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDeleteBatchMutation, useUpdateBatchMutation } from "../../../store/masters/mastersApis";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { isAuth } from "../../../helpers/cookies";
import { format, parse, parseISO } from "date-fns";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const BatchTableComponent = ({ loading, fetching = false, count, data, edit, pagination, handlePagination }) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteBatchMutation();
    const [updateBatch] = useUpdateBatchMutation();
    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Batch Details",
            sort: false,
            minWidth: 90,
        },
        {
            title: "Batch Limit",
            field: "batch_limit",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Sports Activity",
            field: "activity_data.name",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Categories",
            field: "category_data.title",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Locations",
            field: "location_data.title",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Active",
            field: "status",
            sort: true,
            minWidth: 90,
        },
        {
            title: "Action",
            name: "",
            sort: false,
            minWidth: 200,
        },
    ];

    const deleteManage = (_id, converted) => {
        if (window.confirm("Are you sure you want to delete?")) {
            if (converted) {
                alert("This member is converted to user, kindly delete the user first and then member.");
                return false;
            }
            handleDelete({ _id });
        }
    };

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                _id: row?._id,
                batch_code: row?.batch_code,
                batch_name: row?.batch_name,
                batch_type: row?.batch_type,
                batch_limit: row?.batch_limit,
                days: row?.days,
                start_time: row?.start_time,
                end_time: row?.end_time,
                sublocation_id: row?.sublocation_id,
                category_id: row?.category_id,
                location_id: row?.location_id,
                court: row?.court || "",
                activity_id: row?.activity_id,
                type: row?.type,
                status: value,
            };
            await updateBatch(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Batch ${value ? "active" : "in-active"} successfully`,
                    severity: "success",
                }),
            );
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    const formatTime = (isoTime) => {
        try {
            return format(parseISO(isoTime), "hh:mm a");
        } catch {
            return isoTime;
        }
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <TableRow
                        key={index}
                        sx={{ "td, th": { borderBottom: 1, borderBottomColor: "divider", padding: "10px" } }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>

                        <TableCell align="center">
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <strong>Batch Type:</strong> {row?.batch_type || "N/A"}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <strong>Batch Code:</strong> {row?.batch_code || "N/A"}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <strong>Batch Name:</strong> {row?.batch_name || "N/A"}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <strong>Batch Days:</strong>{" "}
                                    {Array.isArray(row?.days)
                                        ? row.days.map((day) => day.label.slice(0, 2)).join(", ")
                                        : "N/A"}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    <strong>Batch Time:</strong> {formatTime(row?.start_time)} -{" "}
                                    {formatTime(row?.end_time)}
                                </Typography>
                            </Box>
                        </TableCell>
                        <TableCell align="center">{row?.batch_limit}</TableCell>
                        <TableCell align="center">{row?.activity_data?.name}</TableCell>
                        <TableCell align="center">{row?.category_data?.title}</TableCell>
                        <TableCell align="center">{row?.location_data?.title}</TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.BATCH.UPDATE} fallback={
                                <Chip
                                    size="small"
                                    sx={{
                                        fontSize: "0.75rem",
                                        backgroundColor: getStatusColor(row?.status || false).background,
                                        color: getStatusColor(row?.status || false).text,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                    }}
                                    label={row?.status ? "Active" : "Inactive"}
                                />
                            }>
                                <FormControlLabel
                                    control={<Switch checked={row?.status || false} />}
                                    label="Active"
                                    onChange={(e) => handleChangeStatus(e.target.checked, row)}
                                />
                            </HasPermission>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.BATCH.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.BATCH.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.BATCH.DELETE} fallback={null}>
                                <IconButtonIcons
                                    title="Delete"
                                    IconComponent={DeleteIcon}
                                    color="error"
                                    onClick={() => deleteManage(row._id, row.converted)}
                                />
                            </HasPermission>
                        </TableCell>
                    </TableRow>
                );
            })
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={8} align="center">
                    Data not found
                </TableCell>
            </TableRow>
        );

    return (
        <TableCommon
            columns={columns}
            tableData={renderTableData}
            count={count}
            loading={loading || fetching}
            pagination={pagination}
            handlePagination={handlePagination}
        />
    );
};

export default BatchTableComponent;
