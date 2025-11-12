import React from "react";
import { Formik } from "formik";
import { TeamsValidation } from "./TeamsValidation";
import { Drawer, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewTeamsMutation, useUpdateTeamsMutation } from "../../../store/masters/mastersApis";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";

export const TeamsAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addNewTeams, { isLoading: addTeamsLoading }] = useAddNewTeamsMutation();
    const [updateTeams, { isLoading: updateTeamsLoading }] = useUpdateTeamsMutation();

    const disabled = formType === "View" ? true : false;

    const onFormSubmit = async (values) => {
        try {
            let payload = { ...values };

            delete payload.parent_data;

            if (formType === "Edit") {
                await updateTeams(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Teams updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewTeams(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Teams created successfully",
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
            onSubmit={(values, { resetForm }) => {
                // Handle form submission
                onFormSubmit(values);

                // Reset the form values
                resetForm();
            }}
            validationSchema={TeamsValidation}
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
                                <Typography variant="h6">{formType} Teams</Typography>
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
                                        disabled={disabled}
                                        width={300}
                                        height={300}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="name"
                                        name="name"
                                        label="Name of member *"
                                        onChange={handleChange("name")}
                                        value={values?.name || ""}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="role"
                                        name="role"
                                        label="Role of member *"
                                        onChange={handleChange("role")}
                                        value={values?.role || ""}
                                        error={Boolean(errors.role)}
                                        helperText={errors.role}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="display_order"
                                        name="display_order"
                                        label="Display Order"
                                        onChange={handleChange("display_order")}
                                        value={values?.display_order || "0"}
                                        error={Boolean(errors.display_order)}
                                        helperText={errors.display_order}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="activity_name"
                                        name="activity_name"
                                        label="Remarks"
                                        onChange={handleChange("activity_name")}
                                        value={values?.activity_name || ""}
                                        error={Boolean(errors.activity_name)}
                                        helperText={errors.activity_name}
                                        fullWidth
                                        disabled={disabled}
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
                                            loading={addTeamsLoading || updateTeamsLoading}
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
