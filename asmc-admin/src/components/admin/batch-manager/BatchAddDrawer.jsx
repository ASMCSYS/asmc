import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { BatchValidation } from "./BatchValidation";
import {
    Box,
    Card,
    CardContent,
    Drawer,
    FormControlLabel,
    FormHelperText,
    Grid,
    Switch,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewBatchMutation, useUpdateBatchMutation } from "../../../store/masters/mastersApis";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import BasicSelect from "../../Common/Select";
import { generateBatchName } from "../../../helpers/utils";
import { daysArray } from "../../../helpers/constants";
import AutoCompleteSelect from "../../Common/AutoCompleteSelect";
import TimePickerComponent from "../../Common/TimePicker";
import { FeesAddModal } from "../activity-manager/FeesAddModal";
import CommonModal from "../../Common/CommonModal";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { format } from "date-fns";
import SlotAddModal from "../activity-manager/SlotAddModal";

const initialFeesData = {
    plan_id: "",
    plan_name: "",
    plan_type: "",
    member_price: "",
    dependent_member_price: "",
    non_member_price: "",
    member_price_with_ac: "",
    non_member_price_with_ac: "",
    end_month: "",
    start_month: "",
    plan_timeline: "",
    batch_hours: "",
};

export const BatchAddDrawer = ({ initialValues, show, close, formType, getActivityList, getActiveLocationList }) => {
    const dispatch = useDispatch();
    const [addNewBatch, { isLoading: addBatchLoading }] = useAddNewBatchMutation();
    const [updateBatch, { isLoading: updateBatchLoading }] = useUpdateBatchMutation();

    const [isLoading, setIsLoading] = useState(true);

    const [subLocation, setSubLocation] = useState(null);

    const [selectedActivity, setSelectedActivity] = useState(null);
    const disabled = formType === "View" ? true : false;

    const [slotData, setSlotData] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [feesInitalval, setFeesInitalval] = useState(initialFeesData);
    const [feesEditKey, setFeesEditKey] = useState(false);
    const [feesData, setFeesData] = useState([]);

    const handleClose = () => {
        setSelectedActivity(null);
        close();
    };

    useEffect(() => {
        setIsLoading(true);

        if (initialValues?.slots && initialValues?.slots.length > 0) setSlotData(initialValues?.slots);
        else
            setSlotData([
                { day: "Mon", time_slots: [] },
                { day: "Tue", time_slots: [] },
                { day: "Wed", time_slots: [] },
                { day: "Thu", time_slots: [] },
                { day: "Fri", time_slots: [] },
                { day: "Sat", time_slots: [] },
                { day: "Sun", time_slots: [] },
            ]);

        if (initialValues?.activity_data) {
            setSelectedActivity((prev) => ({ ...prev, ...initialValues?.activity_data }));
        }

        if (initialValues?.sublocation_id) fetchSubLocation(initialValues?.location_id);

        if (initialValues?.fees) setFeesData(initialValues?.fees || []);
        setIsLoading(false);
    }, [initialValues]);

    const handleFetchActivity = async (val) => {
        const res = await getActivityList(val);
        const filteringData = res?.data?.result.map((item) => ({
            _id: item._id,
            name: item.name,
            category: item.category,
            location: item.location,
        }));
        return { data: { result: filteringData } };
    };

    const fetchSubLocation = async (val) => {
        const res = await getActiveLocationList({ parent_id: val, active: true, limit: 1000000 });
        const filterData = res?.data.map((item) => ({ value: item._id, label: item.title }));
        setSubLocation(filterData || []);
    };

    const handleActivityChange = (setFieldValue, val) => {
        if (val) {
            setFieldValue("activity_id", val?._id);
            setSelectedActivity(val);
        }
    };

    const batchNameGenerator = (code, setFieldValue) => {
        if (code && selectedActivity) {
            let generated = generateBatchName(selectedActivity.name, code);
            setFieldValue("batch_name", generated);
        }
    };

    const onFormSubmit = async (values, action) => {
        try {
            let payload = {
                batch_code: values?.batch_code,
                batch_name: values?.batch_name,
                batch_type: values?.batch_type,
                batch_limit: values?.batch_limit,
                no_of_player: values?.no_of_player,
                days: values?.days,
                days_prices: values?.days_prices,
                member_days_prices: values?.member_days_prices,
                start_time: values?.start_time,
                end_time: values?.end_time,
                type: values?.type,
                status: values?.status,
                sublocation_id: values?.sublocation_id,
                category_id: values?.category_id,
                location_id: values?.location_id,
                subcategory_name: values?.subcategory_name,
                court: values?.court || "",
                activity_id: selectedActivity?._id,
                advance_booking_period: values?.advance_booking_period,
                fees: feesData,
                slots: slotData,
            };

            // console.log(payload, "payload");
            // return false;

            if (formType === "Edit") {
                payload._id = initialValues?._id;
                await updateBatch(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Batch updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewBatch(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Batch created successfully",
                        severity: "success",
                    }),
                );
            }
            close();
            setSelectedActivity(null);
            setFeesData([]);
            setFeesInitalval(initialFeesData);
            action.resetForm();
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

    const handleAddFees = () => {
        setShowModal(true);
    };

    const handleDeleteFees = (data, key) => {
        let oldData = JSON.parse(JSON.stringify(feesData));
        oldData.splice(key, 1);
        setFeesData(oldData);
        setFeesInitalval(initialFeesData);
    };

    const handleEditFees = (data, key) => {
        setFeesEditKey(key);
        setFeesInitalval(data);
        setShowModal(true);
    };

    const FeesComponent = ({ type }) => {
        const onFeesSubmit = (val) => {
            let oldData = JSON.parse(JSON.stringify(feesData));

            if (feesEditKey !== false) {
                oldData[feesEditKey] = val;
            } else {
                oldData.push(val);
            }
            setFeesData(oldData);
            setFeesInitalval(initialFeesData);
            setFeesEditKey(false);
            setShowModal(false);
        };

        return <FeesAddModal feesInitalval={feesInitalval} submit={onFeesSubmit} type={type} />;
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{ ...initialValues }}
            // onSubmit={(values) => onFormSubmit(values)}
            onSubmit={(values, action) => {
                // Handle form submission
                onFormSubmit(values, action);
            }}
            validationSchema={BatchValidation}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                <Drawer
                    anchor={"right"}
                    open={show}
                    PaperProps={{
                        sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
                    }}
                    onClose={() => handleClose()}
                >
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                        <Grid
                            container
                            flex={0}
                            px={1}
                            py={1}
                            borderBottom={1}
                            justifyContent={"space-between"}
                            borderColor={"rgba(5, 5, 5, 0.06)"}
                        >
                            <Grid item display={"flex"}>
                                <Grid item alignSelf={"center"}>
                                    <IconButtonIcons
                                        color="default"
                                        title="Close"
                                        IconComponent={CloseIcon}
                                        onClick={() => handleClose()}
                                    />
                                </Grid>
                                <Grid item alignSelf={"center"}>
                                    <Typography variant="h6">{formType} Batch</Typography>
                                </Grid>
                            </Grid>
                            <Grid item alignSelf={"flex-end"}>
                                <FormControlLabel
                                    disabled={disabled}
                                    control={<Switch checked={values?.status || false} />}
                                    label="Active"
                                    onChange={(e) => setFieldValue("status", e.target.checked)}
                                />
                            </Grid>
                        </Grid>
                        {isLoading ? (
                            <></>
                        ) : (
                            <Grid flex={1} px={2} py={5} overflow={"auto"}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <AutoCompleteServerSide
                                            label="Type & Select Activity *"
                                            name="activity_id"
                                            id="activity_id"
                                            fullWidth
                                            fetchDataFunction={(d) => handleFetchActivity(d)}
                                            onChange={(val) => handleActivityChange(setFieldValue, val)}
                                            defaultValue={selectedActivity || null}
                                            error={Boolean(errors.activity_id)}
                                            helperText={errors.activity_id}
                                            isMultiple={true}
                                            disabled={disabled}
                                            apiParams={{ active: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.type || "enrollment"}
                                            onChange={handleChange("type")}
                                            displayEmpty
                                            label="Select Type*"
                                            name="type"
                                            id="type"
                                            items={[
                                                {
                                                    value: "enrollment",
                                                    label: "Enrollment (Only admin can enroll members to this batch)",
                                                },
                                                {
                                                    value: "booking",
                                                    label: "Booking (Member and admin can book for this batch)",
                                                },
                                            ]}
                                            disabled={disabled}
                                            error={Boolean(errors?.type)}
                                            helperText={errors?.type}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="batch_type"
                                            name="batch_type"
                                            label="Batch Type *"
                                            onChange={handleChange("batch_type")}
                                            value={values?.batch_type || ""}
                                            error={Boolean(errors.batch_type)}
                                            helperText={errors.batch_type}
                                            fullWidth
                                            disabled={disabled}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="batch_code"
                                            name="batch_code"
                                            label="Batch Code *"
                                            onChange={(e) => [
                                                setFieldValue("batch_code", e.target.value),
                                                batchNameGenerator(e.target.value, setFieldValue),
                                            ]}
                                            value={values?.batch_code || ""}
                                            error={Boolean(errors.batch_code)}
                                            helperText={errors.batch_code}
                                            fullWidth
                                            disabled={disabled}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="batch_name"
                                            name="batch_name"
                                            label="Batch Name *"
                                            onChange={handleChange("batch_name")}
                                            value={values?.batch_name || ""}
                                            error={Boolean(errors.batch_name)}
                                            helperText={errors.batch_name}
                                            fullWidth
                                            disabled={disabled}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="batch_limit"
                                            name="batch_limit"
                                            label="Batch Limit *"
                                            onChange={handleChange("batch_limit")}
                                            value={values?.batch_limit || ""}
                                            error={Boolean(errors.batch_limit)}
                                            helperText={errors.batch_limit}
                                            fullWidth
                                            disabled={disabled}
                                        />
                                        {values?.type === "booking" && (
                                            <FormHelperText>
                                                Based on the days selected the batch will be created (Number of days *
                                                Batch Limit)
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    {values?.type === "booking" && (
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="no_of_player"
                                                name="no_of_player"
                                                label="Number of Player"
                                                onChange={handleChange("no_of_player")}
                                                value={values?.no_of_player || ""}
                                                error={Boolean(errors.no_of_player)}
                                                helperText={errors.no_of_player}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12} md={6}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.category_id || ""}
                                            onChange={handleChange("category_id")}
                                            displayEmpty
                                            label="Select Category*"
                                            name="category_id"
                                            id="category_id"
                                            items={selectedActivity?.category || []}
                                            disabled={disabled}
                                            error={Boolean(errors?.category_id)}
                                            helperText={errors?.category_id}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="subcategory_name"
                                            name="subcategory_name"
                                            label="Sub Category Name"
                                            onChange={handleChange("subcategory_name")}
                                            value={values?.subcategory_name || ""}
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
                                            items={selectedActivity?.location || []}
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
                                    {values?.type === "enrollment" && (
                                        <Grid item xs={12} md={6}>
                                            <AutoCompleteSelect
                                                multiple={true}
                                                id="days-select-autocomplete"
                                                options={daysArray || []}
                                                label="Select Days"
                                                onChange={(e, val) => setFieldValue("days", val)}
                                                value={values?.days || []}
                                                error={Boolean(errors.days)}
                                                helperText={errors.days}
                                                name="days"
                                                keyname="label"
                                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                            />
                                        </Grid>
                                    )}

                                    {values?.type === "booking" ? (
                                        <Fragment>
                                            <Grid item xs={12} md={6}>
                                                <Input
                                                    id="advance_booking_period"
                                                    name="advance_booking_period"
                                                    label="Advance Booking Period (Days)"
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        setFieldValue(
                                                            "advance_booking_period",
                                                            isNaN(value) || value < 0 ? null : value,
                                                        );
                                                    }}
                                                    value={values?.advance_booking_period || ""}
                                                    fullWidth
                                                    disabled={disabled}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                display={"flex"}
                                                gap={2}
                                                flexDirection={"row"}
                                                alignItems={"center"}
                                            >
                                                <Typography variant="h6">Slots Data:</Typography>
                                            </Grid>
                                            <SlotAddModal
                                                timeSlotArray={slotData}
                                                setTimeSlotArray={setSlotData}
                                                disabled={disabled}
                                            />
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                display={"flex"}
                                                gap={2}
                                                flexDirection={"row"}
                                                alignItems={"center"}
                                            >
                                                <Typography variant="h6">Batch Plans:</Typography>
                                            </Grid>
                                            {feesData && feesData.length === 0 && (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={12}
                                                    display={"flex"}
                                                    gap={2}
                                                    flexDirection={"row"}
                                                    alignItems={"center"}
                                                >
                                                    <Button
                                                        size="large"
                                                        fullWidth={false}
                                                        onClick={() => handleAddFees()}
                                                    >
                                                        Map Fees
                                                        <Add />
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Grid item xs={6} md={6}>
                                                <TimePickerComponent
                                                    label="Start Time"
                                                    onChange={(e) => setFieldValue("start_time", e)}
                                                    value={values?.start_time ? new Date(values?.start_time) : null}
                                                    name="start_time"
                                                    keyname="Time"
                                                    id={`time-select-1`}
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    variant="outlined"
                                                    disabled={disabled}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <TimePickerComponent
                                                    label="End Time"
                                                    onChange={(e) => setFieldValue("end_time", e)}
                                                    value={values?.end_time ? new Date(values?.end_time) : null}
                                                    name="end_time"
                                                    keyname="Time"
                                                    id={`time-select-2`}
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    variant="outlined"
                                                    disabled={disabled}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                display={"flex"}
                                                gap={2}
                                                flexDirection={"row"}
                                                alignItems={"center"}
                                            >
                                                <Typography variant="h6">Batch Plans:</Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                display={"flex"}
                                                gap={2}
                                                flexDirection={"row"}
                                                alignItems={"center"}
                                            >
                                                <Button size="large" fullWidth={false} onClick={() => handleAddFees()}>
                                                    Map Fees
                                                    <Add />
                                                </Button>
                                            </Grid>
                                        </Fragment>
                                    )}

                                    {feesData && feesData.length > 0 ? (
                                        <Fragment>
                                            <Grid item xs={12} md={12}>
                                                <Grid container spacing={2}>
                                                    {feesData.map((obj, key) => {
                                                        return (
                                                            <Grid item xs={4} key={key}>
                                                                <Card variant="outlined" sx={{ position: "relative" }}>
                                                                    <CardContent>
                                                                        <Typography
                                                                            variant="h6"
                                                                            component="div"
                                                                            style={{ width: "70%" }}
                                                                        >
                                                                            {obj.plan_name}
                                                                        </Typography>
                                                                        <Typography
                                                                            sx={{ mb: 1.5 }}
                                                                            color="text.secondary"
                                                                        >
                                                                            Plan Id: {obj?.plan_id}
                                                                        </Typography>
                                                                        {values?.type === "enrollment" && (
                                                                            <Typography variant="body2">
                                                                                Member Price: {obj?.member_price} Rs.{" "}
                                                                                <br />
                                                                                Non Member Price:{" "}
                                                                                {obj?.non_member_price || 0} Rs. <br />
                                                                                Member Price (AC):{" "}
                                                                                {obj?.member_price_with_ac ||
                                                                                    0} Rs. <br />
                                                                                Non Member Price (AC):{" "}
                                                                                {obj?.non_member_price_with_ac ||
                                                                                    0} Rs. <br />
                                                                            </Typography>
                                                                        )}

                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            sx={{ mt: 1.5, fontWeight: "bold" }}
                                                                        >
                                                                            Plan Assigned On:{" "}
                                                                            {obj?.createdAt &&
                                                                                format(
                                                                                    new Date(obj?.createdAt),
                                                                                    "dd-MM-yyyy hh:mm:ss a",
                                                                                )}
                                                                        </Typography>

                                                                        <Box
                                                                            sx={{
                                                                                position: "absolute",
                                                                                right: 0,
                                                                                top: 0,
                                                                            }}
                                                                        >
                                                                            <IconButtonIcons
                                                                                disabled={disabled}
                                                                                color="info"
                                                                                title="Edit"
                                                                                IconComponent={EditOutlined}
                                                                                onClick={() => handleEditFees(obj, key)}
                                                                            />
                                                                            <IconButtonIcons
                                                                                disabled={disabled}
                                                                                color="error"
                                                                                title="Delete"
                                                                                IconComponent={DeleteOutline}
                                                                                onClick={() =>
                                                                                    handleDeleteFees(obj, key)
                                                                                }
                                                                            />
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Grid>
                                        </Fragment>
                                    ) : null}
                                </Grid>
                            </Grid>
                        )}
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
                                            loading={addBatchLoading || updateBatchLoading}
                                            onClick={() => handleSubmit()}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                        <CommonModal
                            show={showModal}
                            close={() => setShowModal(false)}
                            title="Add Fees"
                            child_component={<FeesComponent type={values?.type} />}
                        />
                    </Grid>
                </Drawer>
            )}
        </Formik>
    );
};
