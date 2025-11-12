import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { MembersValidation } from "./MembersValidation";
import {
    Chip,
    Box,
    Card,
    CardContent,
    Drawer,
    FormControlLabel,
    Grid,
    Switch,
    Typography,
    FormControl,
    Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { useAddNewMembersMutation, useUpdateMembersMutation } from "../../../store/members/membersApis";
import BasicSelect from "../../Common/Select";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";
import CommonModal from "../../Common/CommonModal";
import { FamilyMemberAdd } from "./FamilyMemberAdd";
import { format, formatISO, parseISO } from "date-fns";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";

import { useGetActivePlansListQuery } from "../../../store/plans/plansApis";
import AutoCompleteSelect from "../../Common/AutoCompleteSelect";
import { calculatePlanAmount, getMonthNameByNumber } from "../../../helpers/utils";
import DatePickerComponent from "../../Common/DatePicker";
import { setSnackBar } from "../../../store/common/commonSlice";
import { sizeValues } from "../../../helpers/constants";
import { isAuth } from "../../../helpers/cookies";

const initialFamilyData = {
    name: "",
    email: "",
    gender: "Male",
    mobile: "",
    dob: "",
    relation: "",
    is_dependent: true,
    no_of_card_issued: "0",
    active: true,
    fees_paid: false,
    fees_verified: false,
};

export const MembersAddDrawer = ({ initialValues, show, close, formType }) => {
    const dispatch = useDispatch();
    const { roles } = isAuth();
    const [addNewMembers, { isLoading: addMembersLoading }] = useAddNewMembersMutation();
    const [updateMembers, { isLoading: updateMembersLoading }] = useUpdateMembersMutation();

    const [showModal, setShowModal] = useState(false);
    const [familyMemberInitalval, setFamilyMemberInitalval] = useState(initialFamilyData);
    const [familyEditKey, setFamilyEditKey] = useState(false);
    const [familyMemberData, setFamilyMemberData] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    console.log(selectedPlan, "selectedPlanselectedPlanselectedPlan");

    useEffect(() => {
        setFamilyMemberData(initialValues?.family_details || []);
        setSelectedPlan(initialValues?.current_plan || null);
    }, [initialValues?.current_plan, initialValues.family_details]);

    const { data: plansData } = useGetActivePlansListQuery({ plan_type: "membership" }, { skip: !show });
    const disabled = formType === "View" ? true : false;

    const onFormSubmit = async (values) => {
        try {
            let payload = { ...values };

            const planData = {
                ...initialValues?.current_plan,
                plan_id: selectedPlan?.plan_id,
                plan_name: selectedPlan?.plan_name,
                amount: selectedPlan?.amount,
                start_month: selectedPlan?.start_month,
                end_month: selectedPlan?.end_month,
                dependent_member_price: selectedPlan?.dependent_member_price,
                non_dependent_member_price: selectedPlan?.non_dependent_member_price,
                final_amount: selectedPlan ? calculatePlanAmount(selectedPlan, familyMemberData) : 0,
            };

            if (selectedPlan?.start_date && selectedPlan?.end_date) {
                planData.start_date = selectedPlan?.start_date;
                planData.end_date = selectedPlan?.end_date;
            } else {
                delete planData.start_date;
                delete planData.end_date;
            }

            payload.current_plan = selectedPlan ? planData : null;
            payload.family_details = familyMemberData;
            payload.dob = values?.dob ? formatISO(values?.dob) : "";

            if (formType === "Edit") {
                delete payload.last_payment_date;
                await updateMembers(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Members updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewMembers(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Members created successfully",
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

    const handleAddFamilyMember = () => {
        setShowModal(true);
        setFamilyMemberInitalval(initialFamilyData);
        setFamilyEditKey(false);
    };

    const handleDeleteFamilyMember = (data, key) => {
        let oldData = JSON.parse(JSON.stringify(familyMemberData));
        oldData.splice(key, 1);
        setFamilyMemberData(oldData);
    };

    const handleEditFamilyMember = (data, key) => {
        setFamilyEditKey(key);
        setFamilyMemberInitalval(data);
        setShowModal(true);
    };

    const FamilyMemberComponent = () => {
        const onFamilySubmit = (val) => {
            let oldData = JSON.parse(JSON.stringify(familyMemberData));

            console.log(val, "valvalval");

            if (familyEditKey !== false) {
                oldData[familyEditKey] = val;
            } else {
                oldData.push(val);
            }
            setFamilyMemberData(oldData);
            setFamilyMemberInitalval(initialFamilyData);
            setFamilyEditKey(false);
            setShowModal(false);
        };

        return (
            <FamilyMemberAdd
                familyMemberInitalval={familyMemberInitalval}
                submit={onFamilySubmit}
                plansData={plansData}
            />
        );
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={MembersValidation}
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
                                <Typography variant="h6">{formType} Members</Typography>
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
                                        error={Boolean(errors.profile)}
                                        helperText={errors.profile}
                                        disabled={disabled}
                                        width={300}
                                        height={300}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="name"
                                        name="name"
                                        label="Name *"
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
                                        id="mobile"
                                        name="mobile"
                                        label="Mobile / Whatsapp No. *"
                                        onChange={handleChange("mobile")}
                                        value={values?.mobile || ""}
                                        error={Boolean(errors.mobile)}
                                        helperText={errors.mobile}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="alternate_mobile"
                                        name="alternate_mobile"
                                        label="Alternate Mobile"
                                        onChange={handleChange("alternate_mobile")}
                                        value={values?.alternate_mobile || ""}
                                        error={Boolean(errors.alternate_mobile)}
                                        helperText={errors.alternate_mobile}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="email"
                                        name="email"
                                        label="Email *"
                                        onChange={handleChange("email")}
                                        value={values?.email || ""}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.gender}
                                        onChange={handleChange("gender")}
                                        displayEmpty
                                        label="Gender"
                                        name="gender"
                                        id="gender"
                                        items={[
                                            { label: "Male", value: "Male" },
                                            { label: "Female", value: "Female" },
                                        ]}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <DatePickerComponent
                                        id={"dob"}
                                        name={"dob"}
                                        label="Date of Birth"
                                        onChange={(val) => setFieldValue("dob", val)}
                                        value={values?.dob}
                                        fullWidth
                                        onBlur={handleBlur}
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
                                        error={Boolean(errors.status)}
                                        helperText={errors.status}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="chss_number"
                                        name="chss_number"
                                        label="CHSS Number"
                                        onChange={handleChange("chss_number")}
                                        value={values?.chss_number || ""}
                                        error={Boolean(errors.chss_number)}
                                        helperText={errors.chss_number}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="non_chss_number"
                                        name="non_chss_number"
                                        label="Non-CHSS Number"
                                        onChange={handleChange("non_chss_number")}
                                        value={values?.non_chss_number || ""}
                                        error={Boolean(errors.non_chss_number)}
                                        helperText={errors.non_chss_number}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <CommonFileUploadToServer
                                        name="chss_card_link"
                                        onChange={(val) => setFieldValue("chss_card_link", val)}
                                        value={values?.chss_card_link || ""}
                                        label="CHSS Card Photo"
                                        error={Boolean(errors.chss_card_link)}
                                        helperText={errors.chss_card_link}
                                        fileTypes={["pdf", "jpeg", "jpg", "png"]}
                                        disabled={disabled}
                                        width={600}
                                        height={400}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Input
                                        id="address"
                                        name="address"
                                        label="Address"
                                        onChange={handleChange("address")}
                                        value={values?.address || ""}
                                        error={Boolean(errors.address)}
                                        helperText={errors.address}
                                        fullWidth
                                        disabled={disabled}
                                        multiline
                                        rows={3}
                                        maxRows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.tshirt_size || ""}
                                        onChange={handleChange("tshirt_size")}
                                        displayEmpty
                                        label="T-shirt Size"
                                        name="tshirt_size"
                                        id="tshirt_size"
                                        items={sizeValues.map((e) => ({
                                            label: e,
                                            value: e,
                                        }))}
                                        error={Boolean(errors.tshirt_size)}
                                        helperText={errors.tshirt_size}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="tshirt_name"
                                        name="tshirt_name"
                                        label="Name on Tshirt"
                                        onChange={handleChange("tshirt_name")}
                                        value={values?.tshirt_name || ""}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle1">Clothing Type</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={values.clothing_type === "Shorts"}
                                                        onChange={() => {
                                                            setFieldValue("clothing_type", "Shorts");
                                                            setFieldValue("clothing_size", ""); // Reset size on type change
                                                        }}
                                                        value="Shorts"
                                                    />
                                                }
                                                label="Shorts"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={values.clothing_type === "Track Pants"}
                                                        onChange={() => {
                                                            setFieldValue("clothing_type", "Track Pants");
                                                            setFieldValue("clothing_size", ""); // Reset size on type change
                                                        }}
                                                        value="Track Pants"
                                                    />
                                                }
                                                label="Track Pants"
                                            />
                                        </Grid>
                                        {values.clothing_type && (
                                            <Grid item xs={12} md={4}>
                                                <BasicSelect
                                                    size="small"
                                                    value={values?.clothing_size || ""}
                                                    onChange={handleChange("clothing_size")}
                                                    displayEmpty
                                                    label={`${values.clothing_type} Size`}
                                                    name="clothing_size"
                                                    id="clothing_size"
                                                    items={sizeValues.map((e) => ({
                                                        label: e,
                                                        value: e,
                                                    }))}
                                                    error={Boolean(errors.clothing_size)}
                                                    helperText={errors.clothing_size}
                                                    disabled={!values.clothing_type}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Input
                                        id="instruction"
                                        name="instruction"
                                        label="Health Instruction"
                                        onChange={handleChange("instruction")}
                                        value={values?.instruction || ""}
                                        error={Boolean(errors.instruction)}
                                        helperText={errors.instruction}
                                        fullWidth
                                        disabled={disabled}
                                        multiline
                                        rows={3}
                                        maxRows={4}
                                    />
                                </Grid>

                                {formType !== "Add" && (
                                    <Fragment>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                label="Member Status *"
                                                value={values?.member_status || ""}
                                                fullWidth
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                label="Number Of Time Card Issued"
                                                value={values?.no_of_card_issued || ""}
                                                fullWidth
                                                onChange={(e) => setFieldValue("no_of_card_issued", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {roles === "super" ? (
                                                <BasicSelect
                                                    size="small"
                                                    value={values?.fees_paid ? "true" : "false"}
                                                    onChange={(e) => {
                                                        setFieldValue("fees_paid", e.target.value === "true");
                                                        setFieldValue("fees_verified", e.target.value === "true");
                                                    }}
                                                    displayEmpty
                                                    label="Fees Paid *"
                                                    name="fees_paid"
                                                    id="fees_paid"
                                                    items={[
                                                        { label: "Yes", value: "true" },
                                                        { label: "No", value: "false" },
                                                    ]}
                                                    error={Boolean(errors.fees_paid)}
                                                    helperText={errors.fees_paid}
                                                />
                                            ) : (
                                                <Input
                                                    label="Fees Paid *"
                                                    value={values?.fees_paid ? "Yes" : "No"}
                                                    fullWidth
                                                    disabled={true}
                                                />
                                            )}
                                        </Grid>
                                        {roles === "super" && selectedPlan && (
                                            <Fragment>
                                                <Grid item xs={12} md={6}>
                                                    <DatePickerComponent
                                                        id="plan_start_date"
                                                        name="plan_start_date"
                                                        label="Plan Start Date"
                                                        onChange={(val) => {
                                                            console.log(val, "valvalval");
                                                            const newPlan = { ...selectedPlan };
                                                            newPlan.start_date = val ? format(val, "dd/MM/yyyy") : null;
                                                            setSelectedPlan(newPlan);
                                                        }}
                                                        value={
                                                            selectedPlan?.start_date
                                                                ? parseISO(
                                                                      selectedPlan.start_date
                                                                          .split("/")
                                                                          .reverse()
                                                                          .join("-"),
                                                                  )
                                                                : null
                                                        }
                                                        fullWidth
                                                        disabled={disabled}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DatePickerComponent
                                                        id="plan_end_date"
                                                        name="plan_end_date"
                                                        label="Plan End Date"
                                                        onChange={(val) => {
                                                            console.log(val, "valvalval");
                                                            const newPlan = { ...selectedPlan };
                                                            newPlan.end_date = val ? format(val, "dd/MM/yyyy") : null;
                                                            setSelectedPlan(newPlan);
                                                        }}
                                                        value={
                                                            selectedPlan?.end_date
                                                                ? parseISO(
                                                                      selectedPlan.end_date
                                                                          .split("/")
                                                                          .reverse()
                                                                          .join("-"),
                                                                  )
                                                                : null
                                                        }
                                                        fullWidth
                                                        disabled={disabled}
                                                    />
                                                </Grid>
                                            </Fragment>
                                        )}
                                    </Fragment>
                                )}
                                <Grid item xs={12} md={6}>
                                    <AutoCompleteSelect
                                        id="plan_select-autocomplete"
                                        options={plansData || []}
                                        label="Select Plan"
                                        onChange={(e, val) => setSelectedPlan(val)}
                                        value={selectedPlan}
                                        name="plan_id"
                                        keyname="plan_name"
                                        disabled={formType === "Edit" && roles !== "super" ? true : disabled}
                                        disableCloseOnSelect={false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {selectedPlan && (
                                        <Fragment>
                                            <Box
                                                sx={{
                                                    maxWidth: "20rem",
                                                    border: "1px solid #cacaca",
                                                }}
                                                borderRadius={2}
                                                p={2}
                                            >
                                                <Typography variant="h6">Plan Details</Typography>
                                                <Typography variant="subtitle2">
                                                    Plan Name: {selectedPlan?.plan_name}
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    Amount: {selectedPlan?.amount} Rs.
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    Start Month: {getMonthNameByNumber(selectedPlan?.start_month)}
                                                </Typography>
                                                <Typography variant="subtitle2">
                                                    End Month: {getMonthNameByNumber(selectedPlan?.end_month)}
                                                </Typography>
                                                {/* <Typography variant="subtitle2">
                                                        Dependent Member Price : {selectedPlan?.dependent_member_price} Rs.
                                                    </Typography>
                                                    <Typography variant="subtitle2">
                                                        Non Dependent Member Price : {selectedPlan?.non_dependent_member_price} Rs.
                                                    </Typography> */}
                                                <Typography variant="h6">
                                                    Total Amount: {selectedPlan?.amount} Rs.
                                                </Typography>
                                            </Box>
                                        </Fragment>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControlLabel
                                        disabled={disabled}
                                        control={<Switch checked={values?.is_family_user || false} />}
                                        label="Is Family User"
                                        onChange={(e) => setFieldValue("is_family_user", e.target.checked)}
                                    />
                                </Grid>
                                {values?.is_family_user && (
                                    <Grid item xs={12} md={12}>
                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            display={"flex"}
                                            gap={2}
                                            flexDirection={"row"}
                                            alignItems={"center"}
                                        >
                                            <Typography variant="h6">Family Details</Typography>
                                            <IconButtonIcons
                                                disabled={disabled}
                                                size="small"
                                                color="info"
                                                onClick={() => handleAddFamilyMember()}
                                                IconComponent={AddIcon}
                                            />
                                        </Grid>
                                        {familyMemberData && familyMemberData.length > 0 ? (
                                            <Fragment>
                                                <Grid item xs={12} md={12}>
                                                    <Grid container spacing={2}>
                                                        {familyMemberData.map((obj, key) => {
                                                            return (
                                                                <Grid item xs={3} key={key}>
                                                                    <Card
                                                                        variant="outlined"
                                                                        sx={{
                                                                            position: "relative",
                                                                        }}
                                                                    >
                                                                        <CardContent>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                }}
                                                                                color="text.secondary"
                                                                                gutterBottom
                                                                            >
                                                                                {obj.relation}
                                                                            </Typography>
                                                                            <Typography variant="h5" component="div">
                                                                                {obj.name}
                                                                            </Typography>
                                                                            <Typography
                                                                                sx={{
                                                                                    mb: 1.5,
                                                                                }}
                                                                                color="text.secondary"
                                                                            >
                                                                                {obj.dob
                                                                                    ? format(
                                                                                          new Date(parseISO(obj.dob)),
                                                                                          "dd MMM,yyyy",
                                                                                      )
                                                                                    : null}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                ID: {obj?.id}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                {obj?.mobile}
                                                                                <br />
                                                                                {obj?.email}
                                                                                <br />
                                                                                {obj?.is_dependent
                                                                                    ? "Dependent"
                                                                                    : "Non-dependent"}
                                                                            </Typography>
                                                                            {obj?.plans && (
                                                                                <Fragment>
                                                                                    <Typography variant="body2">
                                                                                        <strong>Plan</strong>:{" "}
                                                                                        {obj?.plans?.plan_name}
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        <strong>Amount</strong>:{" "}
                                                                                        {obj?.is_dependent
                                                                                            ? obj?.plans
                                                                                                  ?.dependent_member_price
                                                                                            : obj?.plans
                                                                                                  ?.non_dependent_member_price}
                                                                                    </Typography>
                                                                                </Fragment>
                                                                            )}
                                                                            <Box
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    right: 0,
                                                                                    top: 0,
                                                                                }}
                                                                            >
                                                                                {/* Active Status Chip */}
                                                                                <Box
                                                                                    sx={{
                                                                                        position: "absolute",
                                                                                        right: 40,
                                                                                        top: 8,
                                                                                    }}
                                                                                >
                                                                                    <Chip
                                                                                        size="small"
                                                                                        label={
                                                                                            obj?.active
                                                                                                ? "Active"
                                                                                                : "Inactive"
                                                                                        }
                                                                                        color={
                                                                                            obj?.active
                                                                                                ? "success"
                                                                                                : "error"
                                                                                        }
                                                                                        variant="outlined"
                                                                                    />
                                                                                </Box>
                                                                                {/* {obj?.fees_paid ? (
                                                                                    
                                                                                ) : (
                                                                                    <Chip
                                                                                        color="error"
                                                                                        label="Not Paid"
                                                                                    />
                                                                                )} */}
                                                                                <IconButtonIcons
                                                                                    disabled={disabled}
                                                                                    color="info"
                                                                                    title="Edit"
                                                                                    IconComponent={EditOutlined}
                                                                                    onClick={() =>
                                                                                        handleEditFamilyMember(obj, key)
                                                                                    }
                                                                                />
                                                                                {/* <IconButtonIcons
                                                                                    disabled={disabled}
                                                                                    color="error"
                                                                                    title="Delete"
                                                                                    IconComponent={DeleteOutline}
                                                                                    onClick={() =>
                                                                                        handleDeleteFamilyMember(
                                                                                            obj,
                                                                                            key,
                                                                                        )
                                                                                    }
                                                                                /> */}
                                                                            </Box>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Grid>
                                            </Fragment>
                                        ) : null}
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
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Button size="large" color="warning" type="button" onClick={() => close()}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="large"
                                            type="submit"
                                            loading={addMembersLoading || updateMembersLoading}
                                            onClick={() => handleSubmit()}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}

                        <CommonModal
                            show={showModal}
                            close={() => setShowModal(false)}
                            title="Add Family Member"
                            child_component={<FamilyMemberComponent />}
                        />
                    </Grid>
                </Drawer>
            )}
        </Formik>
    );
};
