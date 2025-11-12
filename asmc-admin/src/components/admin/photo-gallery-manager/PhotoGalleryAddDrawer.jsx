import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { PhotoGalleryValidation } from "./PhotoGalleryValidation";
import { Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { FileUploader } from "react-drag-drop-files";
import { fileTypes } from "../../../helpers/constants";
import { useAddNewGalleryDriveMutation, useAddNewGalleryMutation } from "../../../store/masters/mastersApis";
import ImagesGallery from "../../Common/ImagesGallery";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";
import Input from "../../Common/Input";

export const PhotoGalleryAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addNewGallery, { isLoading: addGalleryLoading }] = useAddNewGalleryMutation();
    const [addNewGalleryDrive, { isLoading: addGalleryDriveLoading }] = useAddNewGalleryDriveMutation();
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);

    const handleFileChange = (evnt) => {
        const selectedFIles = [];
        setFiles(evnt);
        const targetFilesObject = [...evnt];
        targetFilesObject.map((file) => {
            return selectedFIles.push(URL.createObjectURL(file));
        });
        setImages((prev) => [...selectedFIles, ...prev]);
    };

    const removeImage = (key) => {
        setImages((prevItems) => prevItems.filter((item, index) => index !== key));
    };

    const onFormSubmit = async (values) => {
        try {
            if (values?.url) {
                await addNewGalleryDrive({ ...values, type: "image" }).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Gallery created successfully",
                        severity: "success",
                    }),
                );
                setFiles([]);
                setImages([]);
            } else {
                const formData = new FormData();
                formData.append("type", "image");
                if (files.length === 0) {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: "Please select gallery images",
                            severity: "error",
                        }),
                    );
                    return;
                }

                for (const file of files) {
                    formData.append("images", file);
                }

                await addNewGallery(formData).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Gallery created successfully",
                        severity: "success",
                    }),
                );
                setFiles([]);
                setImages([]);
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
            onSubmit={(values, { resetForm }) => {
                onFormSubmit(values);
                resetForm();
            }}
            validationSchema={PhotoGalleryValidation}
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
                                <Typography variant="h6">
                                    Add {formType === "photo" ? "Photo Gallery" : "Drive Links"}{" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                {formType === "photo" ? (
                                    <Grid item xs={12} md={12}>
                                        <FileUploader
                                            classes="drop_area"
                                            handleChange={handleFileChange}
                                            name="file"
                                            types={fileTypes}
                                            label="Upload or drop all files at once right here"
                                            multiple={true}
                                        />
                                        <ImagesGallery images={images} remove={(key) => removeImage(key)} />
                                    </Grid>
                                ) : (
                                    <Fragment>
                                        <Grid item xs={12} md={12}>
                                            <Input
                                                id="title"
                                                name="title"
                                                label="Title for Drive Link"
                                                onChange={handleChange("title")}
                                                value={values?.title}
                                                error={Boolean(errors.title)}
                                                helperText={errors.title}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Input
                                                id="drive_link"
                                                name="url"
                                                label="Drive Link"
                                                onChange={handleChange("url")}
                                                value={values?.url}
                                                error={Boolean(errors.url)}
                                                helperText={errors.url}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Fragment>
                                )}
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
                                            loading={addGalleryLoading || addGalleryDriveLoading}
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
