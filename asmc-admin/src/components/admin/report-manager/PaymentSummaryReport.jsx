import React, { useEffect, useState } from "react";
import {
    Grid,
    MenuItem,
    Select,
    Typography,
    Paper,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { parseISO, getYear, format } from "date-fns";

const PaymentSummaryReport = ({ loading, data }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [groupedData, setGroupedData] = useState({});

    // Group data by month for the selected year
    const groupDataByMonth = (data, year) => {
        const result = {};

        data.forEach((item) => {
            const date = parseISO(item.date); // Parse date string into Date object
            if (getYear(date) === year) {
                const month = format(date, "MMMM"); // Get month name
                if (!result[month]) {
                    result[month] = {
                        total_amount: 0,
                        transaction_count: 0,
                    };
                }

                // Accumulate amounts and counts
                Object.entries(item).forEach(([key, value]) => {
                    if (key !== "date") {
                        // Initialize key if not already present
                        if (!result[month][key]) result[month][key] = 0;
                        result[month][key] += value;
                    }
                });
            }
        });

        return result;
    };

    // Update grouped data when `data` or `selectedYear` changes
    useEffect(() => {
        const grouped = groupDataByMonth(data, selectedYear);
        setGroupedData(grouped);
    }, [data, selectedYear]);

    // Handle year selection
    const handleYearChange = (event) => {
        setSelectedYear(Number(event.target.value));
    };

    return (
        <Grid container>
            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item>
                    <Typography>Filter by Year:</Typography>
                </Grid>
                <Grid item>
                    <Select
                        value={selectedYear}
                        onChange={handleYearChange}
                        variant="outlined"
                        size="small"
                    >
                        {[...new Set(data.map((item) => getYear(parseISO(item.date))))].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {Object.entries(groupedData).map(([month, values]) => (
                        <Grid item xs={12} sm={6} md={4} key={month}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    {month}
                                </Typography>
                                <Box>
                                    <Typography variant="body1">
                                        <strong>Total Amount:</strong> Rs. {values.total_amount}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Total Transactions:</strong> {values.transaction_count}
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Mode</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Counts</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(values).map(([key, value]) => {
                                                if (
                                                    key !== "total_amount" &&
                                                    key !== "transaction_count" &&
                                                    !key.includes("_count")
                                                ) {
                                                    // Extract the count for the current payment mode
                                                    const countKey = `${key}_count`;
                                                    const count = values[countKey] || 0; // Default to 0 if no count found

                                                    return (
                                                        <TableRow key={key}>
                                                            <TableCell>{key}</TableCell>
                                                            <TableCell>Rs. {value}</TableCell>
                                                            <TableCell>{count}</TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                return null; // Return null for keys to ignore
                                            })}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Grid>
    );
};

export default PaymentSummaryReport;
