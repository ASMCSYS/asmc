import React, { Fragment, useState } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import {
    FormControlLabel,
    Switch,
    TableCell,
    TableRow,
    Typography,
    MenuItem,
    Select,
    Chip,
    Stack,
    Grid,
    Box,
    Alert,
} from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { CurrencyRupee } from "@mui/icons-material";
import { ArrowDropDown } from "@mui/icons-material";
import { OfflinePaymentModal } from "../../Common/OfflinePaymentModal";
import { isAuth } from "../../../helpers/cookies";
import {
    useDeleteHallBookingMutation,
    useUpdateHallBookingMutation,
    useUpdateHallBookingStatusMutation,
} from "../../../store/halls/hallsApis";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import Button from "../../Common/Button";
import CommonModal from "../../Common/CommonModal";
import { Formik } from "formik";
import { format, isBefore } from "date-fns";
import * as Yup from "yup";
import Input from "../../Common/Input";
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

const HallBookingTableComponent = ({
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
    const [handleDelete] = useDeleteHallBookingMutation();
    const [updateBookingStatus] = useUpdateHallBookingStatusMutation();
    const [updateBooking] = useUpdateHallBookingMutation();
    const [showPayment, setShowPayment] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [paymentInitialValue, setPaymentInitialValue] = useState({});

    let columns = [
        { title: "Sr. No.", sort: false, minWidth: 50 },
        { title: "Booking ID", field: "booking_id", sort: true, minWidth: 70 },
        { title: "Hall Name", sort: false, minWidth: 150 },
        { title: "Member Details", sort: false, minWidth: 200 },
        { title: "Slot", sort: false, minWidth: 170 },
        { title: "Payment Status", field: "payment_status", sort: true, minWidth: 130 },
        { title: "Created At", field: "createdAt", sort: true, minWidth: 130 },
        { title: "Booking Status", field: "booking_status", sort: false, minWidth: 130 },
        { title: "Status", field: "status", sort: true, minWidth: 90 },
        { title: "Action", name: "", sort: false, minWidth: 200 },
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
            await updateBookingStatus(payload).unwrap();
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

    const RefundDepositComponent = ({ data, updateBooking, closeModal }) => {
        const {
            refundable_deposit,
            amount_paid,
            slot_to,
            payment_status,
            member_id_data,
            halls_data,
            is_refunded,
            refund_amount,
            refund_remarks,
            refunded_at,
        } = data || {};

        const now = new Date();
        const slotToDate = slot_to ? new Date(slot_to) : null;
        const bookingEnded = true; // In real use: isBefore(slotToDate, now)

        const handleRefund = (values) => {
            updateBooking({
                ...values,
                _id: data._id,
                hall_id: data.hall_id,
                refunded_at: new Date().toISOString(),
                is_refunded: true,
            });
            closeModal();
        };

        return (
            <Grid container direction="column" spacing={2} p={2}>
                {/* Booking Summary */}
                <Grid item>
                    <Typography variant="h6">Booking & Refund Details</Typography>
                    <Box mt={1} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                        <ul style={{ padding: 0, listStyle: "none" }}>
                            <li>
                                <strong>Member:</strong> {member_id_data?.name} ({member_id_data?.member_id})
                            </li>
                            <li>
                                <strong>Hall:</strong> {halls_data?.name}
                            </li>
                            <li>
                                <strong>Paid:</strong> Rs. {amount_paid}
                            </li>
                            <li>
                                <strong>Refundable Deposit:</strong> Rs. {refundable_deposit}
                            </li>
                            <li>
                                <strong>Booking End Date:</strong>{" "}
                                {slotToDate ? format(slotToDate, "dd MMM yyyy hh:mm a") : "-"}
                            </li>
                            <li>
                                <strong>Payment Status:</strong> {payment_status}
                            </li>
                            {is_refunded && (
                                <>
                                    <li>
                                        <strong>Refunded Amount:</strong> Rs. {refund_amount}
                                    </li>
                                    <li>
                                        <strong>Refunded At:</strong>{" "}
                                        {format(new Date(refunded_at), "dd MMM yyyy hh:mm a")}
                                    </li>
                                    <li>
                                        <strong>Remarks:</strong> {refund_remarks || "—"}
                                    </li>
                                </>
                            )}
                        </ul>
                    </Box>
                </Grid>

                {/* Refund UI or Confirmation */}
                {bookingEnded ? (
                    is_refunded ? (
                        <Grid item>
                            <Alert severity="success">
                                Refund already processed for Rs. {refund_amount} on{" "}
                                {format(new Date(refunded_at), "dd MMM yyyy hh:mm a")}.
                            </Alert>
                        </Grid>
                    ) : (
                        <Formik
                            initialValues={{
                                refund_amount: refundable_deposit || 0,
                                refund_remarks: "",
                            }}
                            validationSchema={Yup.object({
                                refund_remarks: Yup.string().max(500, "Too long").optional(),
                            })}
                            onSubmit={handleRefund}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid container direction="column" spacing={2} p={2}>
                                        <Grid item>
                                            <Input
                                                label="Refund Amount"
                                                name="refund_amount"
                                                value={values.refund_amount}
                                                fullWidth
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Input
                                                label="Remarks (optional)"
                                                name="refund_remarks"
                                                value={values.refund_remarks}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                error={touched.refund_remarks && Boolean(errors.refund_remarks)}
                                                helperText={touched.refund_remarks && errors.refund_remarks}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Stack direction="row" spacing={2}>
                                                <Button type="submit" variant="contained" color="success">
                                                    Mark Refund as Done
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    )
                ) : (
                    <Grid item>
                        <Alert severity="info">
                            Booking is still active. Refund can only be marked after the booking end date.
                        </Alert>
                    </Grid>
                )}
            </Grid>
        );
    };

    const CancelBookingComponent = ({ data, updateBooking, closeModal }) => {
        const {
            amount_paid,
            refundable_deposit,
            slot_to,
            payment_status,
            member_id_data,
            halls_data,
            is_cancelled,
            cancellation_charges,
            cancellation_reason,
            cancellation_date,
        } = data || {};

        const now = new Date();
        const slotToDate = slot_to ? new Date(slot_to) : null;

        const handleCancel = (values) => {
            updateBooking({
                ...values,
                _id: data._id,
                hall_id: data.hall_id,
                cancellation_date: new Date().toISOString(),
                is_cancelled: true,
            });
            closeModal();
        };

        return (
            <Grid container direction="column" spacing={2} p={2}>
                {/* Booking Summary */}
                <Grid item>
                    <Typography variant="h6">Booking & Cancellation Details</Typography>
                    <Box mt={1} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                        <ul style={{ padding: 0, listStyle: "none" }}>
                            <li>
                                <strong>Member:</strong> {member_id_data?.name} ({member_id_data?.member_id})
                            </li>
                            <li>
                                <strong>Hall:</strong> {halls_data?.name}
                            </li>
                            <li>
                                <strong>Paid:</strong> Rs. {amount_paid}
                            </li>
                            <li>
                                <strong>Refundable Deposit:</strong> Rs. {refundable_deposit}
                            </li>
                            <li>
                                <strong>Booking End Date:</strong>{" "}
                                {slotToDate ? format(slotToDate, "dd MMM yyyy hh:mm a") : "-"}
                            </li>
                            <li>
                                <strong>Payment Status:</strong> {payment_status}
                            </li>
                            {is_cancelled && (
                                <>
                                    <li>
                                        <strong>Cancelled At:</strong>{" "}
                                        {format(new Date(cancellation_date), "dd MMM yyyy hh:mm a")}
                                    </li>
                                    <li>
                                        <strong>Cancellation Charges:</strong> Rs. {cancellation_charges}
                                    </li>
                                    <li>
                                        <strong>Remarks:</strong> {cancellation_reason || "—"}
                                    </li>
                                </>
                            )}
                        </ul>
                    </Box>
                </Grid>

                {/* Cancellation UI */}
                {is_cancelled ? (
                    <Grid item>
                        <Alert severity="warning">
                            This booking was already cancelled on{" "}
                            {format(new Date(cancellation_date), "dd MMM yyyy hh:mm a")}.
                        </Alert>
                    </Grid>
                ) : (
                    <Formik
                        initialValues={{
                            cancellation_charges: 0,
                            cancellation_reason: "",
                        }}
                        validationSchema={Yup.object({
                            cancellation_charges: Yup.number()
                                .min(0, "Cannot be negative")
                                .max(amount_paid, `Cannot exceed paid amount Rs. ${amount_paid}`)
                                .required("Required"),
                            cancellation_reason: Yup.string().max(500, "Too long").required("Required"),
                        })}
                        onSubmit={handleCancel}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container direction="column" spacing={2} p={2}>
                                    <Grid item>
                                        <Input
                                            label="Cancellation Charges"
                                            name="cancellation_charges"
                                            type="number"
                                            value={values.cancellation_charges}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={touched.cancellation_charges && Boolean(errors.cancellation_charges)}
                                            helperText={touched.cancellation_charges && errors.cancellation_charges}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            label="Remarks (required)"
                                            name="cancellation_reason"
                                            value={values.cancellation_reason}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            error={touched.cancellation_reason && Boolean(errors.cancellation_reason)}
                                            helperText={touched.cancellation_reason && errors.cancellation_reason}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Stack direction="row" spacing={2}>
                                            <Button type="submit" variant="contained" color="error" fullWidth={false}>
                                                Confirm Cancel
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                )}
            </Grid>
        );
    };

    const getBookingStatus = (row) => {
        const now = new Date();
        const bookingEnd = new Date(row?.slot_to);
        const isFullyPaid = row?.total_amount - row?.amount_paid === 0;
        const isBookingOver = bookingEnd < now;

        if (row?.is_cancelled) return "Cancelled";
        if (isBookingOver) return "Booking Completed";
        if (isFullyPaid) return "Booking Confirmed";
        return "Partial Payment";
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                const showRefundButton = row?.total_amount - row?.amount_paid === 0;
                let showCancelButton = !row?.is_cancelled;

                // check weather the booking date is over today or not if yes then admin can cancel the booking
                const isBookingDateOver = new Date(row?.booking_date) < new Date();
                if (isBookingDateOver) {
                    showCancelButton = true;
                }

                const isCancelled = row?.is_cancelled;
                const isFullyPaid = row?.total_amount - row?.amount_paid === 0;
                const isBookingOver = new Date(row?.slot_to) < new Date();
                const isCompleted = isBookingOver && !isCancelled;
                const canEdit = !isCancelled && !isCompleted;
                const canCancel = !isCancelled;
                const canRefund = isFullyPaid && !isCancelled;
                const canPayFees = row?.payment_status === "Pending" && !isCancelled;

                return (
                    <TableRow
                        key={index}
                        sx={{
                            "td, th": { border: 0, padding: "10px" },
                            backgroundColor: row?.is_cancelled ? "#ffe5e5" : "inherit",
                        }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>
                        <TableCell align="center">{row?.booking_id}</TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.halls_data?.name || "—"}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.member_id_data?.name}</Typography>
                            <Typography variant="body2">{row?.member_id_data?.email}</Typography>
                            <Typography variant="body2">{row?.member_id_data?.mobile}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="body2">{handleDateTimeDefault(row?.slot_from)} to</Typography>
                            <Typography variant="body2">{handleDateTimeDefault(row?.slot_to)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Chip
                                size="small"
                                sx={{
                                    fontSize: "0.75rem",
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
                            <Chip
                                label={getBookingStatus(row)}
                                color={
                                    row?.is_cancelled
                                        ? "error"
                                        : getBookingStatus(row) === "Booking Completed"
                                        ? "success"
                                        : getBookingStatus(row) === "Booking Confirmed"
                                        ? "primary"
                                        : "warning"
                                }
                                size="small"
                            />
                        </TableCell>
                        <TableCell align="center">
                            <HasPermission
                                permission={PERMISSIONS.ORDERS.HALL_BOOKING.UPDATE}
                                fallback={
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
                                }
                            >
                                <FormControlLabel
                                    control={<Switch checked={row?.status || false} />}
                                    label="Active"
                                    onChange={(e) => handleChangeStatus(e.target.checked, row)}
                                />
                            </HasPermission>
                        </TableCell>
                        <TableCell align="center">
                            <Stack direction="column" spacing={1} alignItems="center">
                                <Stack direction="row">
                                    <HasPermission permission={PERMISSIONS.ORDERS.HALL_BOOKING.UPDATE} fallback={null}>
                                        {canEdit && (
                                            <IconButtonIcons
                                                title="Edit"
                                                IconComponent={EditIcon}
                                                color="warning"
                                                onClick={() => edit(row, "Edit")}
                                            />
                                        )}
                                    </HasPermission>
                                    <HasPermission permission={PERMISSIONS.ORDERS.HALL_BOOKING.READ} fallback={null}>
                                        <IconButtonIcons
                                            title="View"
                                            IconComponent={EyeIcon}
                                            color="info"
                                            onClick={() => edit(row, "View")}
                                        />
                                    </HasPermission>
                                    <HasPermission permission={PERMISSIONS.ORDERS.HALL_BOOKING.UPDATE} fallback={null}>
                                        {canPayFees && (
                                            <IconButtonIcons
                                                title="Pay Fees"
                                                IconComponent={CurrencyRupee}
                                                color="success"
                                                onClick={() => handlePaymentModal(row)}
                                            />
                                        )}
                                    </HasPermission>
                                </Stack>

                                <HasPermission permission={PERMISSIONS.ORDERS.HALL_BOOKING.UPDATE} fallback={null}>
                                    {canRefund && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={() => setShowRefundModal(row)}
                                        >
                                            Refund Deposit
                                        </Button>
                                    )}
                                </HasPermission>

                                <HasPermission permission={PERMISSIONS.ORDERS.HALL_BOOKING.UPDATE} fallback={null}>
                                    {canCancel && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => setShowCancelModal(row)}
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                </HasPermission>
                            </Stack>
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
            <CommonModal
                show={showRefundModal}
                close={() => setShowRefundModal(false)}
                title="Refund Deposit"
                child_component={
                    <RefundDepositComponent
                        closeModal={setShowRefundModal}
                        data={showRefundModal}
                        updateBooking={updateBooking}
                    />
                }
            />
            <CommonModal
                show={showCancelModal}
                close={() => setShowCancelModal(false)}
                title="Refund Deposit"
                child_component={
                    <CancelBookingComponent
                        closeModal={setShowCancelModal}
                        data={showCancelModal}
                        updateBooking={updateBooking}
                    />
                }
            />
        </Fragment>
    );
};

export default HallBookingTableComponent;
