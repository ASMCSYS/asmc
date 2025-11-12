import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    useTheme,
} from "@mui/material";

export const Summary = ({ selectedCategory, eventData, calculateTotalAmount, quantity = 0 }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                mt: 4,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" component="div" sx={{ mb: 3, fontWeight: 600 }}>
                Summary
            </Typography>

            <TableContainer>
                <Table
                    sx={{
                        "& .MuiTableCell-root": {
                            border: `1px solid ${theme.palette.divider}`,
                            padding: "12px 16px",
                        },
                    }}
                >
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Selected Category:</TableCell>
                            <TableCell>{selectedCategory.category_name}</TableCell>
                        </TableRow>

                        <TableRow sx={{ bgcolor: "action.hover" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Age Group:</TableCell>
                            <TableCell>
                                {selectedCategory.start_age} - {selectedCategory.end_age}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Gender:</TableCell>
                            <TableCell>{selectedCategory.gender.join(", ")}</TableCell>
                        </TableRow>

                        {selectedCategory.distance && (
                            <TableRow sx={{ bgcolor: "action.hover" }}>
                                <TableCell sx={{ fontWeight: 600 }}>Distance:</TableCell>
                                <TableCell>{selectedCategory.distance} meters</TableCell>
                            </TableRow>
                        )}

                        <TableRow
                            sx={{
                                bgcolor: "success.light",
                                "& .MuiTableCell-root": {
                                    fontWeight: 600,
                                    color: "success.dark",
                                },
                            }}
                        >
                            <TableCell>Total Amount to Pay:</TableCell>
                            <TableCell>Rs. {calculateTotalAmount()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};
