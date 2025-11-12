import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { EnrollActivityValidation } from "./EnrollActivityValidation";
import {
    Box,
    Checkbox,
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
import { useAddNewBookingMutation, useUpdateBookingMutation } from "../../../store/booking/bookingApis";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import { calculateAge, getMonthNameByNumber } from "../../../helpers/utils";
import { format, formatISO, parseISO } from "date-fns";

export const EnrollActivityAddDrawer = ({
    initialValues,
    show,
    close,
    formType,
    getActivityList,
    getMembersList,
    type = "enrollment",
}) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [activityData, setActivityData] = useState(null);

    const [addNewBooking, { isLoading: addBookingLoading }] = useAddNewBookingMutation();
    const [updateBooking, { isLoading: updateBookingLoading }] = useUpdateBookingMutation();

    const disabled = formType === "View" ? true : false;

    const fetchActivityData = async (activityId) => {
        if (!activityId) return;
        let payload = {
            activity_id: activityId,
        };
        const activeRes = await getActivityList(payload);
        if (activeRes && activeRes?.data && activeRes?.data?.result && activeRes?.data?.result.length > 0) {
            setActivityData(activeRes?.data?.result[0]);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (formType === "View" || formType === "Edit") {
            setSelectedPlan(initialValues?.fees_breakup || null);
            setSelectedFamily(
                initialValues?.family_member && initialValues?.family_member.length > 0
                    ? initialValues?.family_member[0]
                    : null,
            );
            setTotalAmount(initialValues?.total_amount || 0);
            setSelectedBatchId(initialValues?.batch);
            setSelectedBatch(initialValues?.batch_data?.length > 0 ? initialValues?.batch_data[0] : null);
            fetchActivityData(initialValues?.activity_id?.activity_id);
        } else {
            setSelectedPlan(null);
            setSelectedFamily(null);
            setTotalAmount(0);
            setSelectedBatch(null);
            setSelectedBatchId(null);
            setLoading(false);
        }
    }, [initialValues, formType]);

    const onFormSubmit = async (values) => {
        try {
            if (!values?.primary_eligible && !selectedFamily) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Please select atleast one member",
                        severity: "error",
                    }),
                );
            } else {
                let payload = {
                    activity_id: values?.activity_id?._id,
                    member_id: values?.member_id?._id,
                    primary_eligible: values?.primary_eligible,
                    family_member: [selectedFamily],
                    fees_breakup: selectedPlan,
                    total_amount: totalAmount,
                    batch: selectedBatchId,
                    type: type,
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
            }
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

    const handleMemberSelect = (checked, setFieldValue, memberData) => {
        if (checked === "primary_eligible") {
            setFieldValue("primary_eligible", true);
            setTotalAmount(selectedPlan?.member_price || 0);
            setSelectedFamily(null);
        } else {
            const item = memberData.find((val) => checked === val._id);
            setFieldValue("primary_eligible", false);
            setSelectedFamily(item);
            if (item.is_dependent) {
                setTotalAmount(selectedPlan?.dependent_member_price);
            } else {
                setTotalAmount(selectedPlan?.non_member_price);
            }
        }
    };

    const handleClose = () => {
        setSelectedPlan(false);
        setTotalAmount(0);
        setSelectedFamily(null);
        setSelectedBatch(null);
        setActivityData(null);
        setSelectedBatchId(null);
        close();
    };

    console.log(activityData, "activityData");

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
                validationSchema={EnrollActivityValidation}
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
                                    {formType === "Add" ? "Enroll New Activity" : "Manage Enrolled Activity"}{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <AutoCompleteServerSide
                                        label="Type & Select Primary Member *"
                                        name="member_id"
                                        id="member_id"
                                        fullWidth
                                        fetchDataFunction={(d) => getMembersList(d)}
                                        onChange={(val) => setFieldValue("member_id", val)}
                                        defaultValue={values?.member_id || null}
                                        error={Boolean(errors.member_id)}
                                        helperText={errors.member_id}
                                        isMultiple={true}
                                        disabled={disabled}
                                        apiParams={{ active: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                                {activityData && activityData?.batch_data ? (
                                    <Fragment>
                                        <Grid item xs={12} md={12}>
                                            <Typography variant="h6">Select Batch:</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={2}>
                                                {formType === "View" && selectedBatchId ? (
                                                    activityData?.batch_data
                                                        .filter((val) => val._id === selectedBatchId)
                                                        .map((item) => (
                                                            <Grid item xs={3}>
                                                                <Button
                                                                    disabled={true}
                                                                    sx={{ textAlign: "center" }}
                                                                    color="success"
                                                                    variant={"contained"}
                                                                >
                                                                    <Box
                                                                        sx={{ maxWidth: "20rem" }}
                                                                        borderRadius={2}
                                                                        p={2}
                                                                    >
                                                                        <Typography variant="h6">
                                                                            {item?.batch_name}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            {item?.start_time &&
                                                                                format(
                                                                                    new Date(item?.start_time),
                                                                                    "hh:mm a",
                                                                                )}{" "}
                                                                            -{" "}
                                                                            {item?.end_time &&
                                                                                format(
                                                                                    new Date(item?.end_time),
                                                                                    "hh:mm a",
                                                                                )}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            {item?.days
                                                                                .map((day) => day.label.charAt(0))
                                                                                .join("-")}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            {item?.category_data?.title +
                                                                                " - " +
                                                                                item?.subcategory_name}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            @{" "}
                                                                            {item?.location_data?.title +
                                                                                " - " +
                                                                                item?.sublocation_data?.title}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            Available Batch Limit: {item?.batch_limit}
                                                                        </Typography>
                                                                    </Box>
                                                                </Button>
                                                            </Grid>
                                                        ))
                                                ) : activityData?.batch_data.length > 0 ? (
                                                    activityData?.batch_data.map((obj, key) => {
                                                        if (obj.type === "batch" || !obj.status) return null;
                                                        if (obj.type !== type) return null;
                                                        return (
                                                            <Grid item xs={3} key={key}>
                                                                <Button
                                                                    disabled={
                                                                        parseInt(obj?.batch_limit) <= 0 || disabled
                                                                    }
                                                                    sx={{ textAlign: "center" }}
                                                                    color="success"
                                                                    variant={
                                                                        selectedBatchId === obj?._id
                                                                            ? "contained"
                                                                            : "outlined"
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedBatch(obj);
                                                                        setSelectedBatchId(obj?._id);
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{ maxWidth: "20rem" }}
                                                                        borderRadius={2}
                                                                        p={2}
                                                                    >
                                                                        <Typography variant="h6">
                                                                            {obj?.batch_name}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            {format(
                                                                                new Date(obj?.start_time),
                                                                                "hh:mm a",
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {format(new Date(obj?.end_time), "hh:mm a")}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            {obj?.days
                                                                                .map((day) => day.label.charAt(0))
                                                                                .join("-")}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            {obj?.category_data?.title +
                                                                                " - " +
                                                                                obj?.subcategory_name}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            @{" "}
                                                                            {obj?.location_data?.title +
                                                                                " - " +
                                                                                obj?.sublocation_data?.title}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2">
                                                                            Available Batch Limit: {obj?.batch_limit}
                                                                        </Typography>
                                                                    </Box>
                                                                </Button>
                                                            </Grid>
                                                        );
                                                    })
                                                ) : (
                                                    <Typography variant="h6">No Batch Available</Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                ) : null}
                                {(selectedBatch?.fees && selectedBatch?.fees.length > 0) || selectedPlan ? (
                                    <Fragment>
                                        <Grid item xs={12} md={12}>
                                            <Typography variant="h6">Select Plan:</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={2}>
                                                {formType === "View" && selectedPlan ? (
                                                    <Grid item xs={4}>
                                                        <Button
                                                            disabled={true}
                                                            sx={{ textAlign: "left", height: "100%" }}
                                                            color="success"
                                                            variant={"contained"}
                                                        >
                                                            <Box
                                                                sx={{ maxWidth: "20rem", height: "100%" }}
                                                                borderRadius={2}
                                                                p={2}
                                                            >
                                                                <Typography variant="h6">
                                                                    {selectedPlan?.plan_name}
                                                                </Typography>
                                                                <Fragment>
                                                                    <Typography variant="subtitle2">
                                                                        Member Price: {selectedPlan?.member_price} Rs.
                                                                    </Typography>
                                                                    <Typography variant="subtitle2">
                                                                        Dependent Member Price:{" "}
                                                                        {selectedPlan?.dependent_member_price} Rs.
                                                                    </Typography>
                                                                    <Typography variant="subtitle2">
                                                                        Non Member Price:{" "}
                                                                        {selectedPlan?.non_member_price} Rs.
                                                                    </Typography>
                                                                    <Typography variant="subtitle2">
                                                                        Validity:{" "}
                                                                        {getMonthNameByNumber(
                                                                            selectedPlan?.start_month,
                                                                        )}{" "}
                                                                        - From{" "}
                                                                        {getMonthNameByNumber(selectedPlan?.end_month)}
                                                                    </Typography>
                                                                </Fragment>
                                                            </Box>
                                                        </Button>
                                                    </Grid>
                                                ) : (
                                                    selectedBatch &&
                                                    selectedBatch?.fees.map((obj, key) => {
                                                        return (
                                                            <Grid item xs={4} key={key}>
                                                                <Button
                                                                    disabled={disabled}
                                                                    sx={{ textAlign: "left", height: "100%" }}
                                                                    color="success"
                                                                    variant={
                                                                        selectedPlan?.plan_id === obj?.plan_id
                                                                            ? "contained"
                                                                            : "outlined"
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedPlan(obj);
                                                                        setTotalAmount(obj?.member_price);
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{ maxWidth: "20rem", height: "100%" }}
                                                                        borderRadius={2}
                                                                        p={2}
                                                                    >
                                                                        <Typography variant="h6">
                                                                            {obj?.plan_name}
                                                                        </Typography>
                                                                        <Fragment>
                                                                            <Typography variant="subtitle2">
                                                                                Member Price: {obj?.member_price} Rs.
                                                                            </Typography>
                                                                            <Typography variant="subtitle2">
                                                                                Dependent Member Price:{" "}
                                                                                {obj?.dependent_member_price} Rs.
                                                                            </Typography>
                                                                            <Typography variant="subtitle2">
                                                                                Non Member Price:{" "}
                                                                                {obj?.non_member_price} Rs.
                                                                            </Typography>
                                                                            <Typography variant="subtitle2">
                                                                                Validity:{" "}
                                                                                {getMonthNameByNumber(obj?.start_month)}{" "}
                                                                                - From{" "}
                                                                                {getMonthNameByNumber(obj?.end_month)}
                                                                            </Typography>
                                                                        </Fragment>
                                                                    </Box>
                                                                </Button>
                                                            </Grid>
                                                        );
                                                    })
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                ) : null}
                                {values?.member_id &&
                                selectedPlan &&
                                values?.member_id?.family_details &&
                                values?.member_id?.family_details.length > 0 ? (
                                    <Fragment>
                                        <Grid item xs={12} md={12}>
                                            <Typography variant="h6">Family Details / Secondary Member:</Typography>
                                            <Typography variant="caption">
                                                If age of any secondary member is below or 10, they will be considered
                                                as child.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <FormControl>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    name="radio-buttons-group"
                                                    defaultValue={
                                                        values?.primary_eligible
                                                            ? "primary_eligible"
                                                            : selectedFamily._id
                                                    }
                                                    onChange={(e) =>
                                                        handleMemberSelect(
                                                            e.target.value,
                                                            setFieldValue,
                                                            values?.member_id?.family_details,
                                                        )
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value={"primary_eligible"}
                                                        disabled={disabled}
                                                        control={<Radio />}
                                                        label={`${values?.member_id?.name} - (Primary)`}
                                                    />
                                                    {values?.member_id &&
                                                        values?.member_id?.family_details.map((obj, key) => {
                                                            return (
                                                                <FormControlLabel
                                                                    value={obj._id}
                                                                    disabled={disabled}
                                                                    control={<Radio />}
                                                                    label={`${obj.name} - ${calculateAge(
                                                                        new Date(obj.dob),
                                                                    )}`}
                                                                />
                                                            );
                                                        })}
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Fragment>
                                ) : null}
                                {selectedPlan ? (
                                    <Fragment>
                                        <Grid item xs={12} md={12}>
                                            <Typography variant="h6">Price Breakup:</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TableContainer component={Paper}>
                                                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Member Name</TableCell>
                                                            <TableCell align="right">Price</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {values?.primary_eligible ? (
                                                            <TableRow>
                                                                <TableCell>
                                                                    {values?.member_id?.name} (Primary)
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {selectedPlan?.member_price}
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : null}

                                                        {selectedFamily && (
                                                            <TableRow>
                                                                <TableCell>
                                                                    {selectedFamily?.name} (
                                                                    {selectedFamily?.is_dependent ? "Secondary" : "Kid"}
                                                                    )
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {selectedFamily?.is_dependent
                                                                        ? selectedPlan?.dependent_member_price
                                                                        : selectedPlan?.non_member_price}
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: "bold" }} align="right">
                                                                Total
                                                            </TableCell>
                                                            <TableCell sx={{ fontWeight: "bold" }} align="right">
                                                                {totalAmount}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    </Fragment>
                                ) : null}
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
