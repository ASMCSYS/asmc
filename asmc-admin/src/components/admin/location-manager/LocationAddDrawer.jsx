import React from "react";
import { Formik } from "formik";
import { LocationValidation } from "./LocationValidation";
import { Drawer, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined"
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewLocationMutation, useGetParentLocationListQuery, useUpdateLocationMutation } from "../../../store/masters/mastersApis";
import StyledTextarea from "../../Common/StyledTextarea";
import BasicSelect from "../../Common/Select";

export const LocationAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addNewLocation, { isLoading: addLocationLoading }] = useAddNewLocationMutation();
    const [updateLocation, { isLoading: updateLocationLoading }] = useUpdateLocationMutation();

    const { data: parentLocation = [], isLoading: parentLocationLoading } = useGetParentLocationListQuery({}, { skip: !show });

    const disabled = formType === 'View' ? true : false;

    const onFormSubmit = async (values) => {
        try {
            let payload = { ...values };

            delete payload.parent_data;

            if (formType === "Edit") {
                await updateLocation(payload).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Location updated successfully",
                    severity: "success",
                }))
            } else {
                await addNewLocation(payload).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Location created successfully",
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
        <Formik
            enableReinitialize
            initialValues={{ ...initialValues }}
            // onSubmit={(values) => onFormSubmit(values)}
            onSubmit={(values, { resetForm }) => {
                // Handle form submission
                onFormSubmit(values);

                // Reset the form values
                resetForm();
            }}
            validationSchema={LocationValidation}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                setFieldValue
            }) => (
                <Drawer
                    anchor={"right"}
                    open={show}
                    PaperProps={{
                        sx: { width: { xs: '100%', md: '70%', sm: "70%", lg: "70%" } },
                    }}
                    onClose={() => close()}
                >
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"} >
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons color="default" title="Close" IconComponent={CloseIcon} onClick={() => close()} />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">{formType} Location</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.parent_id || 0}
                                        onChange={handleChange("parent_id")}
                                        displayEmpty
                                        label="Select Parent Location*"
                                        name="parent_id"
                                        id="parent_id"
                                        items={[
                                            {
                                                value: 0,
                                                label: "None"
                                            },
                                            ...(formType === "Edit" ? parentLocation.filter(item => item.value !== values?._id) : parentLocation)
                                        ]}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id='title'
                                        name="title"
                                        label="Location *"
                                        onChange={handleChange("title")}
                                        value={values?.title || ""}
                                        error={Boolean(errors.title)}
                                        helperText={errors.title}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <StyledTextarea
                                        id='address'
                                        name="address"
                                        label="Address *"
                                        onChange={handleChange("address")}
                                        value={values?.address || ""}
                                        error={Boolean(errors.address)}
                                        helperText={errors.address}
                                        fullWidth
                                        disabled={disabled}
                                        minRows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        disabled={disabled}
                                        control={<Switch checked={values?.status || false} />}
                                        label="Active"
                                        onChange={(e) => setFieldValue("status", e.target.checked)}
                                    />
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
                                            <Button size="large" type="submit" loading={addLocationLoading || updateLocationLoading} onClick={() => handleSubmit()}>Save</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                :
                                null
                        }
                    </Grid>
                </Drawer>
            )
            }
        </Formik >
    )
}