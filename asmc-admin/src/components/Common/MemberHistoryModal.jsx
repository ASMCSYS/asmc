import { CloseOutlined, ViewList } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Grid,
    Paper,
    Chip,
    Stack,
    TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
import { useGetPaymentHistoryListQuery } from "../../store/common/commonApis";
import { capitalizeFirstLetter, handleDateTimeDefault, JsonDecode } from "../../helpers/utils";
import { EnrollActivityAddDrawer } from "../admin/enroll-activity-manager/EnrollActivityAddDrawer";
import { useGetBookingListQuery } from "../../store/booking/bookingApis";
import Button from "./Button";
import { getType } from "@reduxjs/toolkit";
import { getCookie, isAuth } from "../../helpers/cookies";
import { baseUrl } from "../../helpers/constants";
import { format } from "date-fns";
import Input from "./Input";
import { Fragment } from "react";

export const MemberHistoryModal = ({ show, close, getActivityList, getMembersList }) => {
    const [showDrawer, setShowDrawer] = React.useState(false);
    const [bookingInitalValue, setBookingInitalValue] = React.useState(false);
    const [bookingId, setBookingId] = React.useState(null);

    const [editingIndex, setEditingIndex] = React.useState(null);
    const [differenceAmount, setEditDifferenceAmount] = React.useState(0);
    const [yearFilter, setYearFilter] = React.useState(new Date().getFullYear());
    const [filteredData, setFilteredData] = React.useState([]);
    const [editedRemark, setEditedRemark] = React.useState("");

    const { data: bookings, isLoading: bookingsLoading } = useGetBookingListQuery(
        { pageNo: 0, limit: 1, sortBy: -1, booking_id: bookingId, type: "enrollment" },
        {
            skip: !bookingId,
        },
    );

    useEffect(() => {
        if (bookings && bookings?.result && bookings?.result.length > 0) {
            setBookingInitalValue(bookings?.result[0]);
            setShowDrawer(true);
        }
    }, [bookings]);

    const {
        isLoading,
        data: paymentHistory,
        refetch,
        isFetching,
    } = useGetPaymentHistoryListQuery({
        pageNo: 0,
        limit: 100,
        sortBy: -1,
        sortField: "createdAt",
        keywords: show,
        filter_by: "member_id",
        payment_status: "Success",
    });

    const years = [2024, 2025];

    useEffect(() => {
        if (yearFilter) {
            setFilteredData(filteredData?.filter((item) => item.createdAt.includes(yearFilter)));
        }
    }, [yearFilter]);

    useEffect(() => {
        if (paymentHistory && paymentHistory?.result && paymentHistory?.result.length > 0) {
            setFilteredData(paymentHistory?.result?.filter((item) => item.createdAt.includes(yearFilter)));
        }
    }, [paymentHistory, yearFilter]);

    const getTotalAmount = useCallback(
        (type) => {
            let total = 0;
            if (filteredData)
                filteredData.map((obj) => {
                    if (type === "membership") {
                        if (obj?.booking_type === type) {
                            total += obj.amount_paid;
                        } else if (obj?.plans_data.find((p) => p.plan_type === "membership")) {
                            const enrollmentAmount = obj?.bookings_data?.reduce((acc, cur) => {
                                return acc + (cur?.total_amount || 0);
                            }, 0);

                            total += obj.amount_paid - enrollmentAmount;
                        }
                    } else {
                        const enrollmentAmount = obj?.bookings_data?.reduce((acc, cur) => {
                            return acc + (cur?.total_amount || 0);
                        }, 0);

                        total += enrollmentAmount;
                    }
                });

            return total;
        },
        [filteredData],
    );

    const getSingleAmount = (obj, type) => {
        let total = 0;
        if (type === "membership") {
            if (obj?.booking_type === type) {
                total += obj.amount_paid;
            } else if (obj?.plans_data.find((p) => p.plan_type === "membership")) {
                const enrollmentAmount = obj?.bookings_data?.reduce((acc, cur) => {
                    return acc + (cur?.total_amount || 0);
                }, 0);

                total += obj.amount_paid - enrollmentAmount;
            }
        } else if (type === "enrollment") {
            const enrollmentAmount = obj?.bookings_data?.reduce((acc, cur) => {
                return acc + (cur?.total_amount || 0);
            }, 0);

            total += enrollmentAmount;
        }
        return total;
    };

    const getTypeLabel = (item) => {
        const plans = item?.plans_data || [];

        const hasMembership = plans.some((p) => p.plan_type === "membership");
        const hasEnrollment = plans.some((p) => p.plan_type === "enrollment");

        if (hasMembership && hasEnrollment) return "Both";
        if (hasMembership) return "Membership";
        if (hasEnrollment) return "Enrollment";

        return "Unknown"; // fallback if none found
    };

    const updateRemarkAPI = async (id, data) => {
        try {
            const response = await fetch(`${baseUrl}/payment/update-remark`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getCookie("asmc_token")}`,
                },
                body: JSON.stringify({ _id: id, ...data }),
            });
            if (response.ok) {
                await response.json();
                refetch();
                setEditingIndex(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading || isFetching) {
        return (
            <Dialog open={Boolean(show)} onClose={close} maxWidth="md">
                <DialogTitle>Loading...</DialogTitle>
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={Boolean(show)}
            onClose={() => {
                close();
                setFilteredData([]);
            }}
            maxWidth="md"
            fullWidth
            sx={{ zIndex: 1200 }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Payment History</Typography>
                    <Typography variant="subtitle2">
                        Total Membership Amount: Rs. {getTotalAmount("membership") || 0}
                    </Typography>
                    <Typography variant="subtitle2">
                        Total Enrollment Amount: Rs. {getTotalAmount("enrollment") || 0}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Paper sx={{ mb: 2 }}>
                    <Typography variant="h6">Filter by Year</Typography>
                    <Stack direction="row" spacing={1}>
                        {years.map((year, key) => {
                            return (
                                <Chip
                                    key={key}
                                    label={year}
                                    onClick={() => {
                                        setYearFilter(year);
                                    }}
                                    variant={yearFilter === year ? "filled" : "outlined"}
                                    color={"primary"}
                                />
                            );
                        })}
                    </Stack>
                </Paper>
                {!filteredData || filteredData?.length === 0 ? (
                    <Typography>No history available</Typography>
                ) : (
                    filteredData.map((item, index) => {
                        const paymentRes = JsonDecode(item.payment_response);
                        let isSecondary = item.bookings_data?.[0]?.family_member?.[0];

                        if (item?.secondary_member_id) {
                            isSecondary = item?.member_data?.family_details.find(
                                (member) => member._id === item?.secondary_member_id,
                            );
                        }
                        return (
                            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, borderLeft: "5px solid #1976d2" }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="h6">
                                                #{index + 1} —{" "}
                                                <Chip label={getTypeLabel(item)} size="medium" color="primary">
                                                    {getTypeLabel(item)}
                                                </Chip>
                                            </Typography>
                                        </Stack>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    {/* Member Info */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">
                                            <span
                                                style={{
                                                    color: isSecondary ? "#9c27b0" : "#1976d2",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {isSecondary ? " Secondary Member" : " Primary Member"}
                                            </span>
                                        </Typography>
                                        <Typography>
                                            <strong>ID:</strong> {item.member_data?.member_id}
                                        </Typography>
                                        <Typography>
                                            <strong>Name:</strong>{" "}
                                            {isSecondary ? isSecondary.name : item.member_data?.name}
                                        </Typography>
                                        <Typography>
                                            <strong>Phone:</strong> {item.member_data?.phone}
                                        </Typography>
                                    </Grid>

                                    {/* Booking Details */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Booking & Activity</Typography>
                                        {item.bookings_data?.map((booking, i) => {
                                            const planData = item.plans_data.find(
                                                (p) => p._id === booking.fees_breakup.plan_id,
                                            );
                                            return (
                                                <Box
                                                    key={i}
                                                    mb={2}
                                                    p={1}
                                                    border={1}
                                                    borderColor="grey.300"
                                                    borderRadius={2}
                                                    bgcolor={booking.status ? "#e8f5e9" : "#ff756b"}
                                                >
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Enrollment {i + 1} - {booking.status ? "Active" : "Inactive"}
                                                    </Typography>

                                                    <Typography>
                                                        <strong>Enroll ID:</strong> {booking.booking_id}{" "}
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => setBookingId(booking.booking_id)}
                                                            loading={bookingsLoading}
                                                            fullWidth={false}
                                                        >
                                                            View
                                                        </Button>
                                                    </Typography>

                                                    {item.activity_data?.[i] && (
                                                        <Typography>
                                                            <strong>Activity:</strong> {item.activity_data[i].name} (
                                                            {item.activity_data[i].activity_id})
                                                        </Typography>
                                                    )}

                                                    {planData && (
                                                        <Typography>
                                                            <strong>Plan Name:</strong> {planData.plan_name}
                                                        </Typography>
                                                    )}

                                                    <Typography>
                                                        <strong>Amount:</strong> {booking?.total_amount}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Grid>

                                    {/* Payment Info */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Payment Info</Typography>
                                        <Typography>
                                            <strong>Membership Amount:</strong> Rs. {getSingleAmount(item, "membership")}
                                        </Typography>
                                        <Typography>
                                            <strong>Enrollment Amount:</strong> Rs. {getSingleAmount(item, "enrollment")}
                                        </Typography>
                                        {item?.difference_amount_paid ? (
                                            <Fragment>
                                                <Typography color={"error"}>
                                                    <strong>
                                                        Difference Amount Paid: Rs. {item?.difference_amount_paid || "-"}
                                                    </strong>
                                                </Typography>
                                                <Typography color={"error"}>
                                                    <strong>
                                                        Total Amount Paid: Rs. 
                                                        {parseInt(item?.amount_paid) +
                                                            parseInt(item?.difference_amount_paid) || "-"}
                                                    </strong>
                                                </Typography>
                                            </Fragment>
                                        ) : (
                                            <Typography color={"error"}>
                                                <strong>Total Amount Paid: Rs. {item?.amount_paid || "-"}</strong>
                                            </Typography>
                                        )}

                                        <Typography>
                                            <strong>Mode:</strong> {item.payment_mode}
                                        </Typography>
                                        <Typography>
                                            <strong>Order ID:</strong> {item?.order_id || "-"}
                                        </Typography>
                                        <Typography>
                                            <strong>Tracking ID:</strong> {paymentRes?.tracking_id || "-"}
                                        </Typography>
                                        <Typography>
                                            <strong>Date:</strong> {handleDateTimeDefault(item.createdAt)}
                                        </Typography>
                                        <Typography>
                                            <strong>Remarks:</strong>{" "}
                                            {/* {editingIndex === index ? (
                                                <Box>
                                                    <textarea
                                                        value={editedRemark}
                                                        onChange={(e) => setEditedRemark(e.target.value)}
                                                        rows={4}
                                                        style={{
                                                            width: "100%",
                                                            marginRight: "8px",
                                                            marginBottom: "8px",
                                                            padding: "8px",
                                                            borderRadius: "4px",
                                                            border: "1px solid #ccc",
                                                            fontFamily: "inherit",
                                                            fontSize: "14px",
                                                            resize: "vertical",
                                                        }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        fullWidth={false}
                                                        onClick={async () => {
                                                            try {
                                                                await updateRemarkAPI(item._id, editedRemark); // replace with your actual API call
                                                                item.remarks = editedRemark; // optimistically update UI
                                                                setEditingIndex(null);
                                                            } catch (err) {
                                                                console.error("Failed to update remarks", err);
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        color="error"
                                                        fullWidth={false}
                                                        onClick={() => setEditingIndex(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            ) : ( */}
                                            {/* <Button
                                                        size="small"
                                                        fullWidth={false}
                                                        variant="contained"
                                                        onClick={() => {
                                                            setEditingIndex(index);
                                                            setEditedRemark(item?.remarks || "");
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>{" "} */}
                                            {item?.remarks || "-"}
                                        </Typography>

                                        {editingIndex === index && (
                                            <Grid container spacing={2} sx={{ mt: 2, mb: 2 }} alignItems="center">
                                                <Grid item xs={12} sm={12}>
                                                    <textarea
                                                        value={editedRemark || item?.remarks || ""}
                                                        onChange={(e) => setEditedRemark(e.target.value)}
                                                        rows={4}
                                                        style={{
                                                            width: "100%",
                                                            padding: "8px",
                                                            borderRadius: "4px",
                                                            border: "1px solid #ccc",
                                                            fontFamily: "inherit",
                                                            fontSize: "14px",
                                                            resize: "vertical",
                                                        }}
                                                        placeholder="Enter remarks"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <Input
                                                        id="difference_amount_paid"
                                                        name="difference_amount_paid"
                                                        label="Difference Amount Paid"
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value, 10);
                                                            setEditDifferenceAmount(
                                                                isNaN(value) || value < 0 ? null : value,
                                                            );
                                                        }}
                                                        value={differenceAmount || ""}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        fullWidth
                                                        onClick={async () => {
                                                            try {
                                                                await updateRemarkAPI(item._id, {
                                                                    remarks: editedRemark,
                                                                    difference_amount_paid: differenceAmount,
                                                                }); // replace with your actual API call
                                                                item.remarks = editedRemark;
                                                                item.difference_amount_paid = differenceAmount;
                                                                setEditingIndex(null);
                                                            } catch (err) {
                                                                console.error(
                                                                    "Failed to update difference amount",
                                                                    err,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        color="error"
                                                        fullWidth
                                                        onClick={() => {
                                                            setEditingIndex(null);
                                                            setEditedRemark("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}

                                        <Button
                                            size="small"
                                            fullWidth={false}
                                            variant="contained"
                                            onClick={() => {
                                                setEditingIndex(index);
                                            }}
                                        >
                                            Add Difference Amount
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        );
                    })
                )}
            </DialogContent>

            <EnrollActivityAddDrawer
                type="enrollment"
                show={showDrawer}
                close={() => [setShowDrawer(false), setBookingId(null), setBookingInitalValue(null), refetch()]}
                formType={isAuth().roles === "super" ? "Edit" : "View"}
                initialValues={bookingInitalValue}
                getActivityList={getActivityList}
                getMembersList={getMembersList}
            />
        </Dialog>
    );
};
