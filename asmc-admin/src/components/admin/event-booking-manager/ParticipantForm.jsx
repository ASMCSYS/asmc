import { Fragment, useMemo, useState } from "react";
import { Card, Box, CardContent, Chip, Grid, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import Input from "../../Common/Input";
import BasicSelect from "../../Common/Select";
import Button from "../../Common/Button";
import DatePickerComponent from "../../Common/DatePicker";
import { format, formatISO, parseISO } from "date-fns";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { calculateAge } from "../../../helpers/utils";

const FormValidation = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string().required("Email is required").email("Invalid email address"),
    gender: yup.string().required("Required"),
    mobile: yup
        .string()
        .required("Mobile number is required")
        .matches(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    dob: yup.string().required("Required"),
    chss_number: yup.string().required("Required"),
});

// Participant Card Component
export const ParticipantCard = ({ participant }) => {
    return (
        <Grid item xs={12} md={12}>
            <Card
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    mx: "auto",
                    height: { xs: 150, md: 200 },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {participant?.name}
                        </Typography>

                        <Box
                            sx={{
                                mt: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2">Email: </Typography>
                                <Typography variant="body2">{participant?.email}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2">Mobile: </Typography>
                                <Typography variant="body2">{participant?.mobile || "Not provided"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2">Gender: </Typography>
                                <Typography variant="body2">{participant?.gender || "Not provided"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2">Dob: </Typography>
                                <Typography variant="body2">
                                    {participant?.dob
                                        ? format(parseISO(participant?.dob), "dd-MM-yyyy")
                                        : "Not provided"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2">CHSS Number: </Typography>
                                <Typography variant="body2">{participant?.chss_number || "Not provided"}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Grid>
    );
};

// Modified ParticipantForm Component
export const ParticipantForm = ({
    title,
    setNonVerifiedMembers,
    setVerifiedMembers,
    verifiedMembers = [],
    nonVerifiedMembers = [],
    isMember,
    initialData,
    setFormData,
    formData,
    setSelectedCategory,
    setTotalAmountToPay,
    setShowPayButton,
}) => {
    const [prefix, setPrefix] = useState("P-");
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: initialData || {
            secondary_member_id: "",
            member_id: "",
            name: "",
            email: "",
            gender: "",
            mobile: "",
            dob: "",
            chss_number: "",
            is_member: "",
            type: "",
        },
        validationSchema: FormValidation,
        onSubmit: (values, { setSubmitting }) => {
            setNonVerifiedMembers((prev) => [...prev, values]);
            if (!initialData) formik.resetForm();
            setSubmitting(false);
        },
        enableReinitialize: true,
    });

    const handleVerify = async () => {
        try {
            if (formik?.values?.member_id === "") {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Please enter membership ID",
                        severity: "error",
                    }),
                );
                return;
            }

            const response = await axios.get(
                `/members/verify?member_id=${
                    prefix === "S" ? "S" + formik?.values?.member_id : formik?.values?.member_id
                }`,
            );
            if (response.success && response.result) {
                const data = {
                    _id: response.result._id,
                    member_id: response.result.member_id,
                    secondary_member_id: response.result.secondary_member_id,
                    name: response.result.name,
                    email: response.result.email,
                    mobile: response.result.mobile,
                    gender: response.result.gender,
                    chss_number: response.result.chss_number,
                    is_member: "Yes",
                    dob: response.result.dob,
                    type: response.result.type,
                };
                if (!response.result.dob || response.result.dob === "") {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: `${response.result.name} does not have DOB in our records`,
                            severity: "error",
                        }),
                    );
                    return;
                }

                if (
                    verifiedMembers.find(
                        (m) => m.member_id === data.member_id && m.secondary_member_id === data.secondary_member_id,
                    )
                ) {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: "This member is already verified",
                            severity: "error",
                        }),
                    );
                    return;
                }

                setVerifiedMembers((prev) => [...prev, data]);
                dispatch(
                    setSnackBar({
                        open: true,
                        message: `Member verified successfully`,
                        severity: "success",
                    }),
                );
            } else {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: response.message || "Verification failed",
                        severity: "error",
                    }),
                );
            }
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

    const findVerifiedMember = (values) => {
        return (
            verifiedMembers.find((item) => {
                if (values?.secondary_member_id) return item?.secondary_member_id === values?.secondary_member_id;
                else return item?.member_id === values?.member_id;
            }) || null
        );
    };

    const IsMemberComponent = useMemo(() => {
        if (!isMember) return false;

        const verifiedMember = findVerifiedMember(formik?.values, prefix);
        return (
            <Fragment>
                {!verifiedMember ? (
                    <Grid container spacing={1} alignItems="flex-start">
                        <Grid item xs={12} sm={6}>
                            <Input
                                fullWidth
                                label="Membership ID"
                                variant="outlined"
                                size="small"
                                value={formik?.values?.secondary_member_id || formik?.values?.member_id || ""}
                                prefix={prefix}
                                prefixOptions={["P-", "S"]}
                                onPrefixChange={(val) => {
                                    setPrefix(val);
                                    formik.setFieldValue("member_id", ""); // reset ID on prefix change
                                }}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/^P-/, "");
                                    formik.setFieldValue("member_id", value);
                                }}
                                helperText={
                                    prefix === "P-"
                                        ? "Primary member id should be like P-0001"
                                        : "Secondary member id should be like S1-0001"
                                }
                                placeholder={prefix === "P-" ? "00001" : "1-00001"}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleVerify}
                                size="small"
                                sx={{ height: "40px" }} // Match the Input height
                            >
                                Fetch Details
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                            mt: 2,
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={500}>
                                Member Details ({verifiedMember?.secondary_member_id || verifiedMember?.member_id})
                            </Typography>
                            <IconButton
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => {
                                    if (formData.are_you_member === "Yes") {
                                        setVerifiedMembers((prev) =>
                                            prev.filter((item) => {
                                                if (item.secondary_member_id) {
                                                    return (
                                                        item.secondary_member_id !== formik?.values?.secondary_member_id
                                                    );
                                                } else {
                                                    return item.member_id !== formik?.values?.member_id;
                                                }
                                            }),
                                        );
                                    } else {
                                        setNonVerifiedMembers((prev) =>
                                            prev.filter((item) => item.email !== formik?.values?.email),
                                        );
                                    }
                                    setFormData({
                                        ...formData,
                                        are_you_member: "",
                                    });
                                    setSelectedCategory(null);
                                    setTotalAmountToPay(0);
                                    setShowPayButton(false);
                                    formik.resetForm();
                                }}
                            >
                                Clear
                            </IconButton>
                        </Box>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Name:</strong> {verifiedMember?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Mobile:</strong> {verifiedMember?.mobile}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Email:</strong> {verifiedMember?.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Gender:</strong> {verifiedMember?.gender}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Age:</strong>{" "}
                                    {verifiedMember?.dob ? calculateAge(new Date(verifiedMember?.dob)) : "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Fragment>
        );
    }, [isMember, verifiedMembers, formik?.values, handleVerify, prefix, findVerifiedMember, formData]);

    return (
        <Fragment>
            {IsMemberComponent}
            {!isMember && (
                <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {title}
                        </Typography>
                    </Box>

                    {initialData ? (
                        <ParticipantCard participant={initialData} />
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="name"
                                    name="name"
                                    label="Name *"
                                    onChange={formik.handleChange("name")}
                                    value={formik?.values?.name || ""}
                                    error={Boolean(formik?.errors.name)}
                                    helperText={formik?.errors.name}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="mobile"
                                    name="mobile"
                                    label="Mobile"
                                    onChange={formik?.handleChange("mobile")}
                                    value={formik?.values?.mobile || ""}
                                    error={Boolean(formik?.errors.mobile)}
                                    helperText={formik?.errors.mobile}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="email"
                                    name="email"
                                    label="Email"
                                    onChange={formik?.handleChange("email")}
                                    value={formik?.values?.email || ""}
                                    error={Boolean(formik?.errors.email)}
                                    helperText={formik?.errors.email}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BasicSelect
                                    size="small"
                                    value={formik?.values?.gender || "Male"}
                                    onChange={formik?.handleChange("gender")}
                                    displayEmpty
                                    label="Gender"
                                    name="gender"
                                    id="gender"
                                    items={[
                                        { label: "Male", value: "Male" },
                                        { label: "Female", value: "Female" },
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <DatePickerComponent
                                    id={"dob"}
                                    name={"dob"}
                                    label="Date of Birth"
                                    onChange={(val) => formik?.setFieldValue("dob", formatISO(val))}
                                    value={formik?.values?.dob ? new Date(parseISO(formik?.values?.dob)) : null}
                                    fullWidth
                                    onBlur={formik?.handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="chss_number"
                                    name="chss_number"
                                    label="CHSS / ID Card Number"
                                    onChange={formik?.handleChange("chss_number")}
                                    value={formik?.values?.chss_number || ""}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"} gap={1}>
                                <Button type="submit" loading={formik.isSubmitting} onClick={formik.handleSubmit}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Card>
            )}
        </Fragment>
    );
};
