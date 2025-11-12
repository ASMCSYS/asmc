import React, { Fragment } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Switch, TableCell, TableRow, Typography, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useDeleteEventMutation, useUpdateEventMutation } from "../../../store/events/eventsApis";
import { CurrencyRupeeOutlined } from "@mui/icons-material";
import { isAuth } from "../../../helpers/cookies";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const EventsTableComponent = ({ loading, fetching = false, count, data, edit, pagination, handlePagination }) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteEventMutation();
    const [updateEvents] = useUpdateEventMutation();

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Event Id",
            field: "event_id",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Event Name",
            field: "event_name",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Event Start & End Date",
            field: "event_start_date",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Registration Start & End Date",
            field: "registration_start_date",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Status",
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
            handleDelete({ _id });
        }
    };

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                status: value,
                _id: row._id,
                event_name: row.event_name,
                description: row.description,
            };
            await updateEvents(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Event ${value ? "active" : "in-active"} successfully`,
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

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <TableRow
                        key={index}
                        sx={{ "td, th": { borderBottom: 1, borderBottomColor: "divider", padding: "10px" } }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>
                        <TableCell align="center">{row?.event_id}</TableCell>
                        <TableCell align="center">{row?.event_name} </TableCell>
                        <TableCell align="center">
                            {handleDateTimeDefault(row?.event_start_date, "dd/MM/yyyy")} -{" "}
                            {handleDateTimeDefault(row?.event_end_date, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell align="center">
                            {handleDateTimeDefault(row?.registration_start_date, "dd/MM/yyyy")} -{" "}
                            {handleDateTimeDefault(row?.registration_end_date, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.UPDATE} fallback={
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
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.DELETE} fallback={null}>
                                <IconButtonIcons
                                    title="Delete"
                                    IconComponent={DeleteIcon}
                                    color="error"
                                    onClick={() => deleteManage(row._id)}
                                />
                            </HasPermission>
                        </TableCell>
                    </TableRow>
                );
            })
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={7} align="center">
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

export default EventsTableComponent;
