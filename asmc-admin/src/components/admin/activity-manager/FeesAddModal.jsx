import { Formik } from "formik"
import { feesAddValidation } from "./ActivityValidation"
import { Grid } from "@mui/material"
import Input from "../../Common/Input"
import Button from "../../Common/Button"
import AutoCompleteSelect from "../../Common/AutoCompleteSelect"
import { useGetActivePlansListQuery } from "../../../store/plans/plansApis"
import { Fragment, useEffect, useState } from "react"

export const FeesAddModal = ({ feesInitalval, submit, type }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { data: plansData } = useGetActivePlansListQuery({ plan_type: type });

    useEffect(() => {
        if (feesInitalval?.plan_id && plansData && plansData.length > 0) {
            const foundRec = plansData.find((obj) => obj.plan_id === feesInitalval.plan_id);
            setSelectedPlan(foundRec);
        }
    }, [feesInitalval, plansData])

    const handlePlanSelect = (data, setFieldValue) => {
        setSelectedPlan(data);
        if (data?.plan_id) {
            setFieldValue("plan_id", data.plan_id);
            setFieldValue("plan_name", data.plan_name);
            setFieldValue("plan_type", data.plan_type);
            setFieldValue("member_price", data.amount);
            setFieldValue("dependent_member_price", data.dependent_member_price);
            setFieldValue("non_member_price", data.non_member_price);
            setFieldValue("plan_timeline", data.plan_timeline);
            setFieldValue("start_month", data.start_month);
            setFieldValue("end_month", data.end_month);
            setFieldValue("batch_hours", data.batch_hours);
        }
    }

    return (
        <Formik
            initialValues={feesInitalval}
            onSubmit={(values) => submit(values)}
            validationSchema={feesAddValidation}
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
                <Grid sx={{ display: "flex" }} container direction={"column"} width={"100%"} height={"100%"}>
                    <Grid flex={1} px={2} py={2} overflow={"auto"}>
                        <Grid container spacing={2} >
                            <Grid item xs={12} md={12}>
                                <AutoCompleteSelect
                                    id="plan_select-autocomplete"
                                    options={plansData || []}
                                    label="Select Plan"
                                    onChange={(e, val) => handlePlanSelect(val, setFieldValue)}
                                    value={selectedPlan}
                                    name="plan_id"
                                    keyname="plan_name"
                                    disableCloseOnSelect={false}
                                    error={Boolean(errors.plan_id)}
                                    helperText={errors.plan_id}
                                />
                            </Grid>
                            {
                                type === "enrollment" && (
                                    <Fragment>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id='member_price'
                                                name="member_price"
                                                label="Member Price *"
                                                onChange={handleChange("member_price")}
                                                value={values?.member_price}
                                                error={Boolean(errors.member_price)}
                                                helperText={errors.member_price}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id='dependent_member_price'
                                                name="dependent_member_price"
                                                label="Dependent Member Price"
                                                onChange={handleChange("dependent_member_price")}
                                                value={values?.dependent_member_price}
                                                error={Boolean(errors.dependent_member_price)}
                                                helperText={errors.dependent_member_price}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id='non_member_price'
                                                name="non_member_price"
                                                label="Non Member Price"
                                                onChange={handleChange("non_member_price")}
                                                value={values?.non_member_price}
                                                error={Boolean(errors.non_member_price)}
                                                helperText={errors.non_member_price}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id='member_price_with_ac'
                                                name="member_price_with_ac"
                                                label="Member Price With AC"
                                                onChange={handleChange("member_price_with_ac")}
                                                value={values?.member_price_with_ac}
                                                error={Boolean(errors.member_price_with_ac)}
                                                helperText={errors.member_price_with_ac}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id='non_member_price_with_ac'
                                                name="non_member_price_with_ac"
                                                label="Non Member Price With AC"
                                                onChange={handleChange("non_member_price_with_ac")}
                                                value={values?.non_member_price_with_ac}
                                                error={Boolean(errors.non_member_price_with_ac)}
                                                helperText={errors.non_member_price_with_ac}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Fragment>
                                )
                            }


                            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                                <Button size="large" type="submit" fullWidth={false} loading={false} onClick={() => handleSubmit()}>Save</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Formik>
    )
}