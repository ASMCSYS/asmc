import React, { Fragment, useState } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Switch, TableCell, TableRow, Typography, MenuItem, Select, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { CurrencyRupee } from "@mui/icons-material";
import { ArrowDropDown } from "@mui/icons-material";
import { OfflinePaymentModal } from "../../Common/OfflinePaymentModal";
import { isAuth } from "../../../helpers/cookies";
import { useDeleteEventBookingMutation, useUpdateEventBookingStatusMutation } from "../../../store/events/eventsApis";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const getPaymentStatusColor = (status) => {
    switch (status) {
        case "Success":
            return { background: "#e8f5e9", text: "#2e7d32" };
        case "Pending":
            return { background: "#fff3e0", text: "#ef6c00" };
        case "Failed":
            return { background: "#ffebee", text: "#d32f2f" };
            default:
        return { background: "#f5f5f5", text: "#616161" };
}
};

const EventBookingTableComponent = ({
    loading,
    fetching = false,
    count,
    data,
    edit,
    pagination,
    handlePagination,
    refetch,
}) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteEventBookingMutation();
    const [updateBooking] = useUpdateEventBookingStatusMutation();
    const [showPayment, setShowPayment] = useState(false);
    const [paymentInitialValue, setPaymentInitialValue] = useState({});

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Booking Id",
            field: "booking_id",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Event Data",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Category Data",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Payment Status",
            field: "payment_status",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Booking Created At",
            field: "createdAt",
            sort: true,
            minWidth: 90,
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
                status: value,
            };
            await updateBooking(payload).unwrap();
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

    const handlePaymentModal = (row) => {
        setShowPayment(true);

        setPaymentInitialValue({
            event_booking_id: row?._id,
            payment_file: "",
            amount_paid: row?.amount_paid,
            payment_status: "Success",
            payment_verified: true,
            remarks: "",
            payment_mode: "Cheque",
            createdAt: new Date(),
        });
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
                        <TableCell align="center">{row?.booking_id}</TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">ID: {row?.events_data?.event_id}</Typography>
                            <Typography variant="subtitle2">Name: {row?.events_data?.event_name}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.category_data?.category_name}</Typography>
                            <Typography variant="subtitle2">Total Amount: {row?.amount_paid}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Chip
                                size="small"
                                sx={{
                                    fontSize: "0.75rem",
                                    ".MuiSelect-select": { py: 0.5 },
                                    backgroundColor: getPaymentStatusColor(row?.payment_status).background,
                                    color: getPaymentStatusColor(row?.payment_status).text,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                }}
                                label={row?.payment_status}
                            />
                        </TableCell>
                        <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ORDERS.EVENT_BOOKING.UPDATE} fallback={
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
                            <HasPermission permission={PERMISSIONS.ORDERS.EVENT_BOOKING.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ORDERS.EVENT_BOOKING.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
                                />
                            </HasPermission>
                            {/* {isAuth().roles === "super" ? (
                                <IconButtonIcons
                                    title="Delete"
                                    IconComponent={DeleteIcon}
                                    color="error"
                                    onClick={() => deleteManage(row._id, row.converted)}
                                />
                            ) : null} */}
                            <HasPermission permission={PERMISSIONS.ORDERS.EVENT_BOOKING.UPDATE} fallback={null}>
                                {row?.payment_status === "Pending" && (
                                    <IconButtonIcons
                                        title="Pay Fees"
                                        IconComponent={CurrencyRupee}
                                        color="success"
                                        onClick={() => handlePaymentModal(row)}
                                    />
                                )}
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
        <Fragment>
            <TableCommon
                columns={columns}
                tableData={renderTableData}
                count={count}
                loading={loading || fetching}
                pagination={pagination}
                handlePagination={handlePagination}
            />
            <OfflinePaymentModal
                show={showPayment}
                close={() => setShowPayment(false)}
                data={paymentInitialValue}
                refetch={refetch}
            />
        </Fragment>
    );
};

export default EventBookingTableComponent;
