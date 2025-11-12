import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { HallsValidation } from "./HallsValidation";
import { Drawer, FormControl, FormHelperText, Grid, InputLabel, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import Input from "../../Common/Input";
import RichTextEditor from "../../Common/editor/RichTextEditor";
import StyledTextarea from "../../Common/StyledTextarea";
import { useGetParentLocationListQuery } from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";
import DateTimePickerComponent from "../../Common/DateTimePickerComponent";
import { useAddNewHallMutation, useUpdateHallMutation } from "../../../store/halls/hallsApis";
import { MultipleFileUploadToServer } from "../../Common/MultipleFileUploadToServer";
import TimeSlotAddModal from "../../Common/TimeSlotAddModal";

export const HallsAddDrawer = ({ initialValues, show, close, formType, getActiveLocationList }) => {
    const dispatch = useDispatch();
    const disabled = formType === "View" ? true : false;
    const [subLocation, setSubLocation] = useState(null);
    const [timeSlotArray, setTimeSlotArray] = useState([{ from: false, to: false }]);

    const [addNewHalls, { isLoading: addHallsLoading }] = useAddNewHallMutation();
    const [updateHalls, { isLoading: updateHallsLoading }] = useUpdateHallMutation();

    const { data: locationData } = useGetParentLocationListQuery({}, { skip: !show });

    const fetchSubLocation = async (val) => {
        const res = await getActiveLocationList({ parent_id: val, active: true, limit: 1000000 });
        const filterData = res?.data.map((item) => ({ value: item._id, label: item.title }));
        setSubLocation(filterData || []);
    };

    useEffect(() => {
        if (initialValues?.location_data) {
            fetchSubLocation(initialValues?.location_data?._id);
        }
        if (initialValues?.time_slots) {
            setTimeSlotArray(initialValues?.time_slots);
        }
    }, [initialValues]);

    const onFormSubmit = async (values) => {
        try {
            let payload = {
                ...values,
                time_slots: timeSlotArray,
            };
            if (formType === "Edit") {
                payload._id = initialValues._id;
                delete payload.location_data;
                delete payload.sublocation_data;
                await updateHalls(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Halls updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewHalls(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Halls created successfully",
                        severity: "success",
                    }),
                );
            }
            close();
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
    return (
        <Drawer
            anchor={"right"}
            open={show}
            PaperProps={{
                sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
            }}
            onClose={() => close()}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onFormSubmit(values)}
                validationSchema={HallsValidation}
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
                                    onClick={() => close()}
                                />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">{formType} Halls</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            {console.log(errors, "errors")}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <MultipleFileUploadToServer
                                        name="images"
                                        onChange={(val) => setFieldValue("images", val)}
                                        value={values?.images || []}
                                        label="Hall Banners (800 X 800 in pixels)"
                                        error={Boolean(errors.images)}
                                        helperText={errors.images}
                                        disabled={disabled}
                                        multiple={true}
                                        width={800}
                                        height={800}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="name"
                                        name="name"
                                        label="Hall Name *"
                                        onChange={handleChange("name")}
                                        value={values?.name || ""}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.location_id || ""}
                                        onChange={(e) => [
                                            setFieldValue("location_id", e.target.value),
                                            fetchSubLocation(e.target.value),
                                        ]}
                                        displayEmpty
                                        label="Select Location*"
                                        name="location_id"
                                        id="location_id"
                                        items={locationData || []}
                                        disabled={disabled}
                                        error={Boolean(errors?.location_id)}
                                        helperText={errors?.location_id}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.sublocation_id || ""}
                                        onChange={(e) => [setFieldValue("sublocation_id", e.target.value)]}
                                        displayEmpty
                                        label="Select Sub Location"
                                        name="sublocation_id"
                                        id="sublocation_id"
                                        items={subLocation || []}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.court || "Any"}
                                        onChange={handleChange("court")}
                                        displayEmpty
                                        label="Select Court"
                                        name="court"
                                        id="court"
                                        items={[
                                            {
                                                value: "Any",
                                                label: "Any",
                                            },
                                            {
                                                value: "Court A",
                                                label: "Court A",
                                            },
                                            {
                                                value: "Court B",
                                                label: "Court B",
                                            },
                                            {
                                                value: "Court C",
                                                label: "Court C",
                                            },
                                            {
                                                value: "Court A & B",
                                                label: "Court A & B",
                                            },
                                        ]}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <StyledTextarea
                                        id="description"
                                        name="description"
                                        label="Description *"
                                        onChange={handleChange("description")}
                                        value={values?.description || ""}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                        fullWidth
                                        disabled={disabled}
                                        minRows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth error={Boolean(errors.text_content)}>
                                        <InputLabel size={"small"}>Content</InputLabel>
                                        <br />
                                        <br />
                                        <RichTextEditor
                                            placeholder="Contents"
                                            class="h-20"
                                            setValue={(d) => setFieldValue("text_content", d)}
                                            defaultValue={values?.text_content || ""}
                                        />
                                        {Boolean(errors.text_content) ? (
                                            <FormHelperText>{errors.text_content}</FormHelperText>
                                        ) : null}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth error={Boolean(errors.terms)}>
                                        <InputLabel size={"small"}>Cancellation & Other Terms</InputLabel>
                                        <br />
                                        <br />
                                        <RichTextEditor
                                            placeholder="Cancellation & Other Terms"
                                            class="h-20"
                                            setValue={(d) => setFieldValue("terms", d)}
                                            defaultValue={values?.terms || ""}
                                        />
                                        {Boolean(errors.terms) ? <FormHelperText>{errors.terms}</FormHelperText> : null}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        type="number"
                                        id="advance_booking_period"
                                        name="advance_booking_period"
                                        label="Advance Booking Period (Days) *"
                                        onChange={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("advance_booking_period", e.target.value);
                                        }}
                                        value={values?.advance_booking_period || ""}
                                        error={Boolean(errors.advance_booking_period)}
                                        helperText={errors.advance_booking_period}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Input
                                        type="number"
                                        id="booking_amount"
                                        name="booking_amount"
                                        label="Booking Amount *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("booking_amount", e.target.value);
                                        }}
                                        value={values?.booking_amount || ""}
                                        error={Boolean(errors.booking_amount)}
                                        helperText={errors.booking_amount}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Input
                                        type="number"
                                        id="refundable_deposit"
                                        name="refundable_deposit"
                                        label="Refundable Deposit *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("refundable_deposit", e.target.value);
                                        }}
                                        value={values?.refundable_deposit || ""}
                                        error={Boolean(errors.refundable_deposit)}
                                        helperText={errors.refundable_deposit}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Input
                                        type="number"
                                        id="advance_payment_amount"
                                        name="advance_payment_amount"
                                        label="Advance Payment Amount *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("advance_payment_amount", e.target.value);
                                        }}
                                        value={values?.advance_payment_amount || ""}
                                        error={Boolean(errors.advance_payment_amount)}
                                        helperText={errors.advance_payment_amount}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Input
                                        type="number"
                                        id="cleaning_charges"
                                        name="cleaning_charges"
                                        label="Cleaning Charges *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("cleaning_charges", e.target.value);
                                        }}
                                        value={values?.cleaning_charges || ""}
                                        error={Boolean(errors.cleaning_charges)}
                                        helperText={errors.cleaning_charges}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Input
                                        type="number"
                                        id="additional_charges"
                                        name="additional_charges"
                                        label="Additional Charges (Per Hour) *"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("additional_charges", e.target.value);
                                        }}
                                        value={values?.additional_charges || ""}
                                        error={Boolean(errors.additional_charges)}
                                        helperText={errors.additional_charges}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Input
                                        type="number"
                                        id="other_charges"
                                        name="other_charges"
                                        label="Other Charges (If Any)"
                                        onChange={(e) => {
                                            // validate number is no minus
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue("other_charges", e.target.value);
                                        }}
                                        value={values?.other_charges || ""}
                                        error={Boolean(errors.other_charges)}
                                        helperText={errors.other_charges}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TimeSlotAddModal
                                        timeSlotArray={timeSlotArray}
                                        setTimeSlotArray={setTimeSlotArray}
                                    />
                                </Grid>
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
                                            loading={addHallsLoading || updateHallsLoading}
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
