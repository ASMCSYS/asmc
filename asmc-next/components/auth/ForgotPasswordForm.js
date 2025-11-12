import { Formik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { Fragment, useState } from "react";
import { toast_popup } from "@/utils/toast";
import { login, resetPassword, sendResetPasswordOtp } from "@/apis/auth.api";
import { addNewCookie } from "@/utils/helper";
import { InputBox } from "../common/InputBox";

const EmailValidation = yup.object().shape({
    email: yup.string().required("Required"),
});

const PasswordValidation = yup.object().shape({
    otp: yup.string().required("Required"),
    new_password: yup.string().required("Required"),
    confirm_password: yup.string().required("Required"),
});

export const ForgotPasswordForm = () => {
    const [otpSent, setOtpSent] = useState(false);

    const initialValues = {
        email: "",
        otp: "",
        new_password: "",
        confirm_password: "",
    };

    const onSendOtp = async (values) => {
        try {
            const res = await sendResetPasswordOtp({ email: values.email });
            if (res && res.success) {
                setOtpSent(true);
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    const changePassword = async (values) => {
        try {
            const res = await resetPassword(values);
            if (res && res.success) {
                toast_popup(res?.message, "success");
                // redirect after 2 sec
                setTimeout(() => {
                    window.location.href = "/sign-in";
                }, 2000);
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    const onFormSubmit = async (values) => {
        if (otpSent) {
            changePassword(values);
        } else {
            onSendOtp(values);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={otpSent ? PasswordValidation : EmailValidation}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                <Fragment>
                    <div className="input-single">
                        <label for="authEmailIn">Enter Your Email ID</label>
                        <InputBox
                            type="email"
                            name="email"
                            onChange={handleChange("email")}
                            values={values?.email || ""}
                            errors={errors?.email}
                            disabled={otpSent}
                        />
                    </div>
                    {otpSent && (
                        <div className="input-single">
                            <label for="authEmailIn">Enter OTP</label>
                            <InputBox
                                type="text"
                                name="otp"
                                onChange={handleChange("otp")}
                                values={values?.otp || ""}
                                errors={errors?.otp}
                            />
                        </div>
                    )}
                    {otpSent && (
                        <div className="input-single">
                            <label for="authEmailIn">Enter New Password</label>
                            <InputBox
                                type="password"
                                name="new_password"
                                onChange={handleChange("new_password")}
                                values={values?.new_password || ""}
                                errors={errors?.new_password}
                            />
                        </div>
                    )}
                    {otpSent && (
                        <div className="input-single">
                            <label for="authEmailIn">Enter Confirm Password</label>
                            <InputBox
                                type="password"
                                name="confirm_password"
                                onChange={handleChange("confirm_password")}
                                values={values?.confirm_password || ""}
                                errors={errors?.confirm_password}
                            />
                        </div>
                    )}
                    <div className="section__cta text-start">
                        <button type="submit" className="cmn-button" onClick={() => handleSubmit()}>
                            {otpSent ? "Verify & Change Password" : "Send OTP"}
                        </button>
                    </div>
                </Fragment>
            )}
        </Formik>
    );
};
