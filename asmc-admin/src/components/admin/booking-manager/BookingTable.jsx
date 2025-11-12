import React, { Fragment, useState } from "react";
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
import { CurrencyRupee } from "@mui/icons-material";
import { OfflinePaymentModal } from "../../Common/OfflinePaymentModal";
import { isAuth } from "../../../helpers/cookies";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const BookingTableComponent = ({
    loading,
    fetching = false,
    count,
    data,
    edit,
    pagination,
    handlePagination,
    type = "booking",
    refetch,
}) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteBookingMutation();
    const [updateBooking] = useUpdateStatusMutation();
    const [showPayment, setShowPayment] = useState(false);
    const [paymentInitialValue, setPaymentInitialValue] = useState({});

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: type === "booking" ? "Booking Id" : "Enrolled Id",
            field: "booking_id",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Member Data",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Activity Data",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Plan Data",
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

    const getBookingUserDetails = (row) => {
        console.log(row, "row");

        let data = {
            id: "P-" + row?.member_id?.member_id,
            name: row?.member_id?.name,
            mobile: row?.member_id?.mobile,
        };
        if (row?.family_member.length > 0 && row?.family_member[0]?.name) {
            data = {
                ...data,
                id: row?.family_member[0]?.id,
                name: row?.family_member[0]?.name,
            };
        }
        return (
            <Fragment>
                <Typography variant="subtitle2">ID: {data?.id}</Typography>
                <Typography variant="subtitle2">Name: {data?.name}</Typography>
                <Typography variant="subtitle2">Mobile: {data?.mobile}</Typography>
            </Fragment>
        );
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

    const handlePaymentModal = (row) => {
        setShowPayment(true);

        setPaymentInitialValue({
            member_id: row?.member_id?._id,
            booking_id: row?._id,
            payment_file: "",
            amount_paid: row?.total_amount,
            plan_id: row.fees_breakup?.plan_id,
            payment_status: "Success",
            payment_verified: true,
            remarks: "",
            payment_mode: "Cheque",
            createdAt: "",
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
                        <TableCell align="center">{getBookingUserDetails(row)}</TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">ID: {row?.activity_id?.activity_id}</Typography>
                            <Typography variant="subtitle2">Name: {row?.activity_id?.name}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.fees_breakup?.plan_name}</Typography>
                            <Typography variant="subtitle2">Total Amount: {row?.total_amount}</Typography>
                        </TableCell>
                        <TableCell align="center">{row?.payment_status}</TableCell>
                        <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ORDERS.BOOKING.UPDATE} fallback={
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
                            <HasPermission permission={PERMISSIONS.ORDERS.BOOKING.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ORDERS.BOOKING.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ORDERS.BOOKING.DELETE} fallback={null}>
                                <IconButtonIcons
                                    title="Delete"
                                    IconComponent={DeleteIcon}
                                    color="error"
                                    onClick={() => deleteManage(row._id, row.converted)}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ORDERS.BOOKING.UPDATE} fallback={null}>
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

export default BookingTableComponent;
