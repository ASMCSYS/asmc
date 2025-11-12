import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import { BookingValidation } from "./HallBookingValidation";
import {
    Avatar,
    Box,
    Card,
    CardMedia,
    Chip,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    Typography,
    TextField,
} from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import { CalendarToday, Close as CloseIcon, Email, LocationOn, Phone } from "@mui/icons-material";
import { setSnackBar } from "../../../store/common/commonSlice";
import { addDays, format, isSameDay, isSunday } from "date-fns";
import {
    useAddNewHallBookingMutation,
    useFetchHallsBookedQuery,
    useUpdateHallBookingMutation,
} from "../../../store/halls/hallsApis";
import { CalendarIcon } from "@mui/x-date-pickers";

const getInitials = (name) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
};

export const HallBookingAddDrawer = ({ initialValues, show, close, formType, getHallsList, getMembersList }) => {
    const dispatch = useDispatch();

    const [formInitialValue, setFormInitialValue] = useState({});
    const [loading, setLoading] = useState(true);
    const [hallData, setHallData] = useState(null);
    const [memberData, setMemberData] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSundays, setAvailableSundays] = useState([]);
    const [paymentMode, setPaymentMode] = useState("advance");
    const [purpose, setPurpose] = useState("");

    const { data: bookedHall } = useFetchHallsBookedQuery({ hall_id: hallData?._id }, { skip: !hallData?.hall_id });

    const [addNewBooking, { isLoading: addBookingLoading }] = useAddNewHallBookingMutation();
    const [updateBooking, { isLoading: updateBookingLoading }] = useUpdateHallBookingMutation();

    console.log(bookedHall, "bookedHall");
    console.log(hallData, "hallData");

    const disabled = formType === "View" ? true : false;

    const today = new Date();

    useEffect(() => {
        if (hallData?.advance_booking_period) {
            // Generate available Sundays after advance booking period
            const sundays = [];
            let date = addDays(today, Number(hallData?.advance_booking_period || 90));

            while (!isSunday(date)) {
                date = addDays(date, 1);
            }

            for (let i = 0; i < 20; i++) {
                sundays.push(date);
                date = addDays(date, 7);
            }

            setAvailableSundays(sundays);
        }
    }, [hallData]);

    const isBooked = (date) => {
        return bookedHall?.some((booked) => isSameDay(new Date(booked), date));
    };

    const fetchInitialFunction = async () => {
        if (!initialValues?.halls_data?.hall_id) return;
        let payload = {
            hall_id: initialValues?.halls_data?.hall_id,
        };
        const activeRes = await getHallsList(payload);
        if (activeRes && activeRes?.data && activeRes?.data?.result && activeRes?.data?.result.length > 0) {
            setHallData({ ...activeRes?.data?.result[0], name: activeRes?.data?.result[0]?.name });
            setLoading(false);
        }

        let memberPayload = {
            member_id: initialValues?.member_id_data?.member_id,
        };
        const memberRes = await getMembersList(memberPayload);
        if (memberRes && memberRes?.data && memberRes?.data?.result && memberRes?.data?.result.length > 0) {
            setMemberData(memberRes?.data?.result[0]);
            setLoading(false);
        }

        setFormInitialValue({
            hall_id: initialValues?.hall_id,
            member_id: initialValues?.member_id,
            slot_from: initialValues?.slot_from,
            slot_to: initialValues?.slot_to,
            booking_date: initialValues?.booking_date,
            is_full_payment: initialValues?.is_full_payment ? "full" : "advance",
        });

        const slotData = {
            from: initialValues?.slot_from,
            to: initialValues?.slot_to,
        };

        setSelectedSlot(slotData);
        setSelectedDate(initialValues?.booking_date ? new Date(initialValues?.booking_date) : null);
        setPaymentMode(initialValues?.is_full_payment ? "full" : "advance");
        setPurpose(initialValues?.purpose || "");
    };

    useEffect(() => {
        if (formType === "View" || formType === "Edit") {
            fetchInitialFunction();
        } else {
        }
        setLoading(false);
    }, [initialValues, formType]);

    const onFormSubmit = async (values) => {
        try {
            if (!purpose.trim()) {
                alert("Please provide the purpose of your hall booking.");
                return;
            }

            const payload = {
                hall_id: hallData?._id,
                member_id: memberData?._id,
                slot_from: selectedSlot?.from,
                slot_to: selectedSlot?.to,
                booking_date: selectedDate,
                is_full_payment: paymentMode === "full",
                purpose: purpose,
            };

            if (formType === "Edit") {
                payload._id = initialValues._id;
                await updateBooking(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Booking updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewBooking(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Booking created successfully",
                        severity: "success",
                    }),
                );
            }
            handleClose();
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

    const handleClose = () => {
        setHallData(null);
        setMemberData(null);
        setAvailableSundays(null);
        setSelectedSlot(null);
        setSelectedDate(null);
        setPaymentMode(null);
        setPurpose("");
        close();
    };

    const renderHallData = useMemo(() => {
        if (!hallData) return null;
        return (
            <Grid item xs={12} md={7}>
                <Card
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                        mx: "auto",
                        height: { xs: 150, md: 200 },
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                        {/* Event Image */}
                        <CardMedia
                            component="img"
                            image={hallData.images.length > 0 ? hallData.images[0] : "/placeholder-event.jpg"}
                            alt={hallData.name}
                            sx={{
                                width: { md: 180 },
                                height: { xs: 150, md: 200 },
                                objectFit: "cover",
                                borderRight: { md: "1px solid" },
                                borderColor: { md: "divider" },
                            }}
                        />

                        {/* Event Details */}
                        <Box sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                                {hallData.name}
                            </Typography>
                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <LocationOn fontSize="small" color="action" />
                                    <Typography variant="body2">{hallData?.location_data?.title}</Typography>
                                </Box>

                                {hallData.description && (
                                    <Typography variant="body2" color="text.secondary">
                                        {hallData.description.split(" ").slice(0, 10).join(" ")}
                                    </Typography>
                                )}
                            </Box>

                            {/* Date Section */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <CalendarToday fontSize="small" color="primary" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Booking Period (Times)
                                            </Typography>
                                            <Typography variant="body2">
                                                {format(new Date(hallData.time_slots?.[0]?.from), "hh:mm aa")} -{" "}
                                                {format(new Date(hallData.time_slots?.[0]?.to), "hh:mm aa")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        );
    }, [hallData]);

    const renderMemberData = useMemo(() => {
        if (!memberData) return null;
        return (
            <Grid item xs={12} md={5}>
                <Card
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 2,
                        mx: "auto",
                        height: { xs: 150, md: 200 },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Avatar
                            src={memberData?.profile}
                            sx={{
                                width: 80,
                                height: 80,
                                fontSize: "1.5rem",
                                bgcolor: "primary.main",
                            }}
                        >
                            {!memberData?.profile && getInitials(memberData?.name)}
                        </Avatar>

                        {/* Member Details */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {memberData?.name}
                                <Chip
                                    label={memberData?.is_active ? "Active" : "Inactive"}
                                    size="small"
                                    color={memberData?.is_active ? "success" : "error"}
                                    sx={{ ml: 1, fontSize: "0.75rem" }}
                                />
                            </Typography>

                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Email fontSize="small" color="action" />
                                    <Typography variant="body2">{memberData?.email}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Phone fontSize="small" color="action" />
                                    <Typography variant="body2">{memberData?.mobile || "Not provided"}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2">
                                        {memberData?.clothing_type} Size: {memberData?.clothing_size}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2">Tshirt Size: {memberData?.tshirt_size}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                    <Chip
                                        label={`Membership ID: ${memberData?.member_id}`}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={`Joined: ${format(new Date(memberData?.createdAt), "dd MMM yyyy")}`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        );
    }, [memberData]);

    const renderBookingData = useMemo(() => {
        if (!availableSundays || availableSundays?.length === 0) return null;
        return (
            <Fragment>
                <Grid item xs={12}>
                    <Typography variant="h6">Select Booking Date (Available Sundays):</Typography>
                </Grid>
                {availableSundays &&
                    availableSundays.map((sunday, idx) => {
                        const isDisabled = isBooked(sunday);
                        const isSelected = selectedDate?.toDateString() === sunday.toDateString();

                        return (
                            <Grid item xs={6} sm={4} md={3} key={idx}>
                                <Button
                                    fullWidth
                                    variant={isSelected ? "contained" : "outlined"}
                                    color="primary"
                                    onClick={() => !isDisabled && setSelectedDate(sunday)}
                                    disabled={isDisabled}
                                >
                                    <Grid container direction="row" alignItems="center" justifyContent="center">
                                        <Typography variant="body2">{format(sunday, "dd MMM yyyy")}</Typography>
                                        {isDisabled && (
                                            <Typography variant="caption" color="error" fontWeight="bold">
                                                (Booked)
                                            </Typography>
                                        )}
                                    </Grid>
                                </Button>
                            </Grid>
                        );
                    })}
            </Fragment>
        );
    }, [availableSundays, selectedDate, isBooked, setSelectedDate]);

    const renderBookingSlot = useMemo(() => {
        if (!hallData) return null;
        return (
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Select a Time Slot:
                </Typography>

                <Grid container spacing={2}>
                    {hallData?.time_slots?.map((slot, i) => {
                        const fromTime = new Date(slot.from);
                        const toTime = new Date(slot.to);

                        const selectedFromTime = selectedSlot ? new Date(selectedSlot.from) : null;
                        const selectedToTime = selectedSlot ? new Date(selectedSlot.to) : null;

                        const isSelected =
                            selectedFromTime?.getHours() === fromTime.getHours() &&
                            selectedFromTime?.getMinutes() === fromTime.getMinutes() &&
                            selectedToTime?.getHours() === toTime.getHours() &&
                            selectedToTime?.getMinutes() === toTime.getMinutes();

                        const handleClick = () => {
                            if (!selectedDate) {
                                alert("Please select a booking date first.");
                                return;
                            }

                            const from = new Date(selectedDate);
                            from.setHours(fromTime.getHours(), fromTime.getMinutes(), 0, 0);

                            const to = new Date(selectedDate);
                            to.setHours(toTime.getHours(), toTime.getMinutes(), 0, 0);

                            setSelectedSlot({ from, to });
                        };

                        return (
                            <Grid item xs={6} md={4} lg={3} key={i}>
                                <Button
                                    fullWidth
                                    variant={isSelected ? "contained" : "outlined"}
                                    color="primary"
                                    startIcon={<CalendarIcon />}
                                    onClick={handleClick}
                                    disabled={!selectedDate}
                                    sx={{ textAlign: "left", boxShadow: 1 }}
                                >
                                    {format(fromTime, "hh:mm a")} - {format(toTime, "hh:mm a")}
                                </Button>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        );
    }, [selectedDate, selectedSlot, hallData]);

    const renderPurposeField = useMemo(() => {
        if (!selectedDate || !selectedSlot) return null;

        return (
            <Grid item xs={12}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Purpose of Booking:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Please describe the purpose of your hall booking..."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        required
                        variant="outlined"
                    />
                </Box>
            </Grid>
        );
    }, [selectedDate, selectedSlot, purpose]);

    const renderCreatePaymentOptions = useMemo(() => {
        if (!selectedDate || !selectedSlot || !hallData) return null;

        const totalAmount =
            Number(hallData?.booking_amount || 0) +
            Number(hallData?.cleaning_charges || 0) +
            Number(hallData?.refundable_deposit || 0) +
            Number(hallData?.additional_charges || 0);

        const advanceAmount = Number(hallData?.advance_payment_amount || 0);

        return (
            <Grid item xs={12}>
                <Box sx={{ mt: 5 }}>
                    <FormControl>
                        <FormLabel>
                            <Typography variant="h6">Select Payment Option:</Typography>
                        </FormLabel>
                        <RadioGroup
                            row
                            name="paymentMode"
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                        >
                            <FormControlLabel
                                value="advance"
                                control={<Radio />}
                                label={`Pay Advance Only (Rs. ${advanceAmount})`}
                            />
                            <FormControlLabel
                                value="full"
                                control={<Radio />}
                                label={`Pay Full Amount (Rs. ${totalAmount})`}
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Grid>
        );
    }, [selectedDate, selectedSlot, paymentMode, hallData]);

    const renderEditPaymentSummary = useMemo(() => {
        if (!initialValues) return null;

        const amountPaid = Number(initialValues?.amount_paid || 0);
        const totalAmount = Number(initialValues?.total_amount || 0);
        const refundableDeposit = Number(initialValues?.refundable_deposit || 0);
        const remainingAmount = Math.max(totalAmount - amountPaid, 0);

        const isFullPayment = initialValues?.is_full_payment;
        const paymentStatus = initialValues?.payment_status;

        return (
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Payment Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" justifyContent="space-between">
                                <strong>Total Amount:</strong>
                                <Typography>Rs. {totalAmount}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" justifyContent="space-between">
                                <strong>Amount Paid:</strong>
                                <Typography color="green">Rs. {amountPaid}</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" justifyContent="space-between">
                                <strong>Remaining:</strong>
                                <Typography color={remainingAmount > 0 ? "error.main" : "textPrimary"}>
                                    Rs. {remainingAmount}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" justifyContent="space-between">
                                <strong>Refundable Deposit:</strong>
                                <Typography>Rs. {refundableDeposit}</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" justifyContent="space-between">
                                <strong>Payment Type:</strong>
                                <Chip
                                    label={isFullPayment ? "Full Payment" : "Advance Payment"}
                                    color={isFullPayment ? "primary" : "warning"}
                                    size="small"
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" justifyContent="space-between">
                                <strong>Payment Status:</strong>
                                <Chip
                                    label={paymentStatus}
                                    color={paymentStatus === "Success" ? "success" : "default"}
                                    size="small"
                                />
                            </Stack>
                        </Grid>
                    </Grid>

                    {amountPaid >= totalAmount && paymentStatus === "Success" && (
                        <Box mt={2}>
                            <Chip
                                label="Deposit will be refunded post-event"
                                variant="outlined"
                                color="success"
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    )}
                </Paper>
            </Grid>
        );
    }, [initialValues]);

    if (loading) return <></>;

    return (
        <Drawer
            anchor={"right"}
            open={show}
            PaperProps={{
                sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
            }}
            onClose={() => handleClose()}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onFormSubmit(values)}
                validationSchema={BookingValidation}
                enableReinitialize
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons
                                    color="default"
                                    title="Close"
                                    IconComponent={CloseIcon}
                                    onClick={() => handleClose()}
                                />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">
                                    {" "}
                                    {formType === "Add" ? "Create New Hall Booking" : "Update Hall Booking"}{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <AutoCompleteServerSide
                                        label="Type & Select Primary Member *"
                                        name="member_id"
                                        id="member_id"
                                        fullWidth
                                        fetchDataFunction={(d) => getMembersList(d)}
                                        onChange={(val) => {
                                            if (val) {
                                                setFieldValue("member_id", val);
                                                setMemberData(val);
                                            } else {
                                                setFieldValue("member_id", null);
                                                setMemberData(null);
                                            }
                                        }}
                                        defaultValue={memberData || null}
                                        error={Boolean(errors?.member_id)}
                                        helperText={errors?.member_id}
                                        isMultiple={true}
                                        disabled={disabled}
                                        apiParams={{ active: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <AutoCompleteServerSide
                                        label="Type & Select Hall *"
                                        name="hall_id"
                                        id="hall_id"
                                        fullWidth
                                        fetchDataFunction={(d) => getHallsList(d)}
                                        onChange={(val) => {
                                            if (val) {
                                                setFieldValue("hall_id", val);
                                                setHallData(val);
                                            } else {
                                                setFieldValue("hall_id", null);
                                                setHallData(null);
                                            }
                                        }}
                                        defaultValue={hallData || null}
                                        error={Boolean(errors?.hall_id)}
                                        helperText={errors?.hall_id}
                                        isMultiple={true}
                                        disabled={disabled}
                                        apiParams={{ active: true }}
                                        keyname="name"
                                    />
                                </Grid>
                                {renderMemberData}
                                {renderHallData}
                                {renderBookingData}
                                {renderBookingSlot}
                                {renderPurposeField}
                                {formType === "Add" ? renderCreatePaymentOptions : renderEditPaymentSummary}
                            </Grid>
                        </Grid>

                        {formType !== "View" ? (
                            <Grid
                                flexShrink={0}
                                borderTop={1}
                                borderColor={"rgba(152, 188, 252, 0.16)"}
                                sx={{ padding: "8px 16px" }}
                            >
                                <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Button size="large" color="warning" type="button" onClick={() => close()}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="large"
                                            type="submit"
                                            // loading={addBookingLoading || updateBookingLoading}
                                            onClick={() => handleSubmit()}
                                            disabled={!selectedDate || !selectedSlot}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                )}
            </Formik>
        </Drawer>
    );
};
