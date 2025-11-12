import React from "react";
import { Formik } from "formik";
import { FaqsValidation } from "./FaqsValidation";
import { Drawer, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined"
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useAddNewFaqsMutation, useUpdateFaqsMutation, useGetFaqsCategoriesQuery } from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";
import { useGetActiveActivityListQuery } from "../../../store/activity/activityApis";
import StyledTextarea from "../../Common/StyledTextarea";

export const FaqsAddDrawer = ({ show, close, formType, initialValues }) => {
    const dispatch = useDispatch();
    const [addNewFaqs, { isLoading: addFaqsLoading }] = useAddNewFaqsMutation();
    const [updateNewFaqs, { isLoading: updateFaqsLoading }] = useUpdateFaqsMutation();
    const { data: categories = [] } = useGetFaqsCategoriesQuery();

    const onFormSubmit = async (values) => {
        try {
            const payload = { ...values };
            
            // If "new" category is selected, use the newCategory value
            if (values.category === "new") {
                payload.category = values.newCategory;
            } else {
                payload.category = values.category;
            }
            delete payload.newCategory;
            
            if (formType === "Edit") {
                await updateNewFaqs(payload).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Faqs updated successfully",
                    severity: "success",
                }))
            } else {
                await addNewFaqs(payload).unwrap();
                dispatch(setSnackBar({
                    open: true,
                    message: "Faqs created successfully",
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
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={FaqsValidation}
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
                    <Grid sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"} >
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons color="default" title="Close" IconComponent={CloseIcon} onClick={() => close()} />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">{formType} FAQs</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2} >
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
                                        value={values?.category || ""}
                                        onChange={handleChange("category")}
                                        displayEmpty
                                        label="Category *"
                                        name="category"
                                        id="category"
                                        error={Boolean(errors.category)}
                                        helperText={errors.category}
                                        items={[
                                            ...categories.map(cat => ({ label: cat, value: cat })),
                                            { label: "Add New Category", value: "new" }
                                        ]}
                                    />
                                </Grid>
                                {values?.category === "new" && (
                                    <Grid item xs={12} md={6}>
                                        <StyledTextarea
                                            id='newCategory'
                                            name="newCategory"
                                            label="New Category Name *"
                                            onChange={handleChange("newCategory")}
                                            value={values?.newCategory || ""}
                                            error={Boolean(errors.newCategory)}
                                            helperText={errors.newCategory}
                                            fullWidth
                                            minRows={1}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} md={12}>
                                    <StyledTextarea
                                        id='question'
                                        name="question"
                                        label="Question *"
                                        onChange={handleChange("question")}
                                        value={values?.question || ""}
                                        error={Boolean(errors.question)}
                                        helperText={errors.question}
                                        fullWidth
                                        minRows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <StyledTextarea
                                        id='answer'
                                        name="answer"
                                        label="Answer *"
                                        onChange={handleChange("answer")}
                                        value={values?.answer || ""}
                                        error={Boolean(errors.answer)}
                                        helperText={errors.answer}
                                        fullWidth
                                        minRows={4}
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
                                            <Button size="large" type="submit" loading={addFaqsLoading || updateFaqsLoading} onClick={() => handleSubmit()}>Save</Button>
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