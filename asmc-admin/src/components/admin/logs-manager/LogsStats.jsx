import React from "react";
import { Grid, Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";
import { Timeline, Security, Warning, TrendingUp, Login, Error, CheckCircle, Info } from "@mui/icons-material";

const LogsStats = ({ stats }) => {
    const getActivityLevel = (count) => {
        if (count > 100) return { level: "High", color: "#d32f2f", severity: "error" };
        if (count > 50) return { level: "Medium", color: "#ed6c02", severity: "warning" };
        return { level: "Low", color: "#2e7d32", severity: "success" };
    };

    const activityLevel = getActivityLevel(stats.todayLogs || 0);

    const statCards = [
        {
            title: "Total Logs",
            value: stats.totalLogs || 0,
            icon: <Timeline color="primary" />,
            color: "#1976d2",
            description: "All system logs",
            trend: stats.totalLogs > (stats.yesterdayLogs || 0) ? "+" : "-",
        },
        {
            title: "Today's Logs",
            value: stats.todayLogs || 0,
            icon: <TrendingUp color="success" />,
            color: "#2e7d32",
            description: "Logs from today",
            trend: stats.todayLogs > (stats.yesterdayLogs || 0) ? "+" : "-",
        },
        {
            title: "This Week",
            value: stats.thisWeekLogs || 0,
            icon: <Security color="info" />,
            color: "#0288d1",
            description: "Logs from last 7 days",
        },
        {
            title: "Activity Level",
            value: activityLevel.level,
            icon:
                activityLevel.severity === "error" ? (
                    <Error />
                ) : activityLevel.severity === "warning" ? (
                    <Warning />
                ) : (
                    <CheckCircle />
                ),
            color: activityLevel.color,
            description: "Based on today's activity",
            isChip: true,
        },
    ];

    return (
        <Grid container spacing={3} pb={3}>
            {statCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                        sx={{
                            height: "100%",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3,
                            },
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        {card.isChip ? (
                                            <Chip
                                                label={card.value}
                                                color={card.icon.props.color || "default"}
                                                size="small"
                                                sx={{ fontWeight: "bold" }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="h4"
                                                component="div"
                                                sx={{ fontWeight: "bold", color: card.color }}
                                            >
                                                {card.value}
                                            </Typography>
                                        )}
                                        {card.trend && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: card.trend === "+" ? "success.main" : "error.main",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {card.trend}
                                            </Typography>
                                        )}
                                    </Stack>
                                    <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {card.description}
                                    </Typography>
                                </Box>
                                <Box sx={{ fontSize: 40, color: card.color }}>{card.icon}</Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default LogsStats;
