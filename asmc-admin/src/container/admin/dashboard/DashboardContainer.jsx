import { Card, CardContent, CardHeader, Grid, Paper, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { CardSummary } from "../../../components/Common/CardSummary";
import DashboardSkeleton from "../../../components/Common/DashboardSkeleton";
import { isAuth } from "../../../helpers/cookies";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import { useGetDashboardCountQuery } from "../../../store/common/commonApis";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import HasPermission from "../../../components/Common/HasPermission";
import { DashboardPermission } from "../../../helpers/constants";

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardContainer = () => {
    const { data, isLoading } = useGetDashboardCountQuery();

    return (
        <>
            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <Fragment>
                    <HasPermission permissions={[DashboardPermission[0], "dashboard:all"]} fallback={null}>
                        <Grid container spacing={3} pb={3}>
                            <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                                <CardSummary title="Total Number of Member" value={data.totalMemberCount} />
                            </Grid>

                            <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                                <CardSummary title="Total Number of Active Member" value={data.activeMemberCount} />
                            </Grid>

                            <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                                <CardSummary
                                    title="Total Number of Active Plan Member"
                                    value={data.activePlanMemberCount}
                                />
                            </Grid>
                        </Grid>
                    </HasPermission>
                    <HasPermission permissions={[DashboardPermission[1], "dashboard:all"]} fallback={null}>
                        <Grid container spacing={3} pb={3}>
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: "#f5f5f5" }}>
                                    <CardHeader
                                        title={`Total Amount Received in Membership (Total: ${data?.totalAmountReceivedByPaymentMode?.reduce(
                                            (total, amount) => total + amount.totalAmountReceivedMembership,
                                            0,
                                        )})`}
                                    />
                                    <CardContent>
                                        <Grid container spacing={3} pb={3}>
                                            {data?.totalAmountReceivedByPaymentMode &&
                                                data?.totalAmountReceivedByPaymentMode.length > 0 &&
                                                data?.totalAmountReceivedByPaymentMode.map((item, index) => {
                                                    return (
                                                        <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={index}>
                                                            <CardSummary
                                                                title={item.payment_mode}
                                                                value={`${convertToIndianCurrency(
                                                                    item.totalAmountReceivedMembership,
                                                                )}`}
                                                                footer={`Total ${item.membershipCount} Payments for ${item.payment_mode}`}
                                                            />
                                                        </Grid>
                                                    );
                                                })}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </HasPermission>
                    <HasPermission permissions={[DashboardPermission[2], "dashboard:all"]} fallback={null}>
                        <Grid container spacing={3} pb={3}>
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: "#f5f5f5" }}>
                                    <CardHeader
                                        title={`Total Amount Received in Enrollments (Total: ${data?.totalAmountReceivedByPaymentMode?.reduce(
                                            (total, amount) => total + amount.totalAmountReceivedEnrollment,
                                            0,
                                        )})`}
                                    />
                                    <CardContent>
                                        <Grid container spacing={3} pb={3}>
                                            {data?.totalAmountReceivedByPaymentMode &&
                                                data?.totalAmountReceivedByPaymentMode.length > 0 &&
                                                data?.totalAmountReceivedByPaymentMode.map((item, index) => {
                                                    return (
                                                        <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={index}>
                                                            <CardSummary
                                                                title={item.payment_mode}
                                                                value={`${convertToIndianCurrency(
                                                                    item.totalAmountReceivedEnrollment,
                                                                )}`}
                                                                footer={`Total ${item.enrollmentCount} Payments for ${item.payment_mode}`}
                                                            />
                                                        </Grid>
                                                    );
                                                })}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </HasPermission>
                    <HasPermission permissions={[DashboardPermission[3], "dashboard:all"]} fallback={null}>
                        <Grid container spacing={3} pb={3}>
                            <Grid item lg={6} md={6} xs={12}>
                                <Paper>
                                    <MemberCountChart memberCountWithZero={data?.memberCountWithZero} />
                                </Paper>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                                <Paper>
                                    <PaymentReceivedChart paymentCountWithZero={data?.paymentCountWithZero} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </HasPermission>
                </Fragment>
            )}
        </>
    );
};

export default DashboardContainer;

const MemberCountChart = ({ memberCountWithZero }) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Calculate the total amount received
    const totalMember = Object.values(memberCountWithZero).reduce((total, amount) => total + amount, 0);

    // Prepare the data for Chart.js
    const data = {
        labels: Object.keys(memberCountWithZero).map((month) => monthNames[month - 1]), // X-axis labels (Months)
        datasets: [
            {
                label: "Members Created",
                data: Object.values(memberCountWithZero), // Y-axis data (Counts)
                borderColor: "rgba(75, 192, 192, 1)", // Line color
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color under the line
                pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
                pointBorderColor: "#fff", // Point border color
                tension: 0.4, // Line tension (curved line)
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Total Members in ${new Date().getFullYear()}`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Months",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Member Count",
                },
                beginAtZero: true, // Start Y-axis at 0
            },
        },
    };

    return (
        <Fragment>
            <Typography variant="h6" sx={{ textAlign: "center", pt: 2, fontWeight: "bold" }}>
                Total Member Registered: {totalMember}
            </Typography>
            <Line data={data} options={options} />
        </Fragment>
    );
};

const PaymentReceivedChart = ({ paymentCountWithZero }) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Calculate the total amount received
    const totalAmount = Object.values(paymentCountWithZero).reduce((total, amount) => total + amount, 0);

    // Prepare the data for Chart.js
    const data = {
        labels: Object.keys(paymentCountWithZero).map((month) => monthNames[month - 1]), // X-axis labels (Months)
        datasets: [
            {
                label: "Payment Received",
                data: Object.values(paymentCountWithZero), // Y-axis data (Counts)
                borderColor: "rgba(75, 192, 192, 1)", // Line color
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color under the line
                pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
                pointBorderColor: "#fff", // Point border color
                tension: 0.4, // Line tension (curved line)
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Payment Recevied in ${new Date().getFullYear()}`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Months",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Payment Amount",
                },
                beginAtZero: true, // Start Y-axis at 0
            },
        },
    };

    return (
        <Fragment>
            <Typography variant="h6" sx={{ textAlign: "center", pt: 2, fontWeight: "bold" }}>
                Total Amount Received: {convertToIndianCurrency(totalAmount)}
            </Typography>
            <Line data={data} options={options} />
        </Fragment>
    );
};

const convertToIndianCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    return formatter.format(amount);
};
