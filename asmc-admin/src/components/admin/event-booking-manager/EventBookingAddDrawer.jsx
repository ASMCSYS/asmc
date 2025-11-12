import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import { BookingValidation } from "./EventBookingValidation";
import {
    Box,
    Drawer,
    Grid,
    Typography,
    Card,
    CardMedia,
    Alert,
    Avatar,
    Chip,
    Paper,
    CardHeader,
    Switch,
} from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { useAddNewEventBookingMutation, useUpdateEventBookingMutation } from "../../../store/events/eventsApis";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import { format, isBefore } from "date-fns";
import {
    CalendarToday,
    EventAvailable,
    Email,
    Phone,
    Close as CloseIcon,
    Height,
    LocationOn,
    Add,
} from "@mui/icons-material";
import { ParticipantForm } from "./ParticipantForm";
import { calculateAge } from "../../../helpers/utils";
import EligibleCategories from "./EligibleCategories";
import { Summary } from "./Summary";
import { setSnackBar } from "../../../store/common/commonSlice";
import { SingleEventForm } from "./SingleEventForm";
import { DoubleEventForm } from "./DoubleEventForm";
import { TeamEventForm } from "./TeamEventForm";

const getInitials = (name) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
};

export const EventBookingAddDrawer = ({ initialValues, show, close, formType, getEventsList, getMembersList }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        yourself: "No",
        are_you_member: "No",
        partner_member: "No",
        team_members: [],
    });

    useEffect(() => {
        // Only reset form data for new bookings, not for edit/view
        if (formType === "Add") {
            setFormData({
                yourself: "No",
                are_you_member: "No",
                partner_member: "No",
                team_members: [],
            });
        }
    }, [formType]);

    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState(null);

    const [verifiedMembers, setVerifiedMembers] = useState([]);
    const [nonVerifiedMembers, setNonVerifiedMembers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [totalAmountToPay, setTotalAmountToPay] = useState(null);
    const [showPayButton, setShowPayButton] = useState(false);

    useEffect(() => {
        if (eventData?.event_type === "Single") {
            if (formData?.are_you_member === "Yes" && verifiedMembers && verifiedMembers.length > 0) {
                setShowPayButton(true);
            } else if (nonVerifiedMembers && nonVerifiedMembers.length > 0) {
                setShowPayButton(true);
            } else {
                setShowPayButton(false);
            }
        } else if (eventData?.event_type === "Double" && (nonVerifiedMembers || verifiedMembers)) {
            const memberLength = nonVerifiedMembers.length + verifiedMembers.length;
            if (memberLength === 2) {
                setShowPayButton(true);
            } else {
                setShowPayButton(false);
            }
        }
    }, [nonVerifiedMembers, verifiedMembers, eventData, formData]);

    const [addNewBooking, { isLoading: addBookingLoading }] = useAddNewEventBookingMutation();
    const [updateBooking, { isLoading: updateBookingLoading }] = useUpdateEventBookingMutation();

    const disabled = formType === "View" ? true : false;

    const fetchInitialFunction = async () => {
        if (!initialValues?.events_data?.event_id) return;
        let payload = {
            event_id: initialValues?.events_data?.event_id,
        };
        const activeRes = await getEventsList(payload);
        if (activeRes && activeRes?.data && activeRes?.data?.result && activeRes?.data?.result.length > 0) {
            setEventData({ ...activeRes?.data?.result[0], name: activeRes?.data?.result[0]?.event_name });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (formType === "View" || formType === "Edit") {
            fetchInitialFunction();
            setVerifiedMembers(initialValues?.member_data || []);
            setNonVerifiedMembers(initialValues?.non_member_data || []);
            setSelectedCategory(initialValues?.category_data || null);

            // Set form data from booking_form_data with proper defaults
            const bookingFormData = initialValues?.booking_form_data || {};

            // If yourself is "Yes" and member_data exists, set are_you_member to "Yes"
            const hasMemberData = initialValues?.member_data && initialValues.member_data.length > 0;
            const shouldBeMember = bookingFormData.yourself === "Yes" && hasMemberData;

            setFormData({
                yourself: bookingFormData.yourself || "No",
                are_you_member: shouldBeMember
                    ? "Yes"
                    : bookingFormData.are_you_member === ""
                    ? "No"
                    : bookingFormData.are_you_member || "No",
                partner_member: bookingFormData.partner_member === "" ? "No" : bookingFormData.partner_member || "No",
                team_members: bookingFormData.team_members || [],
            });
        } else {
            // For Add mode, ensure form data is properly initialized
            setFormData({
                yourself: "No",
                are_you_member: "No",
                partner_member: "No",
                team_members: [],
            });
        }
        setLoading(false);
    }, [initialValues, formType]);

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        const memberFee = parseInt(selectedCategory.members_fees);
        const nonMemberFee = parseInt(selectedCategory.non_members_fees);

        if (eventData?.event_type === "Single") {
            if (formData?.are_you_member === "Yes") {
                totalAmount += memberFee;
            } else {
                totalAmount += nonMemberFee;
            }
        } else if (eventData?.event_type === "Double") {
            totalAmount += memberFee * verifiedMembers.length;
            totalAmount += nonMemberFee * nonVerifiedMembers.length;
        } else if (eventData?.event_type === "Team") {
            // formData?.team_members.forEach((player) => {
            //     if (player?.is_member === "Yes") {
            //         totalAmount += memberFee;
            //     } else {
            //         totalAmount += nonMemberFee;
            //     }
            // });
            if (nonVerifiedMembers.length > 0) {
                totalAmount = parseInt(eventData?.non_member_team_event_price);
            } else if (verifiedMembers.length > 0) {
                totalAmount = parseInt(eventData?.member_team_event_price);
            } else {
                totalAmount = 0;
            }
        }

        setTotalAmountToPay(totalAmount);
        return parseInt(totalAmount);
    };

    const onFormSubmit = async (values) => {
        try {
            const payload = {
                event_id: eventData?._id,
                category_id: selectedCategory?._id,
                booking_form_data: formData,
                category_data: selectedCategory,
                member_data: verifiedMembers.filter((member) => member !== null),
                non_member_data: nonVerifiedMembers.filter((member) => member !== null),
                amount_paid: totalAmountToPay,
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
        setEventData(null);
        setTotalAmountToPay(null);
        setVerifiedMembers([]);
        setNonVerifiedMembers([]);
        setSelectedCategory(null);
        setShowPayButton(false);
        // Reset form data to default values
        setFormData({
            yourself: "No",
            are_you_member: "No",
            partner_member: "No",
            team_members: [],
        });
        close();
    };

    const renderEventData = useMemo(() => {
        if (!eventData) return null;
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
                        {/* Event Image */}
                        <CardMedia
                            component="img"
                            image={eventData.images.length > 0 ? eventData.images[0] : "/placeholder-event.jpg"}
                            alt={eventData.event_name}
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
                                {eventData.event_name}
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
                                    <Typography variant="body2">{eventData?.location_data?.title}</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <EventAvailable fontSize="small" color="action" />
                                    <Typography variant="body2">{eventData?.event_type}</Typography>
                                </Box>

                                {eventData.description && (
                                    <Typography variant="body2" color="text.secondary">
                                        {eventData.description.split(" ").slice(0, 10).join(" ")}
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
                                                Booking Period
                                            </Typography>
                                            <Typography variant="body2">
                                                {format(new Date(eventData.registration_start_date), "dd MMM yyyy")} -{" "}
                                                {format(new Date(eventData.registration_end_date), "dd MMM yyyy")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <EventAvailable fontSize="small" color="primary" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Event Dates
                                            </Typography>
                                            <Typography variant="body2">
                                                {format(new Date(eventData.event_start_date), "dd MMM yyyy")} -{" "}
                                                {format(new Date(eventData.event_end_date), "dd MMM yyyy")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Booking Status Alert */}
                            {isBefore(new Date(), new Date(eventData.registration_start_date)) && (
                                <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>
                                    <Typography variant="body2">
                                        Booking will open on{" "}
                                        {format(eventData.registration_start_date, "dd MMM yyyy hh:mm A")}
                                    </Typography>
                                </Alert>
                            )}
                        </Box>
                    </Box>
                </Card>
            </Grid>
        );
    }, [eventData]);

    const RenderSingleEvent = useMemo(() => {
        return (
            <SingleEventForm
                formData={formData}
                setFormData={setFormData}
                setNonVerifiedMembers={setNonVerifiedMembers}
                nonVerifiedMembers={nonVerifiedMembers}
                verifiedMembers={verifiedMembers}
                setVerifiedMembers={setVerifiedMembers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setTotalAmountToPay={setTotalAmountToPay}
                totalAmountToPay={totalAmountToPay}
                showPayButton={showPayButton}
                setShowPayButton={setShowPayButton}
            />
        );
    }, [formData, nonVerifiedMembers, verifiedMembers, selectedCategory, showPayButton, totalAmountToPay]);

    const RenderDoubleEvent = useMemo(() => {
        return (
            <DoubleEventForm
                formData={formData}
                setFormData={setFormData}
                setNonVerifiedMembers={setNonVerifiedMembers}
                nonVerifiedMembers={nonVerifiedMembers}
                verifiedMembers={verifiedMembers}
                setVerifiedMembers={setVerifiedMembers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setTotalAmountToPay={setTotalAmountToPay}
                totalAmountToPay={totalAmountToPay}
                showPayButton={showPayButton}
                setShowPayButton={setShowPayButton}
            />
        );
    }, [formData, nonVerifiedMembers, verifiedMembers, selectedCategory, showPayButton, totalAmountToPay]);

    const RenderTeamEvent = useMemo(() => {
        return (
            <TeamEventForm
                eventData={eventData}
                formData={formData}
                setFormData={setFormData}
                setNonVerifiedMembers={setNonVerifiedMembers}
                nonVerifiedMembers={nonVerifiedMembers}
                verifiedMembers={verifiedMembers}
                setVerifiedMembers={setVerifiedMembers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setTotalAmountToPay={setTotalAmountToPay}
                totalAmountToPay={totalAmountToPay}
                showPayButton={showPayButton}
                setShowPayButton={setShowPayButton}
                disabled={disabled}
            />
        );
    }, [eventData, formData, nonVerifiedMembers, verifiedMembers, selectedCategory, showPayButton, totalAmountToPay]);

    const renderCategories = useMemo(() => {
        if (!showPayButton) return null;
        return (
            <Grid item xs={12} md={12}>
                <EligibleCategories
                    data={eventData}
                    verifiedMembers={verifiedMembers}
                    nonVerifiedMembers={nonVerifiedMembers}
                    handleCategorySelect={(cat) => setSelectedCategory(cat)}
                    selectedCategory={selectedCategory}
                    disabled={disabled}
                />
            </Grid>
        );
    }, [eventData, verifiedMembers, nonVerifiedMembers, selectedCategory, showPayButton]);

    const renderSummary = useMemo(() => {
        if (!showPayButton) return null;
        return (
            <Grid item xs={12} md={12}>
                {selectedCategory && (
                    <Summary
                        eventData={eventData}
                        selectedCategory={selectedCategory}
                        calculateTotalAmount={calculateTotalAmount}
                        quantity={
                            [...verifiedMembers, ...nonVerifiedMembers].filter((member) => member !== null).length
                        }
                    />
                )}
            </Grid>
        );
    }, [eventData, selectedCategory, showPayButton, calculateTotalAmount]);

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
                                    {formType === "Add"
                                        ? "Create New Event Booking"
                                        : "Update Event Booking      "}{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <AutoCompleteServerSide
                                        label="Type & Select Event *"
                                        name="event_id"
                                        id="event_id"
                                        fullWidth
                                        fetchDataFunction={(d) => getEventsList(d)}
                                        onChange={(val) => {
                                            if (val) {
                                                setFieldValue("event_id", val);
                                                setEventData(val);
                                            } else {
                                                setFieldValue("event_id", null);
                                                setEventData(null);
                                            }
                                        }}
                                        defaultValue={eventData || null}
                                        error={Boolean(errors?.event_id)}
                                        helperText={errors?.event_id}
                                        isMultiple={true}
                                        disabled={disabled}
                                        apiParams={{ active: true }}
                                        keyname="event_name"
                                    />
                                </Grid>
                                {renderEventData}
                                {eventData?.event_type === "Single" && RenderSingleEvent}
                                {eventData?.event_type === "Double" && RenderDoubleEvent}
                                {eventData?.event_type === "Team" && RenderTeamEvent}
                                {renderCategories}
                                {renderSummary}
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
                                            loading={addBookingLoading || updateBookingLoading}
                                            onClick={() => handleSubmit()}
                                            disabled={!selectedCategory}
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
