import React, { Fragment, useEffect } from "react";
import { Box, Chip, Stack, TableCell, TableRow, Typography } from "@mui/material";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault, JsonDecode } from "../../../helpers/utils";
import Button from "../../Common/Button";
import { useGetBookingListQuery } from "../../../store/booking/bookingApis";
import { EnrollActivityAddDrawer } from "../enroll-activity-manager/EnrollActivityAddDrawer";

const PaymentTableComponent = ({
    loading,
    fetching = false,
    count,
    data,
    pagination,
    handlePagination,
    getActivityList,
    getMembersList,
}) => {
    const [showDrawer, setShowDrawer] = React.useState(false);
    const [bookingInitalValue, setBookingInitalValue] = React.useState(false);
    const [bookingId, setBookingId] = React.useState(null);

    const [showAllMembers, setShowAllMembers] = React.useState({});

    const toggleShowAll = (index) => {
        setShowAllMembers((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const {
        data: bookings,
        isLoading: bookingsLoading,
        isFetching,
    } = useGetBookingListQuery(
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

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Member Details",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Booking Details",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Amount Paid",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Payment Details",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Payment Date",
            field: "createdAt",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Payment Status",
            field: "payment_status",
            sort: true,
            minWidth: 90,
        },
    ];

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                const paymentRes = JsonDecode(row?.payment_response);

                const eventMembers =
                    row?.booking_type === "event"
                        ? [
                              ...(row?.event_bookings_data?.[0]?.member_data || []),
                              ...(row?.event_bookings_data?.[0]?.non_member_data
                                  ? row?.event_bookings_data?.[0]?.non_member_data
                                  : []),
                          ]
                        : [];

                const memberList = row?.booking_type === "event" ? eventMembers : [row?.member_data];

                const visibleMembers = showAllMembers[index] ? memberList : memberList.slice(0, 1);

                return (
                    <TableRow
                        key={index}
                        sx={{ "td, th": { borderBottom: 1, borderBottomColor: "divider", padding: "10px" } }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>
                        <TableCell align="center">
                            {row?.bookings_data && row?.bookings_data.length > 0 ? (
                                row?.bookings_data.map(function (data, key) {
                                    const familyData =
                                        data?.family_member &&
                                        data?.family_member.length > 0 &&
                                        data?.family_member?.[0]?.name
                                            ? data?.family_member[0]
                                            : null;

                                    if (familyData)
                                        return (
                                            <Fragment>
                                                <Typography variant="subtitle2" key={key}>
                                                    Secondary Member
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    <strong>Member Id:</strong> {row?.member_data?.member_id}
                                                </Typography>
                                                <Typography variant="subtitle2" key={key}>
                                                    {" "}
                                                    {familyData?.name}
                                                </Typography>
                                            </Fragment>
                                        );
                                    else
                                        return (
                                            <Fragment>
                                                <Typography variant="subtitle2" key={key}>
                                                    Primary Member
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    <strong>Member Id:</strong> {row?.member_data?.member_id}
                                                </Typography>
                                                <Typography variant="subtitle2">{row?.member_data?.name}</Typography>
                                            </Fragment>
                                        );
                                })
                            ) : row?.booking_type === "event" ? (
                                <Box key={index} mt={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {row?.booking_type === "event" ? "Event Members" : "Primary Member"}
                                    </Typography>

                                    <Stack spacing={1}>
                                        {visibleMembers.map((member, i) => (
                                            <Box key={i} px={1} py={0.5} bgcolor="#f9f9f9" borderRadius={1}>
                                                <Typography variant="body2">
                                                    <strong>Member ID:</strong> {member?.member_id || "N/A"}
                                                </Typography>
                                                <Typography variant="body2">{member?.name || "N/A"}</Typography>
                                                {/* Optional more fields like age, phone, etc. */}
                                            </Box>
                                        ))}
                                    </Stack>

                                    {memberList.length > 1 && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 0.5,
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                color: "primary.main",
                                                display: "inline-block",
                                            }}
                                            onClick={() => toggleShowAll(index)}
                                        >
                                            {showAllMembers[index] ? "Read Less" : "Read More"}
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Fragment>
                                    <Typography variant="subtitle2">Primary Member</Typography>
                                    <Typography variant="subtitle2">
                                        <strong>Member Id:</strong> {row?.member_data?.member_id}
                                    </Typography>
                                    <Typography variant="subtitle2">{row?.member_data?.name}</Typography>
                                </Fragment>
                            )}
                        </TableCell>
                        <TableCell align="center">
                            {row?.bookings_data &&
                                row?.bookings_data.map(function (data, key) {
                                    return (
                                        <Fragment>
                                            <Typography variant="subtitle2">
                                                <strong>Booking Id:</strong>{" "}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => setBookingId(data.booking_id)}
                                                    loading={bookingsLoading || isFetching}
                                                    fullWidth={false}
                                                >
                                                    {data.booking_id}
                                                </Button>
                                            </Typography>
                                            <Typography variant="subtitle2" key={key}>
                                                <strong>Activity Name:</strong> {row?.activity_data[key]?.name} -{" "}
                                                {row?.activity_data[key]?.activity_id}
                                            </Typography>
                                        </Fragment>
                                    );
                                })}
                            {row?.plans_data &&
                                row?.plans_data.map(function (data, key) {
                                    return (
                                        <Fragment>
                                            <Typography variant="subtitle2" key={key}>
                                                <strong>Plan Name:</strong> {data?.plan_name}
                                            </Typography>
                                            <Typography variant="subtitle2" key={key}>
                                                <strong>Plan Type:</strong> {data?.plan_type}
                                            </Typography>
                                        </Fragment>
                                    );
                                })}

                            {row?.event_data &&
                                row?.event_data.map((data, key) => (
                                    <Typography variant="subtitle2" key={key}>
                                        <strong>Event Name:</strong> {data?.event_name} - {data?.event_id}
                                    </Typography>
                                ))}
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.amount_paid} Rs.</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">Payment Id: {paymentRes?.tracking_id}</Typography>
                            <Typography variant="subtitle2">Payment Mode: {row?.payment_mode}</Typography>
                        </TableCell>
                        <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                        <TableCell align="center">
                            {row?.payment_status === "Success" ? (
                                <Chip label="Success" color="success" />
                            ) : row?.payment_status === "Failed" ? (
                                <Chip label="Failed" color="error" />
                            ) : (
                                <Chip label="Pending" color="info" />
                            )}
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
            <EnrollActivityAddDrawer
                type="enrollment"
                show={showDrawer}
                close={() => [setShowDrawer(false), setBookingId(null), setBookingInitalValue(null)]}
                formType={"View"}
                initialValues={bookingInitalValue}
                getActivityList={getActivityList}
                getMembersList={getMembersList}
            />
        </Fragment>
    );
};

export default PaymentTableComponent;
