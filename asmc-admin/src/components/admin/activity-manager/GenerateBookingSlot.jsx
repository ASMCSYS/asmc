import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { ActivityValidation } from "./ActivityValidation";
import { Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import { useUpdateActivityMutation } from "../../../store/activity/activityApis";
import SlotAddModal from "./SlotAddModal";
import Switch from '@mui/material/Switch';
import AutoCompleteSelect from "../../Common/AutoCompleteSelect";
import { useGetActivePlansListQuery } from "../../../store/plans/plansApis";


export const GenerateBookingSlot = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [updateActivity, { isLoading: updateActivityLoading }] = useUpdateActivityMutation();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { data: plansData } = useGetActivePlansListQuery({ plan_type: "batch" });

    const [bookingPrice, setBookingPrice] = useState({
        members_price: 0,
        non_members_price: 0,
        ac_members_price: 0,
        ac_non_member_price: 0
    });

    const [bookSlotData, setBookSlotData] = useState([]);

    useEffect(() => {
        setSelectedPlan(initialValues?.batch_booking_plan || null);

        if (initialValues?.book_time_slots && initialValues?.book_time_slots.length > 0)
            setBookSlotData(initialValues?.book_time_slots);
        else
            setBookSlotData([
                { "day": "Mon", "time_slots": [] },
                { "day": "Tue", "time_slots": [] },
                { "day": "Wed", "time_slots": [] },
                { "day": "Thu", "time_slots": [] },
                { "day": "Fri", "time_slots": [] },
                { "day": "Sat", "time_slots": [] },
                { "day": "Sun", "time_slots": [] },
            ]);

        if (initialValues?.slot_booking_price)
            setBookingPrice(initialValues?.slot_booking_price);
    }, [initialValues.batch_booking_plan, initialValues.slot_booking_price, initialValues.book_time_slots])

    const onFormSubmit = async (values) => {
        try {
            let payload = { ...values, book_time_slots: bookSlotData, slot_booking_price: bookingPrice, batch_booking_plan: selectedPlan };
            delete payload.facility_data;
            delete payload.updatedAt;
            delete payload.activity_id;
            delete payload.time_slots;

            await updateActivity(payload).unwrap();
            dispatch(setSnackBar({
                open: true,
                message: "Slot generated successfully",
                severity: "success",
            }))
            close();
            setBookSlotData([
                { "day": "Mon", "time_slots": [] },
                { "day": "Tue", "time_slots": [] },
                { "day": "Wed", "time_slots": [] },
                { "day": "Thu", "time_slots": [] },
                { "day": "Fri", "time_slots": [] },
                { "day": "Sat", "time_slots": [] },
                { "day": "Sun", "time_slots": [] },
            ]);
        } catch (error) {
            dispatch(setSnackBar({
                open: true,
                message: error?.data?.message || error.message,
                severity: "error",
            }))
        }
    };

    const setBookingMembersPrice = (field, e) => {
        setBookingPrice({ ...bookingPrice, [field]: e.target.value });
    }

    return (
        <Drawer
            anchor={"right"}
            open={show}
            PaperProps={{
                sx: { width: { xs: '100%', md: '70%', sm: "70%", lg: "70%" } },
            }}
            onClose={() => close()}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onFormSubmit(values)}
                validationSchema={ActivityValidation}
                enableReinitialize
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    setFieldValue
                }) => (
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"} >
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons color="default" title="Close" IconComponent={CloseIcon} onClick={() => close()} />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">Map booking batch</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id='name'
                                        name="name"
                                        label="Name of activity *"
                                        onChange={handleChange("name")}
                                        value={values?.name || ""}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        fullWidth
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <AutoCompleteSelect
                                        id="plan_select-autocomplete"
                                        options={plansData || []}
                                        label="Select Plan"
                                        onChange={(e, val) => setSelectedPlan(val)}
                                        value={selectedPlan}
                                    />
                                </Grid>
                                {
                                    selectedPlan && (
                                        <Fragment>
                                            <Grid item xs={12} md={3}>
                                                <Input
                                                    id='members_price'
                                                    name="members_price"
                                                    label="Member Price"
                                                    onChange={(val) => setBookingMembersPrice("members_price", val)}
                                                    value={bookingPrice?.members_price || 0}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Input
                                                    id='non_members_price'
                                                    name="non_members_price"
                                                    label="Non Member Price"
                                                    onChange={(val) => setBookingMembersPrice("non_members_price", val)}
                                                    value={bookingPrice?.non_members_price || 0}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Input
                                                    id='ac_members_price'
                                                    name="ac_members_price"
                                                    label="AC Member Price"
                                                    onChange={(val) => setBookingMembersPrice("ac_members_price", val)}
                                                    value={bookingPrice?.ac_members_price || 0}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Input
                                                    id='ac_non_member_price'
                                                    name="ac_non_member_price"
                                                    label="AC Non Member Price"
                                                    onChange={(val) => setBookingMembersPrice("ac_non_member_price", val)}
                                                    value={bookingPrice?.ac_non_member_price || 0}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Input
                                                    id='vacancies'
                                                    name="vacancies"
                                                    label="No of vacancies"
                                                    onChange={handleChange("vacancies")}
                                                    value={values?.vacancies || 0}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Fragment>
                                    )
                                }
                            </Grid>
                        </Grid>
                        {
                            formType !== 'View'
                                ?
                                <Grid flexShrink={0} borderTop={1} borderColor={"rgba(152, 188, 252, 0.16)"} sx={{ padding: "8px 16px" }}>
                                    <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Button size="large" color="warning" type="button" onClick={() => close()}>Cancel</Button>
                                            <Button size="large" type="submit" loading={updateActivityLoading} onClick={() => handleSubmit()}>Save</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                :
                                null
                        }

                    </Grid>
                )
                }
            </Formik >
        </Drawer>
    )
}