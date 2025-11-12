import React, { Fragment } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Switch, TableCell, TableRow, Typography, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDeleteBookingMutation, useUpdateStatusMutation } from "../../../store/booking/bookingApis";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useUpdateHallMutation } from "../../../store/halls/hallsApis";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const HallsTableComponent = ({ loading, fetching = false, count, data, edit, pagination, handlePagination }) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteBookingMutation();
    const [updateHalls] = useUpdateHallMutation();

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Hall Id",
            field: "hall_id",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Hall Name",
            field: "hall_name",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Location",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Amounts",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Charges",
            sort: false,
            minWidth: 50,
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
                ...row,
                status: value,
                _id: row._id,
            };
            delete payload.createdAt;
            delete payload.updatedAt;
            delete payload.sublocation_data;
            delete payload.location_data;
            await updateHalls(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Hall ${value ? "active" : "in-active"} successfully`,
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
                        <TableCell align="center">{row?.hall_id}</TableCell>
                        <TableCell align="center">{row?.name} </TableCell>
                        <TableCell align="center">{row?.location_data?.title} </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">Booking Amount: {row?.booking_amount} Rs.</Typography>
                            <Typography variant="subtitle2">
                                Advance Amount: {row?.advance_payment_amount} Rs.
                            </Typography>
                            <Typography variant="subtitle2">Deposit Amount: {row?.refundable_deposit} Rs.</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">Cleaning Charges: {row?.cleaning_charges} Rs.</Typography>
                            <Typography variant="subtitle2">
                                Additional Charges: {row?.additional_charges} Rs.
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.HALL.UPDATE} fallback={
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
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.HALL.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.HALL.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
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

export default HallsTableComponent;
