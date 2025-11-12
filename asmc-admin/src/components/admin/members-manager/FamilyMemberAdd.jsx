import { Formik } from "formik";
import { FamilyMembersValidation } from "./MembersValidation";
import { FormControlLabel, Grid, Radio, Typography, Switch } from "@mui/material";
import Input from "../../Common/Input";
import BasicSelect from "../../Common/Select";
import Button from "../../Common/Button";
import DatePickerComponent from "../../Common/DatePicker";
import { formatISO, parseISO } from "date-fns";
import { useState } from "react";
import AutoCompleteSelect from "../../Common/AutoCompleteSelect";
import { sizeValues } from "../../../helpers/constants";
import { isAuth } from "../../../helpers/cookies";
import { Fragment } from "react";
import { format } from "date-fns";
import { CommonFileUploadToServer } from "../../Common/CommonFileUploadToServer";

export const FamilyMemberAdd = ({ familyMemberInitalval, submit, plansData }) => {
    const { roles } = isAuth();
    const [selectedPlan, setSelectedPlan] = useState(familyMemberInitalval?.plans || null);

    return (
        <Formik
            initialValues={familyMemberInitalval}
            onSubmit={(values) => submit(values)}
            validationSchema={FamilyMembersValidation}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                <Grid sx={{ display: "flex" }} container direction={"column"} width={"100%"} height={"100%"}>
                    <Grid flex={1} px={2} py={2} overflow={"auto"}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <CommonFileUploadToServer
                                    name="profile"
                                    onChange={(val) => setFieldValue("profile", val)}
                                    value={values?.profile || ""}
                                    label="Profile (300 X 300 in pixels)"
                                    error={Boolean(errors.profile)}
                                    helperText={errors.profile}
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
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="mobile"
                                    name="mobile"
                                    label="Mobile"
                                    onChange={handleChange("mobile")}
                                    value={values?.mobile || ""}
                                    error={Boolean(errors.mobile)}
                                    helperText={errors.mobile}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="email"
                                    name="email"
                                    label="Email"
                                    onChange={handleChange("email")}
                                    value={values?.email || ""}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BasicSelect
                                    size="small"
                                    value={values?.gender || "Male"}
                                    onChange={handleChange("gender")}
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
                                    onChange={(val) => setFieldValue("dob", formatISO(val))}
                                    value={values?.dob ? new Date(parseISO(values?.dob)) : null}
                                    fullWidth
                                    onBlur={handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="relation"
                                    name="relation"
                                    label="Relation"
                                    onChange={handleChange("relation")}
                                    value={values?.relation || ""}
                                    error={Boolean(errors.relation)}
                                    helperText={errors.relation}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BasicSelect
                                    size="small"
                                    value={values?.is_dependent}
                                    onChange={(val) => setFieldValue("is_dependent", val.target.value)}
                                    displayEmpty
                                    label="Is Dependent Member"
                                    name="is_dependent"
                                    id="is_dependent"
                                    items={[
                                        { label: "Yes", value: true },
                                        { label: "No", value: false },
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values?.active !== false}
                                            onChange={(e) => setFieldValue("active", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Member Active Status"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Input
                                    id="card_number"
                                    name="card_number"
                                    label="CHSS / ID Card Number"
                                    onChange={handleChange("card_number")}
                                    value={values?.card_number || ""}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                {console.log(plansData, "plansDataplansData")}
                                <AutoCompleteSelect
                                    id="plan_select-autocomplete"
                                    options={plansData || []}
                                    label="Select Plan"
                                    onChange={(e, val) => {
                                        setSelectedPlan(val);
                                        setFieldValue("plans", val);
                                    }}
                                    value={selectedPlan}
                                    name="plan_id"
                                    keyname="plan_name"
                                    disableCloseOnSelect={false}
                                    disabled={roles !== "super" && selectedPlan ? true : false}
                                />
                            </Grid>

                            {selectedPlan && roles === "super" && (
                                <Fragment>
                                    <Grid item xs={12} md={6}>
                                        <DatePickerComponent
                                            id="plan_start_date"
                                            name="plan_start_date"
                                            label="Plan Start Date"
                                            onChange={(val) => {
                                                if (val) {
                                                    const newPlan = { ...selectedPlan };
                                                    newPlan.start_date = format(val, "dd/MM/yyyy");
                                                    setSelectedPlan(newPlan);
                                                    setFieldValue("plans", newPlan);
                                                }
                                            }}
                                            value={
                                                selectedPlan?.start_date
                                                    ? parseISO(selectedPlan.start_date.split("/").reverse().join("-"))
                                                    : null
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DatePickerComponent
                                            id="plan_end_date"
                                            name="plan_end_date"
                                            label="Plan End Date"
                                            onChange={(val) => {
                                                if (val) {
                                                    const newPlan = { ...selectedPlan };
                                                    newPlan.end_date = format(val, "dd/MM/yyyy");
                                                    setSelectedPlan(newPlan);
                                                    setFieldValue("plans", newPlan);
                                                }
                                            }}
                                            value={
                                                selectedPlan?.end_date
                                                    ? parseISO(selectedPlan.end_date.split("/").reverse().join("-"))
                                                    : null
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                </Fragment>
                            )}

                            {roles === "super" && (
                                <Fragment>
                                    <Grid item xs={12} md={6}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.fees_paid ? "true" : "false"}
                                            onChange={(e) => setFieldValue("fees_paid", e.target.value === "true")}
                                            displayEmpty
                                            label="Fees Paid"
                                            name="fees_paid"
                                            id="fees_paid"
                                            items={[
                                                { label: "Yes", value: "true" },
                                                { label: "No", value: "false" },
                                            ]}
                                        />
                                    </Grid>
                                </Fragment>
                            )}

                            <Grid item xs={12} md={12}>
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
                            <Grid item xs={12} md={12}>
                                <Typography variant="subtitle1">Clothing Type</Typography>
                                <Grid container spacing={2}>
                                    <Grid item>
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
                                    <Grid item>
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
                                </Grid>
                            </Grid>
                            {values.clothing_type && (
                                <Grid item xs={12} md={12}>
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
                                    />
                                </Grid>
                            )}
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
                                    multiline
                                    rows={3}
                                    maxRows={4}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Input
                                    id="no_of_card_issued"
                                    name="no_of_card_issued"
                                    label="Number Of Time Card Issued"
                                    onChange={handleChange("no_of_card_issued")}
                                    value={values?.no_of_card_issued || ""}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                                <Button
                                    size="large"
                                    type="submit"
                                    fullWidth={false}
                                    loading={false}
                                    onClick={() => handleSubmit()}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Formik>
    );
};
