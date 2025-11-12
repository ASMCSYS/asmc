import React, { useEffect } from "react";
import { FormControl, FormHelperText, Grid, InputLabel, Paper, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { CommonFileUploadToServer } from "../../../components/Common/CommonFileUploadToServer";
import Input from "../../../components/Common/Input";
import Button from "../../../components/Common/Button";
import RichTextEditor from "../../../components/Common/editor/RichTextEditor";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useGetAboutPageCmsQuery, useUpdateAboutPageCmsMutation } from "../../../store/common/commonApis";
import { UploadFile } from "../../../components/Common/UploadFile";

const Validation = yup.object().shape({
    right_image: yup.mixed(),
    title: yup.mixed(),
    subtitle: yup.mixed(),
    fees_content: yup.mixed(),
    fees_structure_url: yup.mixed(),
    text_content_left: yup.mixed(),
    text_content_center: yup.mixed(),
});

const AboutPageCmsContainer = () => {
    const dispatch = useDispatch();
    const { data } = useGetAboutPageCmsQuery();
    const [updateAboutPageCms] = useUpdateAboutPageCmsMutation();

    const onFormSubmit = async (values) => {
        try {
            await updateAboutPageCms(values);

            dispatch(
                setSnackBar({
                    open: true,
                    message: "Content updated successfully",
                    severity: "success",
                }),
            );
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
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">About Page CMS</Typography>
                    </Grid>
                </Grid>

                <Formik
                    enableReinitialize
                    initialValues={data?.json || {}}
                    onSubmit={(values, { resetForm }) => {
                        onFormSubmit(values);
                        resetForm();
                    }}
                    validationSchema={Validation}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                        <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                            <Grid flex={1} px={2} py={5} overflow={"auto"}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="title"
                                            name="title"
                                            label="Title *"
                                            onChange={handleChange("title")}
                                            value={values?.title || ""}
                                            error={Boolean(errors.title)}
                                            helperText={errors.title}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Input
                                            id="subtitle"
                                            name="subtitle"
                                            label="Subtitle"
                                            onChange={handleChange("subtitle")}
                                            value={values?.subtitle || ""}
                                            error={Boolean(errors.subtitle)}
                                            helperText={errors.subtitle}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <CommonFileUploadToServer
                                            name="right_image"
                                            onChange={(val) => setFieldValue("right_image", val)}
                                            value={values?.right_image || ""}
                                            label="Right Image (700 X 730 in pixels)"
                                            error={Boolean(errors.right_image)}
                                            helperText={errors.right_image}
                                            width={700}
                                            height={730}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <FormControl fullWidth error={Boolean(errors.text_content_left)}>
                                            <InputLabel size={"small"}>Content Left Side</InputLabel>
                                            <br />
                                            <br />
                                            <RichTextEditor
                                                placeholder="Event Contents Left"
                                                class="h-20"
                                                setValue={(d) => setFieldValue("text_content_left", d)}
                                                defaultValue={values?.text_content_left || ""}
                                            />
                                            {Boolean(errors.text_content_left) ? (
                                                <FormHelperText>{errors.text_content_left}</FormHelperText>
                                            ) : null}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <FormControl fullWidth error={Boolean(errors.text_content_center)}>
                                            <InputLabel size={"small"}>Content Center Side</InputLabel>
                                            <br />
                                            <br />
                                            <RichTextEditor
                                                placeholder="Event Contents Center"
                                                class="h-20"
                                                setValue={(d) => setFieldValue("text_content_center", d)}
                                                defaultValue={values?.text_content_center || ""}
                                            />
                                            {Boolean(errors.text_content_center) ? (
                                                <FormHelperText>{errors.text_content_center}</FormHelperText>
                                            ) : null}
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="space-between" sx={{ marginTop: "24px" }}>
                                    <Grid item xs={6} sx={{ alignSelf: "center", marginBottom: "24px" }}>
                                        <Typography variant="h6">Fees Structure</Typography>
                                    </Grid>

                                    <Grid item xs={12} md={12}>
                                        <UploadFile
                                            label="Upload Fees Structure"
                                            name="fees_structure_url"
                                            onChange={(val) => setFieldValue("fees_structure_url", val)}
                                            value={values?.fees_structure_url || ""}
                                            labelSecondary="Upload Fees Structure PDF/Word Here"
                                            types={["pdf"]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <FormControl fullWidth error={Boolean(errors.fees_content)}>
                                            <InputLabel size={"small"}>Fees Content</InputLabel>
                                            <br />
                                            <br />
                                            <RichTextEditor
                                                placeholder="Fees Content"
                                                class="h-20"
                                                setValue={(d) => setFieldValue("fees_content", d)}
                                                defaultValue={values?.fees_content || ""}
                                            />
                                            {Boolean(errors.fees_content) ? (
                                                <FormHelperText>{errors.fees_content}</FormHelperText>
                                            ) : null}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                flexShrink={0}
                                borderTop={1}
                                borderColor={"rgba(152, 188, 252, 0.16)"}
                                sx={{ padding: "8px 16px" }}
                            >
                                <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Button size="large" type="submit" onClick={() => handleSubmit()}>
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Formik>
            </Paper>
        </Stack>
    );
};

export default AboutPageCmsContainer;
