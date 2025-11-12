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
    Grid,
} from "@mui/material";
import { format } from "date-fns";

export const Summary = ({ data, selectedDate, selectedSlot, players, nonVerifiedMember }) => {
    const theme = useTheme();

    return (
        <Grid item xs={12}>
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
                                <TableCell sx={{ fontWeight: 600 }}>Booking Date:</TableCell>
                                <TableCell>
                                    {selectedDate?.value && format(new Date(selectedDate?.value), "dd MMM yyyy")}
                                </TableCell>
                            </TableRow>

                            <TableRow sx={{ bgcolor: "action.hover" }}>
                                <TableCell sx={{ fontWeight: 600 }}>Booking Time:</TableCell>
                                <TableCell>
                                    {selectedSlot?.start_time} - {selectedSlot?.emd_time}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Total Player:</TableCell>
                                <TableCell>{players}</TableCell>
                            </TableRow>

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
                                <TableCell>
                                    Rs. {nonVerifiedMember?.length > 0 ? selectedSlot?.non_price : selectedSlot?.price}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>
    );
};
