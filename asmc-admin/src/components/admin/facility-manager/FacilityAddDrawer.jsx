import React from "react";
import { Formik } from "formik";
import { FacilityValidation } from "./FacilityValidation";
import { Drawer, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";

import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewFacilityMutation, useUpdateFacilityMutation } from "../../../store/facility/facilityApis";
import { generatePermaLink } from "../../../helpers/utils";

export const FacilityAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addNewFacility, { isLoading: addFacilityLoading }] = useAddNewFacilityMutation();
    const [updateFacility, { isLoading: updateFacilityLoading }] = useUpdateFacilityMutation();

    const disabled = formType === "View" ? true : false;

    const onFormSubmit = async (values) => {
        try {
            let payload = { ...values };

            if (formType === "Edit") {
                await updateFacility(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Facility updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewFacility(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Facility created successfully",
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
            enableReinitialize
            initialValues={{ ...initialValues }}
            // onSubmit={(values) => onFormSubmit(values)}
            onSubmit={(values, { resetForm }) => {
                // Handle form submission
                onFormSubmit(values);

                // Reset the form values
                resetForm();
            }}
            validationSchema={FacilityValidation}
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
                                <Typography variant="h6">{formType} Facility</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <CommonFileUploadToServer
                                        name="banner_url"
                                        onChange={(val) => setFieldValue("banner_url", val)}
                                        value={values?.banner_url || ""}
                                        label="Banner Image (1280 X 325 in pixels)"
                                        error={Boolean(errors.banner_url)}
                                        helperText={errors.banner_url}
                                        disabled={disabled}
                                        width={1280}
                                        height={325}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="title"
                                        name="title"
                                        label="Title of facility *"
                                        onChange={(e) => {
                                            setFieldValue("title", e.target.value);
                                            setFieldValue("permalink", generatePermaLink(e.target.value));
                                        }}
                                        value={values?.title || ""}
                                        error={Boolean(errors.title)}
                                        helperText={errors.title}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="permalink"
                                        name="permalink"
                                        label="Permalink *"
                                        value={values?.permalink || ""}
                                        error={Boolean(errors.permalink)}
                                        helperText={errors.permalink}
                                        fullWidth
                                        disabled={true}
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
                                            loading={addFacilityLoading || updateFacilityLoading}
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
