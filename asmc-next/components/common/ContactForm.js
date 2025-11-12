import { Formik } from "formik";
import * as yup from "yup";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInsertContactUsMutation } from "@/redux/common/commonApis";

const validation = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone_number: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').required('Mobile number is required')
});

const initialValues = {
    name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "I would like to get in touch with you for "
}

export const ContactForm = () => {
    const [SubmitContactUs, { data, isLoading }] = useInsertContactUsMutation();
    const formikRef = useRef(null);

    const [ReactCaptcha, setReactCaptcha] = useState(null)
    const [render, setRender] = useState(null);
    const [captchaValue, setCaptchaValue] = useState(null);

    useLayoutEffect(() => {
        async function loadModule() {
            setReactCaptcha(await import('react-simple-captcha'))
        }
        loadModule()
    }, [])

    useLayoutEffect(() => {
        if (ReactCaptcha) {
            setRender(true)
        }
    }, [ReactCaptcha])

    useEffect(() => {
        if (render && ReactCaptcha && ReactCaptcha?.loadCaptchaEnginge) {
            setTimeout(() => {
                ReactCaptcha.loadCaptchaEnginge(6, '#07090e', 'rgb(0, 200, 0)', 'lower')
            }, 2000)
        }
    }, [render])

    const onFormSubmit = async (values) => {
        try {
            if (!ReactCaptcha.validateCaptcha(captchaValue)) {
                alert("Invalid captcha");
                setSubmitting(false);
                return;
            }

            await SubmitContactUs(values);
            if (formikRef.current) {
                formikRef.current.resetForm();
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <section class="section contact-form">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="section__header">
                            <h2 class="section__header-title">Get in touch with us.</h2>
                            <p>Fill up the form and our team will get back to you within 24 hours</p>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-xl-8">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={(values) => onFormSubmit(values)}
                            validationSchema={validation}
                            enableReinitialize
                            innerRef={formikRef}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                setFieldValue
                            }) => (
                                <div class="contact-form__inner">
                                    <div className="input-single">
                                        <div id="msgSubmit" className="h3 text-center border-5 btn-success">{data?.message}</div>
                                    </div>

                                    <div class="input-single" style={{ marginBottom: 15 }}>
                                        <label for="contactFirstName">Enter name</label>
                                        <input type="text" name="name" id="contactFirstName" value={values.name} required="" placeholder="Enter your name" onChange={handleChange("name")} />
                                        {
                                            errors?.name && (
                                                <div className="help-block with-errors">{errors.name}</div>
                                            )
                                        }
                                    </div>
                                    <div class="input-group">
                                        <div class="input-single">
                                            <label for="contactEmail">Email</label>
                                            <input type="email" name="contact-email" id="contactEmail" value={values.email} required="" placeholder="Enter your email" onChange={handleChange("email")} />
                                            {
                                                errors?.email && (
                                                    <div className="help-block with-errors">{errors.email}</div>
                                                )
                                            }
                                        </div>
                                        <div class="input-single">
                                            <label for="contactPhone">Phone</label>
                                            <input type="text" name="contact-phone" id="contactPhone" value={values.phone_number} required="" placeholder="Enter your phone" onChange={handleChange("phone_number")} />
                                            {
                                                errors?.phone_number && (
                                                    <div className="help-block with-errors">{errors.phone_number}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div class="input-single">
                                        <label for="contactMessage">Message</label>
                                        <input type="text" value={values.subject} onChange={handleChange("subject")} name="subject" id="subject" className="form-control" placeholder="Subject" />
                                    </div>
                                    <div class="input-single">
                                        <label for="contactMessage">Message</label>
                                        <textarea name="contact-message" id="contactMessage" cols="30" rows="4" value={values.message} placeholder="I would like to get in touch with you..." onChange={handleChange("message")} ></textarea>
                                    </div>
                                    <div className="input-single" style={{ textAlign: 'left' }}>
                                        {render && ReactCaptcha ? <ReactCaptcha.LoadCanvasTemplate /> : null}
                                        <input placeholder="Enter Captcha Value" id="user_captcha_input" name="user_captcha_input" onChange={(e) => setCaptchaValue(e.target.value)} required type="text" />
                                    </div>
                                    <div class="section__cta">
                                        <button type="submit" class="cmn-button" onClick={() => handleSubmit()}>Send Message</button>
                                    </div>
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </section >

    )
}