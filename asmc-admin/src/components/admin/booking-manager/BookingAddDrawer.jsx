import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import { BookingValidation } from "./BookingValidation";
import {
    Box,
    Card,
    CardMedia,
    Checkbox,
    Chip,
    Drawer,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import {
    useAddNewBatchBookingMutation,
    useAddNewBookingMutation,
    useUpdateBookingMutation,
} from "../../../store/booking/bookingApis";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import { calculateAge, getMonthNameByNumber } from "../../../helpers/utils";
import { format, formatISO, isValid, parseISO } from "date-fns";
import { CategoryOutlined, LocationOn } from "@mui/icons-material";
import { useGetSettingsDefaultCmsQuery } from "../../../store/common/commonApis";
import { useGetSingleActivityQuery } from "../../../store/activity/activityApis";
import { BookingMemberForm } from "./BookingMemberForm";
import { Summary } from "./Summary";

export const BookingAddDrawer = ({
    initialValues,
    show,
    close,
    formType,
    getActivityList,
    getMembersList,
    type = "booking",
}) => {
    const dispatch = useDispatch();

    const [activityData, setActivityData] = useState(null);

    const [daysCount, setDaysCount] = useState(14);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [verifiedMember, setVerifiedMember] = useState([]);
    const [nonVerifiedMember, setNonVerifiedMember] = useState([]);
    console.log(verifiedMember, "verifiedMembersverifiedMembersverifiedMembers");
    console.log(nonVerifiedMember, "nonVerifiedMembersnonVerifiedMembers");

    const [addNewBooking, { isLoading: addBookingLoading }] = useAddNewBatchBookingMutation();
    const { data: settings } = useGetSettingsDefaultCmsQuery();
    const { data: activityDataApi } = useGetSingleActivityQuery(
        { activity_id: activityData?.activity_id },
        { skip: !activityData?.activity_id },
    );

    const disabled = formType === "View" ? true : false;

    const generateNextDays = () => {
        const today = new Date();
        return Array.from({ length: daysCount }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return {
                label: format(date, "EEE, dd MMM"),
                value: format(date, "yyyy-MM-dd"),
                shortDay: format(date, "EEE"), // "Mon", "Tue", etc.
            };
        });
    };

    const getSlotsForDate = (shortDay) => {
        return activityDataApi?.batchData?.flatMap((batch) =>
            batch.slots
                .filter((slotDay) => slotDay.day === shortDay)
                .map((slotDay) => ({
                    batch,
                    slotDay,
                })),
        );
    };

    const fetchActivityData = async (activityId) => {
        if (!activityId) return;
        let payload = {
            activity_id: activityId,
        };
        const activeRes = await getActivityList(payload);
        if (activeRes && activeRes?.data && activeRes?.data?.result && activeRes?.data?.result.length > 0) {
            setActivityData(activeRes?.data?.result[0]);
        }
    };

    useEffect(() => {
        if (formType === "View" || formType === "Edit") {
            fetchActivityData(initialValues?.activity_id?.activity_id);
        } else if (formType === "Add") {
        }
    }, [initialValues, formType]);

    useEffect(() => {
        if (formType === "View" || (formType === "Edit" && activityData)) {
            const date = new Date(initialValues?.booking_date);
            if (isValid(date)) {
                setAvailableDates([
                    {
                        label: format(date, "EEE, dd MMM"),
                        value: format(date, "yyyy-MM-dd"),
                        shortDay: format(date, "EEE"), // "Mon", "Tue", etc.
                    },
                ]);
                setSelectedDate({
                    label: format(date, "EEE, dd MMM"),
                    value: format(date, "yyyy-MM-dd"),
                    shortDay: format(date, "EEE"), // "Mon", "Tue", etc.
                });
                setSelectedSlot({
                    _id: initialValues.batch,
                    day: format(date, "EEE"),
                    date: date,
                    start_time: initialValues?.booking_time,
                    emd_time: initialValues?.fees_breakup?.end_time,
                    no_of_player: initialValues?.batch_data?.[0]?.no_of_player,
                    price: initialValues?.fees_breakup?.price,
                });
            }
            const getVerifiedMember = initialValues?.players?.filter((player) => player?.is_member === "Yes");
            const getNonVerifiedMember = initialValues?.players?.filter((player) => player?.is_member === "No");
            setVerifiedMember(getVerifiedMember || []);
            setNonVerifiedMember(getNonVerifiedMember || []);
        } else if (activityData) {
            const nextDays = generateNextDays(parseInt(settings?.json?.booking_prior_days) || 15);
            setAvailableDates(nextDays);
            setSelectedDate(nextDays[0]);
        }
    }, [activityData]);

    const onFormSubmit = async (values) => {
        try {
            const players = [...verifiedMember, ...nonVerifiedMember].filter((player) => player !== null);

            const plan_details = {
                _id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?._id : null,
                plan_id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_id : null,
                plan_type: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_type : null,
                plan_name: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_name : null,
                price: parseInt(nonVerifiedMember.length > 0 ? selectedSlot.non_price : selectedSlot.price),
                day: selectedSlot?.day,
                booking_date: selectedDate?.value,
                start_time: selectedSlot?.start_time,
                end_time: selectedSlot?.end_time,
            };

            let payload = {
                amount: parseInt(nonVerifiedMember.length > 0 ? selectedSlot.non_price : selectedSlot.price),
                activity_id: activityData?._id,
                remarks: `Booking Payment From Admin Panel  `,
                batch_id: selectedSlot?._id,
                players: players,
                plan_details: plan_details,
                booking_date: selectedDate?.value,
                booking_time: selectedSlot?.start_time,
            };

            await addNewBooking(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Booking created successfully",
                    severity: "success",
                }),
            );
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
        setVerifiedMember([]);
        setNonVerifiedMember([]);
        setAvailableDates([]);
        setSelectedSlot(null);
        setSelectedDate(null);
        setActivityData(null);

        close();
    };

    const renderActivityData = useMemo(() => {
        if (!activityData || !activityDataApi) return null;
        return (
            <Grid item xs={12} md={12}>
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
                        <CardMedia
                            component="img"
                            image={
                                activityDataApi.images.length > 0 ? activityDataApi.images[0] : "/placeholder-event.jpg"
                            }
                            alt={activityDataApi.name}
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
                                {activityDataApi.name}
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
                                    <Typography variant="body2">{activityDataApi?.location_data?.title}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CategoryOutlined fontSize="small" color="action" />
                                    <Typography variant="body2">{activityDataApi?.category_data?.title}</Typography>
                                </Box>

                                {activityDataApi.short_description && (
                                    <Typography variant="body2" color="text.secondary">
                                        {activityDataApi.short_description.split(" ").slice(0, 10).join(" ")}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        );
    }, [activityData, activityDataApi]);

    const renderSlotSelection = useMemo(() => {
        if (!activityDataApi) return null;

        return (
            <Grid item xs={12}>
                {/* Date Selector */}
                <Box
                    display="flex"
                    overflow="auto"
                    gap={1}
                    py={2}
                    borderBottom="1px solid"
                    borderColor="divider"
                    mb={3}
                >
                    {availableDates.map((date, index) => (
                        <Button
                            key={index}
                            variant={selectedDate?.value === date.value ? "contained" : "outlined"}
                            size="small"
                            onClick={() => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                            sx={{
                                minWidth: 100,
                                whiteSpace: "nowrap",
                                textTransform: "none",
                            }}
                            disabled={disabled}
                        >
                            {date.label}
                        </Button>
                    ))}
                </Box>

                {/* Slot Grid */}
                {selectedDate && (
                    <Grid container spacing={3}>
                        {getSlotsForDate(selectedDate.shortDay)?.length > 0 ? (
                            getSlotsForDate(selectedDate.shortDay).map(({ batch, slotDay }, batchIndex) => (
                                <Grid item xs={12} key={batchIndex}>
                                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                                        {/* Batch Header */}
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            flexWrap="wrap"
                                            mb={2}
                                        >
                                            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                                                {batch.batch_name}
                                            </Typography>
                                            <Chip
                                                label={batch.batch_type}
                                                size="small"
                                                sx={{ textTransform: "uppercase" }}
                                            />
                                        </Box>

                                        {/* Slots */}
                                        <Box display="flex" flexWrap="wrap" gap={2}>
                                            {slotDay.time_slots?.length > 0 ? (
                                                slotDay.time_slots.map((slot, slotIndex) => {
                                                    const slotDateTime = new Date(
                                                        `${selectedDate.value}T${new Date(slot.from).toTimeString()}`,
                                                    );
                                                    const now = new Date();
                                                    const isExpired = slotDateTime < now;

                                                    const isSelected =
                                                        selectedSlot?._id === batch?._id &&
                                                        selectedSlot?.day === slotDay.day &&
                                                        selectedSlot?.start_time ===
                                                            format(parseISO(slot?.from), "HH:mm a");

                                                    const isSlotBooked = batch?.booked_slots?.some(
                                                        (bookedSlot) =>
                                                            bookedSlot.booking_date === selectedDate?.value &&
                                                            bookedSlot.booking_time ===
                                                                format(parseISO(slot?.from), "HH:mm a"),
                                                    );

                                                    const bgColor = isExpired
                                                        ? "#f0f0f0"
                                                        : isSlotBooked
                                                        ? "#ffebeb"
                                                        : isSelected
                                                        ? "#e6f4ea"
                                                        : "#fafafa";

                                                    const borderColor = isSelected
                                                        ? "#198754"
                                                        : isSlotBooked
                                                        ? "#f44336"
                                                        : "#ccc";

                                                    if ((formType === "View" || formType === "Edit") && !isSelected) {
                                                        return false;
                                                    }
                                                    return (
                                                        <Box
                                                            key={slotIndex}
                                                            onClick={() => {
                                                                if (isExpired || isSlotBooked) return;
                                                                setSelectedSlot({
                                                                    _id: batch._id,
                                                                    day: slotDay.day,
                                                                    date: selectedDate.value,
                                                                    start_time: format(parseISO(slot?.from), "HH:mm a"),
                                                                    end_time: format(parseISO(slot?.to), "HH:mm a"),
                                                                    price: slot.price,
                                                                    non_price: slot.non_price,
                                                                    batch_name: batch.batch_name,
                                                                    batch_type: batch.batch_type,
                                                                    no_of_player: parseInt(batch.no_of_player),
                                                                    fees: batch.fees,
                                                                });
                                                            }}
                                                            sx={{
                                                                flex: "1 1 220px",
                                                                minWidth: "200px",
                                                                maxWidth: "240px",
                                                                p: 2,
                                                                textAlign: "center",
                                                                backgroundColor: bgColor,
                                                                border: `1px solid ${borderColor}`,
                                                                borderRadius: 2,
                                                                cursor:
                                                                    isExpired || isSlotBooked
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                                transition: "0.2s",
                                                                "&:hover": {
                                                                    boxShadow:
                                                                        !isExpired && !isSlotBooked
                                                                            ? "0 0 0 2px #19875444"
                                                                            : undefined,
                                                                },
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle2"
                                                                fontWeight="bold"
                                                                textTransform="uppercase"
                                                                mb={1}
                                                            >
                                                                {format(new Date(slot.from), "hh:mm a")} –{" "}
                                                                {format(new Date(slot.to), "hh:mm a")}
                                                            </Typography>
                                                            <Typography fontWeight={600}>
                                                                Rs. {slot.price} / {slot.non_price}
                                                            </Typography>

                                                            {isExpired && (
                                                                <Typography variant="caption" color="warning.main">
                                                                    Expired
                                                                </Typography>
                                                            )}
                                                            {isSlotBooked && (
                                                                <Typography variant="caption" color="error.main">
                                                                    <strong>Booked</strong>
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    );
                                                })
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No slots available for this day
                                                </Typography>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography align="center" color="text.secondary">
                                    No slots available for this day
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>
        );
    }, [
        activityDataApi,
        availableDates,
        selectedDate,
        setSelectedDate,
        getSlotsForDate,
        selectedSlot,
        setSelectedSlot,
    ]);

    const renderMemberSelection = useMemo(() => {
        if (!selectedSlot) return null;
        return (
            <BookingMemberForm
                data={activityDataApi}
                verifiedMembers={verifiedMember}
                setVerifiedMembers={setVerifiedMember}
                nonVerifiedMembers={nonVerifiedMember}
                setNonVerifiedMembers={setNonVerifiedMember}
                selectedSlot={selectedSlot}
                disabled={disabled}
            />
        );
    }, [
        activityData,
        activityDataApi,
        verifiedMember,
        setVerifiedMember,
        nonVerifiedMember,
        setNonVerifiedMember,
        selectedSlot,
    ]);

    const renderSummary = useMemo(() => {
        if (!activityData || !selectedSlot) return null;
        return (
            <Summary
                data={activityDataApi}
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                players={[...(verifiedMember || []), ...(nonVerifiedMember || [])].length}
                nonVerifiedMembers={nonVerifiedMember}
            />
        );
    }, [activityData, activityDataApi, selectedSlot, selectedDate, verifiedMember, nonVerifiedMember]);

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
                                    {formType === "Add" ? "Create New Booking" : "Manage Created Bookings"}{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"} sx={{ width: "100%" }}>
                            <Grid container spacing={2} sx={{ width: "100%" }}>
                                <Grid item xs={12} md={12}>
                                    <AutoCompleteServerSide
                                        label="Type & Select Activity *"
                                        name="activity_id"
                                        id="activity_id"
                                        fullWidth
                                        fetchDataFunction={(d) => getActivityList(d)}
                                        onChange={(val) => {
                                            if (val) {
                                                setFieldValue("activity_id", val);
                                                setActivityData(val);
                                            } else {
                                                setFieldValue("activity_id", null);
                                                setActivityData(null);
                                            }
                                        }}
                                        defaultValue={activityData || null}
                                        error={Boolean(errors.activity_id)}
                                        helperText={errors.activity_id}
                                        isMultiple={true}
                                        disabled={disabled}
                                        apiParams={{ active: true, batch_status: true, type }}
                                    />
                                </Grid>
                                {renderActivityData}
                                {renderSlotSelection}
                                {renderMemberSelection}
                                {renderSummary}
                                {/* {verifiedMember.length + nonVerifiedMember.length ===
                                    parseInt(selectedSlot?.no_of_player) && (
                                    <Fragment>
                                        <div className="input-group">
                                            <h5>
                                                <strong>Total Amount:</strong>{" "}
                                                {nonVerifiedMember.length > 0
                                                    ? selectedSlot.non_price
                                                    : selectedSlot.price}{" "}
                                                Rs.
                                            </h5>
                                        </div>

                                        <div className="text-center cta-btn">
                                            <button type="submit" className="cmn-button" onClick={() => handleSubmit()}>
                                                Pay Now
                                            </button>
                                        </div>
                                    </Fragment>
                                )} */}
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
                                            loading={addBookingLoading}
                                            onClick={() => handleSubmit()}
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
