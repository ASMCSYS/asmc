import { CloseOutlined, DownloadOutlined } from "@mui/icons-material";
import {
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import { Formik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import Input from "./Input";
import Button from "./Button";
import { CommonFileUploadToServer } from "./CommonFileUploadToServer";
import BasicSelect from "./Select";
import StyledTextarea from "./StyledTextarea";
import { UploadFile } from "./UploadFile";
import DatePickerComponent from "./DatePicker";
import { formatISO, parseISO } from "date-fns";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../store/common/commonSlice";
import { useUpdateOfflinePaymentMutation } from "../../store/members/membersApis";

export const paymentValidation = yup.object().shape({
    amount_paid: yup.number().required("Required"),
    payment_mode: yup.string().required("Required"),
    remarks: yup.string().required("Required"),
});

export const OfflinePaymentModal = ({ data, show, close, refetch = () => {} }) => {
    const dispatch = useDispatch();

    const [updatePayment] = useUpdateOfflinePaymentMutation();

    const submit = async (values) => {
        try {
            await updatePayment(values).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: "Payment details submitted successfully",
                    severity: "success",
                }),
            );
            close();
            refetch();
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
        <Dialog
            open={show}
            onClose={() => {
                close();
            }}
            maxWidth="sm"
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" style={{ display: "flex", justifyContent: "space-between" }}>
                    Enter Recevied Payment Details
                </Typography>
                <IconButton onClick={close}>
                    <CloseOutlined />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={data}
                    onSubmit={(values) => submit(values)}
                    validationSchema={paymentValidation}
                    enableReinitialize
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                        <Grid sx={{ display: "flex" }} container direction={"column"} width={"100%"} height={"100%"}>
                            <Grid flex={1} overflow={"auto"}>
                                <Grid container spacing={2} pt={2}>
                                    <Grid item xs={12} md={12}>
                                        <Input
                                            id="amount_paid"
                                            name="amount_paid"
                                            label="Enter Amount Received *"
                                            onChange={handleChange("amount_paid")}
                                            value={values?.amount_paid}
                                            error={Boolean(errors.amount_paid)}
                                            helperText={errors.amount_paid}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <UploadFile
                                            name="payment_file"
                                            onChange={(val) => setFieldValue("payment_file", val)}
                                            value={values?.payment_file || ""}
                                            labelSecondary="Attach screenshot of payment"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <BasicSelect
                                            size="small"
                                            value={values?.payment_mode || "Cheque"}
                                            onChange={handleChange("payment_mode")}
                                            displayEmpty
                                            label="Select Payment Mode"
                                            name="payment_mode"
                                            id="payment_mode"
                                            items={[
                                                { label: "Cheque", value: "Cheque" },
                                                { label: "Netbanking", value: "Netbanking" },
                                                { label: "UPI", value: "UPI" },
                                                { label: "G-Pay", value: "G-Pay" },
                                                { label: "Phone-Pe", value: "Phone-Pe" },
                                                { label: "Others", value: "Others" },
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <DatePickerComponent
                                            id={"createdAt"}
                                            name={"createdAt"}
                                            label="Payment Received"
                                            onChange={(val) => setFieldValue("createdAt", formatISO(val))}
                                            value={values?.createdAt ? new Date(parseISO(values?.createdAt)) : null}
                                            fullWidth
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <StyledTextarea
                                            id="remarks"
                                            name="remarks"
                                            label="Remarks (Enter who recevied payment and other details) *"
                                            onChange={handleChange("remarks")}
                                            value={values?.remarks || ""}
                                            error={Boolean(errors.remarks)}
                                            helperText={errors.remarks}
                                            fullWidth
                                            minRows={2}
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
            </DialogContent>
        </Dialog>
    );
};
