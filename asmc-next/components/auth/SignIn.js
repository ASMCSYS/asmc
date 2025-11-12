import { Formik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { Fragment, useState } from "react";
import { toast_popup } from "@/utils/toast";
import { login } from "@/apis/auth.api";
import { addNewCookie } from "@/utils/helper";
import { InputBox } from "../common/InputBox";
import { CommonModal } from "../common/Modal";
import { TermsConditionModal } from "../common/TermsConditionModal";

const formValidation = yup.object().shape({
    email: yup.string().required("Required"),
    password: yup.string().required("Required"),
});

export const SignInForm = () => {
    const [showModal, setShowModal] = useState(false);
    const initialValues = {
        email: "",
        password: "",
    };

    const handleLogin = async () => {
        window.location.href = "/dashboard";
    };

    const onFormSubmit = async (values) => {
        try {
            const res = await login(values);
            if (res && res.success) {
                addNewCookie("token", res.result.token);
                setShowModal(true);
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => onFormSubmit(values)}
            validationSchema={formValidation}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                <Fragment>
                    <div className="input-single">
                        <label for="authEmailIn">Enter Your Email ID</label>
                        <input
                            type="email"
                            name="email"
                            id="authEmailIn"
                            required=""
                            placeholder="Your email ID here"
                            onChange={handleChange("email")}
                            value={values.email}
                        />
                        {errors?.email && <span className="help-block with-errors">{errors.email}</span>}
                    </div>
                    <div className="input-single">
                        <InputBox
                            type="password"
                            name="password"
                            label="Password"
                            onChange={handleChange("password")}
                            values={values?.password || ""}
                            errors={errors?.password}
                        />
                    </div>
                    <p className="forget secondary-text">
                        <Link href={"/forgot-password"}>Forgot Password?</Link>
                    </p>
                    <div className="section__cta text-start">
                        <button type="submit" className="cmn-button" onClick={() => handleSubmit()}>
                            Sign In
                        </button>
                    </div>
                    <CommonModal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        children={<TermsConditionModal handleAgree={() => handleLogin(values)} />}
                    />
                </Fragment>
            )}
        </Formik>
    );
};
