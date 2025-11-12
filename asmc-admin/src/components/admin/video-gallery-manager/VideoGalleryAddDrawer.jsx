import React from "react";
import { Formik } from "formik";
import { VideoGalleryValidation } from "./VideoGalleryValidation";
import { Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewGalleryMutation } from "../../../store/masters/mastersApis";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";

export const VideoGalleryAddDrawer = ({ show, close, formType }) => {
    const dispatch = useDispatch();
    const [addNewGallery, { isLoading: addGalleryLoading }] = useAddNewGalleryMutation();

    const onFormSubmit = async (values) => {
        try {
            const payload = values;

            payload.type = "video";

            await addNewGallery(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Gallery created successfully",
                    severity: "success",
                }),
            );
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
            initialValues={{}}
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={VideoGalleryValidation}
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
                                <Typography variant="h6">{formType} Video Gallery</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <CommonFileUploadToServer
                                        name="video_thumbnail"
                                        onChange={(val) => setFieldValue("video_thumbnail", val)}
                                        value={values?.video_thumbnail || ""}
                                        label="Thumbnail (600 X 300 in pixels)"
                                        error={Boolean(errors.video_thumbnail)}
                                        helperText={errors.video_thumbnail}
                                        width={600}
                                        height={300}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Input
                                        id="youtube_link"
                                        name="url"
                                        label="Youtube Video Link"
                                        onChange={handleChange("url")}
                                        value={values?.url}
                                        error={Boolean(errors.url)}
                                        helperText={errors.url}
                                        fullWidth
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
                                            loading={addGalleryLoading}
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
