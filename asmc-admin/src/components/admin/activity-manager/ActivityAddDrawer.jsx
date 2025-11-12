import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { ActivityValidation } from "./ActivityValidation";
import { Box, Card, CardContent, Divider, Drawer, FormControl, FormHelperText, Grid, InputLabel, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";

import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewActivityMutation, useUpdateActivityMutation } from "../../../store/activity/activityApis";
import StyledTextarea from "../../Common/StyledTextarea";
import { MultipleFileUploadToServer } from "../../Common/MultipleFileUploadToServer";
import RichTextEditor from "../../Common/editor/RichTextEditor";
import AutoCompleteSelect from "../../Common/AutoCompleteSelect";
import { useGetParentCategoryListQuery, useGetParentLocationListQuery } from "../../../store/masters/mastersApis";

export const ActivityAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addNewActivity, { isLoading: addActivityLoading }] = useAddNewActivityMutation();
    const [updateActivity, { isLoading: updateActivityLoading }] = useUpdateActivityMutation();

    const { data: categoryData } = useGetParentCategoryListQuery({}, { skip: !show });
    const { data: locationData } = useGetParentLocationListQuery({}, { skip: !show });
    const disabled = formType === 'View' ? true : false;

    const onFormSubmit = async (values) => {
        try {
            // let payload = { ...values }; //default facility id
            // delete payload.facility_data;
            // delete payload.updatedAt;
            // delete payload.activity_id;
            // delete payload.time_slots;
            // delete payload.batch_data;
            // delete payload.location_data;
            // delete payload.sublocation_data;

            let payload = {
                name: values?.name,
                facility_id: values?.facility_id,
                thumbnail: values?.thumbnail,
                images: values?.images,
                short_description: values?.short_description,
                description: values?.description,
                location: values?.location,
                batch_booking_plan: values?.batch_booking_plan,
                status: values?.status,
                createdAt: values?.createdAt,
                category: values?.category
            }

            if (formType === "Edit") {
                payload._id = initialValues._id;
                await updateActivity(payload).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Activity updated successfully",
                    severity: "success",
                }))
            } else {
                await addNewActivity(payload).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Activity created successfully",
                    severity: "success",
                }))
            }
            close();
        } catch (error) {
            dispatch(setSnackBar({
                open: true,
                message: error?.data?.message || error.message,
                severity: "error",
            }))
        }
    };

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
                                <Typography variant="h6">{formType} Activity</Typography>
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
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <AutoCompleteSelect
                                        multiple={true}
                                        id="category_select-autocomplete"
                                        options={categoryData || []}
                                        label="Select Category"
                                        onChange={(e, val) => setFieldValue("category", val)}
                                        value={values?.category || []}
                                        error={Boolean(errors.category)}
                                        helperText={errors.category}
                                        name="category"
                                        keyname="label"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <StyledTextarea
                                        id='short_description'
                                        name="short_description"
                                        label="Short Description"
                                        onChange={handleChange("short_description")}
                                        value={values?.short_description || ""}
                                        error={Boolean(errors.short_description)}
                                        helperText={errors.short_description}
                                        fullWidth
                                        disabled={disabled}
                                        minRows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <AutoCompleteSelect
                                        multiple={true}
                                        id="location_select-autocomplete"
                                        options={locationData || []}
                                        label="Select Location"
                                        onChange={(e, val) => setFieldValue("location", val)}
                                        value={values?.location || []}
                                        error={Boolean(errors.location)}
                                        helperText={errors.location}
                                        name="location"
                                        keyname="label"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CommonFileUploadToServer
                                        name="thumbnail"
                                        onChange={(val) => setFieldValue("thumbnail", val)}
                                        value={values?.thumbnail || ""}
                                        label="Thumbnail of Activity (800 X 800 in pixels)"
                                        error={Boolean(errors.thumbnail)}
                                        helperText={errors.thumbnail}
                                        disabled={disabled}
                                        width={800}
                                        height={800}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MultipleFileUploadToServer
                                        name="images"
                                        onChange={(val) => setFieldValue("images", val)}
                                        value={values?.images || ""}
                                        label="Slider Images of Activity (800 X 800 in pixels)"
                                        error={Boolean(errors.images)}
                                        helperText={errors.images}
                                        disabled={disabled}
                                        multiple={true}
                                        width={800}
                                        height={800}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth error={Boolean(errors.description)}>
                                        <InputLabel size={"small"}>Description</InputLabel>
                                        <br />
                                        <br />
                                        <RichTextEditor
                                            placeholder="Description"
                                            class="h-20"
                                            setValue={(d) => setFieldValue("description", d)}
                                            defaultValue={values?.description || ""}
                                        />
                                        {Boolean(errors.description) ? (
                                            <FormHelperText>{errors.description}</FormHelperText>
                                        ) : null}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            formType !== 'View'
                                ?
                                <Grid flexShrink={0} borderTop={1} borderColor={"rgba(152, 188, 252, 0.16)"} sx={{ padding: "8px 16px" }}>
                                    <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Button size="large" color="warning" type="button" onClick={() => close()}>Cancel</Button>
                                            <Button size="large" type="submit" loading={addActivityLoading || updateActivityLoading} onClick={() => handleSubmit()}>Save</Button>
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