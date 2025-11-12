import React, { useEffect } from "react";
import { Formik } from "formik";
import { NoticeValidation } from "./NoticeValidation";
import { Drawer, FormControl, FormHelperText, Grid, InputLabel, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import {
    useAddNewNoticeMutation,
    useGetNoticeSingleQuery,
    useUpdateNoticeMutation,
} from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";
import RichTextEditor from "../../Common/editor/RichTextEditor";
import Input from "../../Common/Input";
import MultiSelectAutoCompleteServerSide from "../../Common/MultiSelectAutoCompleteServerSide";
import { UploadFile } from "../../Common/UploadFile";

export const NoticeAddDrawer = ({
    show,
    close,
    formType,
    initialValues,
    getMembersList,
    getActivityList,
    getBatchList,
}) => {
    const dispatch = useDispatch();
    const [addNewNotice, { isLoading: addNoticeLoading }] = useAddNewNoticeMutation();
    const [updateNewNotice, { isLoading: updateNoticeLoading }] = useUpdateNoticeMutation();

    const shouldSkip = !show || !initialValues?._id;

    const { data: noticeData, ...rest } = useGetNoticeSingleQuery({ _id: initialValues?._id }, { skip: shouldSkip });

    const [formInitialValue, setFormInitialValue] = React.useState({});

    useEffect(() => {
        if (show) {
            if (formType === "Edit" && noticeData) {
                setFormInitialValue(noticeData);
            } else if (formType === "Add") {
                setFormInitialValue({}); // Clear the form for a new notice
            }
        } else {
            setFormInitialValue({});
        }
    }, [show, noticeData, formType]);

    const onFormSubmit = async (values) => {
        try {
            let payload = {
                title: values.title,
                content: values.content,
                pdf_url: values.pdf_url,
                status: values.status || "true",
                type: "public",
            };

            if (values.type === "specific_member") {
                payload.members = values.members.map((member) => member._id);
            }

            if (values.type === "specific_activity") {
                payload.activities = values.activities.map((activity) => activity._id);
            }

            if (values.type === "specific_batch") {
                payload.batches = values.batches.map((batch) => batch._id);
            }

            // console.log(payload, "payload");
            // return false;

            if (formType === "Edit") {
                payload._id = initialValues._id;
                await updateNewNotice(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Notice updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewNotice(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Notice created successfully",
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
            initialValues={formInitialValue}
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={NoticeValidation}
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
                                <Typography variant="h6">{formType} Notice</Typography>
                            </Grid>
                        </Grid>
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
                                {/* <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.type || ""}
                                        onChange={handleChange("type")}
                                        displayEmpty
                                        label="Notice Type"
                                        name="type"
                                        id="type"
                                        items={[
                                            { label: "Public Notice", value: "public" },
                                            { label: "Specific Activity Notice", value: "specific_activity" },
                                            { label: "Specific Batch Notice", value: "specific_batch" },
                                            { label: "Specific Member", value: "specific_member" },
                                        ]}
                                        error={Boolean(errors.type)}
                                        helperText={errors.type}
                                    />
                                </Grid> */}
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.status || "true"}
                                        onChange={handleChange("status")}
                                        displayEmpty
                                        label="Status"
                                        name="status"
                                        id="status"
                                        items={[
                                            { label: "Active", value: "true" },
                                            { label: "In-active", value: "false" },
                                        ]}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <UploadFile
                                        label="Upload File"
                                        name="pdf_url"
                                        onChange={(val) => setFieldValue("pdf_url", val)}
                                        value={values?.pdf_url || ""}
                                        labelSecondary="Upload Any PDF Here"
                                        types={["pdf"]}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth error={Boolean(errors.content)}>
                                        <InputLabel size={"small"}>Content</InputLabel>
                                        <br />
                                        <br />
                                        <RichTextEditor
                                            placeholder="Contents"
                                            class="h-20"
                                            setValue={(d) => setFieldValue("content", d)}
                                            defaultValue={values?.content || ""}
                                        />
                                        {Boolean(errors.content) ? (
                                            <FormHelperText>{errors.content}</FormHelperText>
                                        ) : null}
                                    </FormControl>
                                </Grid>

                                {values?.type === "specific_batch" && (
                                    <Grid item xs={12} md={6}>
                                        <MultiSelectAutoCompleteServerSide
                                            label="Type & Select Batch *"
                                            name="batches"
                                            id="batches"
                                            fullWidth
                                            fetchDataFunction={(d) => getBatchList(d)}
                                            onChange={(val) => setFieldValue("batches", val)}
                                            defaultValue={values?.batches || null}
                                            error={Boolean(errors.batches)}
                                            helperText={errors.batches}
                                            isMultiple={true}
                                            apiParams={{ active: true }}
                                            keyname="batch_name"
                                        />
                                    </Grid>
                                )}

                                {values?.type === "specific_activity" && (
                                    <Grid item xs={12} md={6}>
                                        <MultiSelectAutoCompleteServerSide
                                            label="Type & Select Activity *"
                                            name="activities"
                                            id="activities"
                                            fullWidth
                                            fetchDataFunction={(d) => getActivityList(d)}
                                            onChange={(val) => setFieldValue("activities", val)}
                                            defaultValue={values?.activities || null}
                                            error={Boolean(errors.activities)}
                                            helperText={errors.activities}
                                            isMultiple={true}
                                            apiParams={{ active: true }}
                                        />
                                    </Grid>
                                )}
                                {values?.type === "specific_member" && (
                                    <Grid item xs={12} md={6}>
                                        <MultiSelectAutoCompleteServerSide
                                            label="Type & Select Member *"
                                            name="members"
                                            id="members"
                                            fullWidth
                                            fetchDataFunction={(d) => getMembersList(d)}
                                            onChange={(val) => setFieldValue("members", val)}
                                            defaultValue={values?.members || null}
                                            error={Boolean(errors.members)}
                                            helperText={errors.members}
                                            isMultiple={true}
                                            apiParams={{ active: true }}
                                        />
                                    </Grid>
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
                                            loading={addNoticeLoading || updateNoticeLoading}
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
