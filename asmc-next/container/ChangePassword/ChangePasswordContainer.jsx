import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "@/components/auth/Sidebar";
import { fetchSingleMember } from "@/apis/members.api";
import { toast_popup } from "@/utils/toast";
import { Formik } from "formik";
import * as yup from "yup";
import { InputBox } from "@/components/common/InputBox";
import { changePassword } from "@/apis/auth.api";

const formValidation = yup.object().shape({
    old_password: yup.string().required("Required"),
    new_password: yup.string().required("Required"),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password"), null], "Passwords must match with new password")
        .required("Required"),
});

const ChangePasswordContainer = (props) => {
    const { authData } = props;
    const [memberData, setMemberData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const initialValues = {
        old_password: "",
        new_password: "",
        confirm_password: "",
    };

    const initiateApp = async () => {
        setIsLoading(true);
        try {
            const res = await fetchSingleMember(authData._id);
            if (res.success) {
                setMemberData(res?.result);
            } else {
                toast_popup(res?.message, "error");
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (authData?._id) initiateApp();
    }, [authData]);

    const onFormSubmit = async (values) => {
        setIsLoading(true);
        try {
            const res = await changePassword(values);
            if (res.success) {
                toast_popup(res?.message, "success");
            } else {
                toast_popup(res?.message, "error");
            }
            setIsLoading(false);
        } catch (error) {
            toast_popup(error.message, "error");
            setIsLoading(false);
        }
    };

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <div className="section checkout">
                <ToastContainer />
                <div className="container pt-lg-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="row section__row">
                                <Sidebar authData={authData} memberData={memberData} />
                                <div className="col-md-7 col-lg-8 col-xl-9">
                                    <div className="checkout__box text-align-left">
                                        <Formik
                                            initialValues={initialValues}
                                            onSubmit={(values) => onFormSubmit(values)}
                                            validationSchema={formValidation}
                                            enableReinitialize
                                        >
                                            {({
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                values,
                                                errors,
                                                setFieldValue,
                                            }) => (
                                                <Fragment>
                                                    <div className="input-group">
                                                        <InputBox
                                                            type="password"
                                                            name="old_password"
                                                            label="Old Password"
                                                            onChange={handleChange("old_password")}
                                                            values={values?.old_password || ""}
                                                            errors={errors?.old_password}
                                                        />
                                                    </div>
                                                    <div className="input-group">
                                                        <InputBox
                                                            type="password"
                                                            name="new_password"
                                                            label="New Password"
                                                            onChange={handleChange("new_password")}
                                                            values={values?.new_password || ""}
                                                            errors={errors?.new_password}
                                                        />
                                                        <InputBox
                                                            type="password"
                                                            name="confirm_password"
                                                            label="Confirm Password"
                                                            onChange={handleChange("confirm_password")}
                                                            values={values?.confirm_password || ""}
                                                            errors={errors?.confirm_password}
                                                        />
                                                    </div>

                                                    <div className="text-center cta-btn">
                                                        <button
                                                            type="submit"
                                                            className="cmn-button"
                                                            onClick={() => handleSubmit()}
                                                            disabled={isLoading}
                                                        >
                                                            Change
                                                        </button>
                                                    </div>
                                                </Fragment>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ChangePasswordContainer;
