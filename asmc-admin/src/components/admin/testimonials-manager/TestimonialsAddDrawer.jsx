import React, { useEffect, useMemo } from "react";
import { Formik } from "formik";
import { TestimonialsValidation } from "./TestimonialsValidation";
import { Avatar, Box, Card, Chip, Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewTestimonialsMutation, useUpdateTestimonialsMutation } from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";
import StyledTextarea from "../../Common/StyledTextarea";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import { Email, Phone } from "@mui/icons-material";
import { format } from "date-fns";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";
import Input from "../../Common/Input";

const getInitials = (name) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase();
};

export const TestimonialsAddDrawer = ({ show, close, formType, initialValues, getMembersList }) => {
    const dispatch = useDispatch();
    const [addNewTestimonials, { isLoading: addTestimonialsLoading }] = useAddNewTestimonialsMutation();
    const [updateNewTestimonials, { isLoading: updateTestimonialsLoading }] = useUpdateTestimonialsMutation();

    const onFormSubmit = async (values) => {
        try {
            if (formType === "Edit") {
                let payload = { ...values };
                await updateNewTestimonials(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Testimonials updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewTestimonials(values).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Testimonials created successfully",
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
            validationSchema={TestimonialsValidation}
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
                                <Typography variant="h6">{formType} Testimonial</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <CommonFileUploadToServer
                                        name="profile"
                                        onChange={(val) => setFieldValue("profile", val)}
                                        value={values?.profile || ""}
                                        label="Profile (300 X 300 in pixels)"
                                        error={Boolean(errors.profile)}
                                        helperText={errors.profile}
                                        width={300}
                                        height={300}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="name"
                                        name="name"
                                        label="Name *"
                                        onChange={handleChange("name")}
                                        value={values?.name || ""}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="role"
                                        name="role"
                                        label="Role *"
                                        onChange={handleChange("role")}
                                        value={values?.role || ""}
                                        error={Boolean(errors.role)}
                                        helperText={errors.role}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.status || "true"}
                                        onChange={handleChange("status")}
                                        displayEmpty
                                        label="Active"
                                        name="status"
                                        id="status"
                                        items={[
                                            { label: "Active", value: "true" },
                                            { label: "In-active", value: "false" },
                                        ]}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.star}
                                        onChange={handleChange("star")}
                                        displayEmpty
                                        label="Star"
                                        name="star"
                                        id="star"
                                        items={[
                                            { label: "1", value: "1" },
                                            { label: "2", value: "2" },
                                            { label: "3", value: "3" },
                                            { label: "4", value: "4" },
                                            { label: "5", value: "5" },
                                        ]}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <StyledTextarea
                                        id="message"
                                        name="message"
                                        label="Message *"
                                        onChange={handleChange("message")}
                                        value={values?.message || ""}
                                        error={Boolean(errors.message)}
                                        helperText={errors.message}
                                        fullWidth
                                        minRows={2}
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
                                            loading={addTestimonialsLoading || updateTestimonialsLoading}
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
