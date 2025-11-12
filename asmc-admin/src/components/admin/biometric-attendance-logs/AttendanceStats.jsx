import React from "react";
import { Grid } from "@mui/material";
import { CardSummary } from "../../Common/CardSummary";

const AttendanceStats = ({ stats }) => {
    const statsData = [
        {
            title: "Total Logs",
            value: stats.total_logs || 0,
        },
        {
            title: "Check-ins",
            value: stats.logs_by_type?.find((log) => log._id === "check-in")?.count || 0,
            color: "success.main",
        },
        {
            title: "Check-outs",
            value: stats.logs_by_type?.find((log) => log._id === "check-out")?.count || 0,
            color: "error.main",
        },
        {
            title: "Fingerprint Logs",
            value: stats.logs_by_method?.find((log) => log._id === "fingerprint")?.count || 0,
            color: "primary.main",
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {statsData.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <CardSummary title={stat.title} value={stat.value} />
                </Grid>
            ))}
        </Grid>
    );
};

export default AttendanceStats;
