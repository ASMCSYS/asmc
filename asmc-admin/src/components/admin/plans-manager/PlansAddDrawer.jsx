import React, { Fragment, useState } from "react";
import { Formik } from "formik";
import { PlansValidation } from "./PlansValidation";
import { Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewPlansMutation, useUpdatePlansMutation } from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";
import Input from "../../Common/Input";

export const PlansAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addPlans, { isLoading: addPlansLoading }] = useAddNewPlansMutation();
    const [updatePlans, { isLoading: updatePlansLoading }] = useUpdatePlansMutation();
    const disabled = formType === "View" ? true : false;

    const onFormSubmit = async (values) => {
        try {
            // checking weather start date is same as end date
            if (values.start_month === values.end_month && values?.plan_type === "membership") {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Start month and end month can't be same",
                        severity: "error",
                    }),
                );
            }
            if (formType === "Edit") {
                await updatePlans(values).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Plans updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addPlans(values).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Plans created successfully",
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
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={PlansValidation}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                <Drawer
                    anchor={"right"}
                    open={show}
                    PaperProps={{
                        sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
                    }}
                    onClose={() => close()}
                >
                    <Grid sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
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
                                <Typography variant="h6">{formType} Plans</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.plan_type || ""}
                                        onChange={handleChange("plan_type")}
                                        displayEmpty
                                        label="Select Plan Type *"
                                        name="plan_type"
                                        id="plan_type"
                                        items={[
                                            { label: "Membership", value: "membership" },
                                            { label: "Enrollment", value: "enrollment" },
                                            { label: "Sports Booking", value: "booking" },
                                            { label: "Hall Booking", value: "hall" },
                                        ]}
                                        disabled={disabled}
                                        error={Boolean(errors.plan_type)}
                                        helperText={errors.plan_type}
                                    />
                                </Grid>
                                {values?.plan_type === "enrollment" && (
                                    <Grid item xs={12} md={6}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.plan_timeline || null}
                                            onChange={handleChange("plan_timeline")}
                                            displayEmpty
                                            label="Select Timeline *"
                                            name="plan_timeline"
                                            id="plan_timeline"
                                            items={[
                                                // { label: "Monthly", value: "monthly" },
                                                { label: "Quarterly", value: "quarterly" },
                                                { label: "Half Yearly", value: "half_year" },
                                                { label: "Yearly", value: "yearly" },
                                            ]}
                                            disabled={disabled}
                                            error={Boolean(errors.plan_timeline)}
                                            helperText={errors.plan_timeline}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="plan_name"
                                        name="plan_name"
                                        label="Plan Name *"
                                        onChange={handleChange("plan_name")}
                                        value={values?.plan_name || ""}
                                        error={Boolean(errors.plan_name)}
                                        helperText={errors.plan_name}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="description"
                                        name="description"
                                        label="Short Description about plan"
                                        onChange={handleChange("description")}
                                        value={values?.description || ""}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                {values?.plan_type === "membership" && (
                                    <Fragment>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="amount"
                                                name="amount"
                                                label="Primary Member Amount *"
                                                onChange={handleChange("amount")}
                                                value={values?.amount || 0}
                                                error={Boolean(errors.amount)}
                                                helperText={errors.amount}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="dependent_member_price"
                                                name="dependent_member_price"
                                                label="Dependent Member Price *"
                                                onChange={handleChange("dependent_member_price")}
                                                value={values?.dependent_member_price || 0}
                                                error={Boolean(errors.dependent_member_price)}
                                                helperText={errors.dependent_member_price}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="non_dependent_member_price"
                                                name="non_dependent_member_price"
                                                label="Non Dependent Member Price *"
                                                onChange={handleChange("non_dependent_member_price")}
                                                value={values?.non_dependent_member_price || 0}
                                                error={Boolean(errors.non_dependent_member_price)}
                                                helperText={errors.non_dependent_member_price}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                    </Fragment>
                                )}
                                {values?.plan_type === "booking" ? (
                                    <Grid item xs={12} md={6}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.hours || 1}
                                            onChange={handleChange("hours")}
                                            displayEmpty
                                            label="Hours *"
                                            name="hours"
                                            id="hours"
                                            items={[
                                                { label: "1 Hours", value: 1 },
                                                { label: "4 Hours", value: 4 },
                                            ]}
                                            disabled={disabled}
                                            error={Boolean(errors.hours)}
                                            helperText={errors.hours}
                                        />
                                    </Grid>
                                ) : values?.plan_type === "hall" ? (
                                    <Grid item xs={12} md={6}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.hours || 1}
                                            onChange={handleChange("hours")}
                                            displayEmpty
                                            label="Batch Hours *"
                                            name="hours"
                                            id="hours"
                                            items={[
                                                { label: "1 Hours", value: 1 },
                                                { label: "2 Hours", value: 2 },
                                                { label: "4 Hours", value: 4 },
                                                { label: "7 Hours", value: 7 },
                                                { label: "8 Hours", value: 8 },
                                                { label: "12 Hours", value: 12 },
                                            ]}
                                            disabled={disabled}
                                            error={Boolean(errors.hours)}
                                            helperText={errors.hours}
                                        />
                                    </Grid>
                                ) : values?.plan_type === "membership" ||
                                  (values?.plan_type === "enrollment" && values?.plan_timeline !== "monthly") ? (
                                    <Fragment>
                                        <Grid item xs={12} md={6}>
                                            <BasicSelect
                                                size="small"
                                                value={values?.start_month || ""}
                                                onChange={handleChange("start_month")}
                                                displayEmpty
                                                label="Select Start Month *"
                                                name="start_month"
                                                id="start_month"
                                                items={[
                                                    { label: "January", value: 1 },
                                                    { label: "February", value: 2 },
                                                    { label: "March", value: 3 },
                                                    { label: "April", value: 4 },
                                                    { label: "May", value: 5 },
                                                    { label: "June", value: 6 },
                                                    { label: "July", value: 7 },
                                                    { label: "August", value: 8 },
                                                    { label: "September", value: 9 },
                                                    { label: "October", value: 10 },
                                                    { label: "November", value: 11 },
                                                    { label: "December", value: 12 },
                                                ]}
                                                disabled={disabled}
                                                error={Boolean(errors.start_month)}
                                                helperText={errors.start_month}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <BasicSelect
                                                size="small"
                                                value={values?.end_month || ""}
                                                onChange={handleChange("end_month")}
                                                displayEmpty
                                                label="Select End Month *"
                                                name="end_month"
                                                id="end_month"
                                                items={[
                                                    { label: "January", value: 1 },
                                                    { label: "February", value: 2 },
                                                    { label: "March", value: 3 },
                                                    { label: "April", value: 4 },
                                                    { label: "May", value: 5 },
                                                    { label: "June", value: 6 },
                                                    { label: "July", value: 7 },
                                                    { label: "August", value: 8 },
                                                    { label: "September", value: 9 },
                                                    { label: "October", value: 10 },
                                                    { label: "November", value: 11 },
                                                    { label: "December", value: 12 },
                                                ]}
                                                disabled={disabled}
                                                error={Boolean(errors.end_month)}
                                                helperText={errors.end_month}
                                            />
                                        </Grid>
                                    </Fragment>
                                ) : null}
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.status?.toString() || "true"}
                                        onChange={handleChange("status")}
                                        displayEmpty
                                        label="Active"
                                        name="status"
                                        id="status"
                                        items={[
                                            { label: "Active", value: "true" },
                                            { label: "In-active", value: "false" },
                                        ]}
                                        disabled={disabled}
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
                                            loading={addPlansLoading || updatePlansLoading}
                                            onClick={() => handleSubmit()}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                </Drawer>
            )}
        </Formik>
    );
};
