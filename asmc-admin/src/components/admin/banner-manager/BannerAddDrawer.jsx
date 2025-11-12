import React, { useState } from "react";
import { Formik } from "formik";
import { BannerValidation } from "./BannerValidation";
import { Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined"
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { FileUploader } from "react-drag-drop-files";
import { baseUrl, fileTypes } from "../../../helpers/constants";
import { useAddNewBannerMutation, useUpdateBannerMutation } from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";

export const BannerAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const [addBanner, { isLoading: addBannerLoading }] = useAddNewBannerMutation();
    const [updateBanner, { isLoading: updateBannerLoading }] = useUpdateBannerMutation();
    const disabled = formType === 'View' ? true : false;

    const [file, setFile] = useState(null);
    const [imgData, setImgData] = useState(null);
    const handleFileChange = (file) => {
        setFile(file);

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImgData(reader.result);
        });
        reader.readAsDataURL(file);
    };

    const onFormSubmit = async (values) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach(function (key, index) {
                formData.append(key, values[key]);
            });

            if (file)
                formData.append("image", file);

            if (formType === "Edit") {
                await updateBanner(formData).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Banner updated successfully",
                    severity: "success",
                }))
            } else {
                await addBanner(formData).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Banner created successfully",
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
            initialValues={initialValues}
            onSubmit={onFormSubmit}
            validationSchema={BannerValidation}
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
                <Drawer
                    anchor={"right"}
                    open={show}
                    PaperProps={{
                        sx: { width: { xs: '100%', md: '70%', sm: "70%", lg: "70%" } },
                    }}
                    onClose={() => close()}
                >
                    {console.log(errors)}
                    <Grid sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"} >
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons color="default" title="Close" IconComponent={CloseIcon} onClick={() => close()} />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">{formType} Banner</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.type || ""}
                                        onChange={handleChange("type")}
                                        label="Banner Type *"
                                        name="type"
                                        id="type"
                                        items={[
                                            { label: "Home Page", value: "home_page" },
                                            { label: "About Us", value: "about_us" },
                                            { label: "Sports", value: "sports" },
                                            { label: "Photo Gallery", value: "photo_gallery" },
                                            { label: "Video Gallery", value: "video_gallery" },
                                            { label: "Events", value: "events" },
                                            { label: "Contact Us", value: "contact_us" },
                                        ]}
                                        disabled={disabled}
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
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FileUploader
                                        classes="drop_area"
                                        handleChange={handleFileChange}
                                        name="file"
                                        types={fileTypes}
                                        label="Upload or drop a file right here"
                                    />
                                    <Typography>{file ? `File name: ${file.name}` : "no files uploaded yet"}</Typography>
                                    {
                                        imgData
                                            ?
                                            <img width={100} alt="preview" src={imgData} />
                                            :
                                            values?.url
                                                ?
                                                <img width={100} alt="preview" src={ values?.url} />
                                                :
                                                null
                                    }
                                    <Typography variant="subtitle2">File width for home page should be 1680 X 1042 in pixels.</Typography>
                                    <Typography variant="subtitle2">File width for other page should be 1680 X 300 in pixels.</Typography>
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
                                            <Button size="large" type="submit" loading={addBannerLoading || updateBannerLoading} onClick={() => handleSubmit()}>Save</Button>
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