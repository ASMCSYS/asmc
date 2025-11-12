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
import { axios } from "../../../helpers/axios";
import { useGetHomePageCmsQuery, useUpdateHomePageCmsMutation } from "../../../store/common/commonApis";

const Validation = yup.object().shape({
    home_round_image: yup.mixed().required("Required"),
    home_round_image: yup.mixed(),
    title: yup.mixed(),
    subtitle: yup.mixed(),
    text_content: yup.mixed().required("Required"),
});

const HomePageCmsContainer = () => {
    const dispatch = useDispatch();
    const { data } = useGetHomePageCmsQuery();
    const [updateHomePageCms] = useUpdateHomePageCmsMutation();

    const onFormSubmit = async (values) => {
        try {
            await updateHomePageCms(values);

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
                        <Typography variant="h6">Home Page CMS</Typography>
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
                                        <CommonFileUploadToServer
                                            name="home_square_image"
                                            onChange={(val) => setFieldValue("home_square_image", val)}
                                            value={values?.home_square_image || ""}
                                            label="Home About Square Image (530 X 600 in pixels)"
                                            error={Boolean(errors.home_square_image)}
                                            helperText={errors.home_square_image}
                                            width={530}
                                            height={600}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CommonFileUploadToServer
                                            name="home_round_image"
                                            onChange={(val) => setFieldValue("home_round_image", val)}
                                            value={values?.home_round_image || ""}
                                            label="Home About Round Image (320 X 320 in pixels)"
                                            error={Boolean(errors.home_round_image)}
                                            helperText={errors.home_round_image}
                                            width={320}
                                            height={320}
                                        />
                                    </Grid>
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
                                        <FormControl fullWidth error={Boolean(errors.text_content)}>
                                            <InputLabel size={"small"}>Content</InputLabel>
                                            <br />
                                            <br />
                                            <RichTextEditor
                                                placeholder="Event Contents"
                                                class="h-20"
                                                setValue={(d) => setFieldValue("text_content", d)}
                                                defaultValue={values?.text_content || ""}
                                            />
                                            {Boolean(errors.text_content) ? (
                                                <FormHelperText>{errors.text_content}</FormHelperText>
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

export default HomePageCmsContainer;
