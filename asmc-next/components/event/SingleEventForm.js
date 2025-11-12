import { verifyMember } from "@/apis/members.api";
import { calculateAge } from "@/utils/helper";
import { toast_popup } from "@/utils/toast";
import { useFormik } from "formik";
import { IsMember } from "./IsMember";
import { Fragment, useMemo, useState } from "react";
import { InputBox } from "../common/InputBox";
import { format } from "date-fns";
import EligibleCategories from "./EligibleCategories";
import { Summary } from "./Summary";
import * as yup from "yup";
import { SingelPlayerDetails } from "./SinglePlayerDetails";

const FormValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email address"),
    gender: yup.string().required("Gender is required"),
    mobile: yup
        .string()
        .required("Mobile number is required")
        .matches(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    dob: yup.string().required("Date of Birth is required"),
    chss_number: yup.string().required("CHSS Number is required"),
});

export const SingleEventForm = ({
    data,
    authData,
    formData,
    setFormData,
    setNonVerifiedMembers,
    nonVerifiedMembers,
    verifiedMembers,
    setVerifiedMembers,
    selectedCategory,
    setSelectedCategory,
    setTotalAmountToPay,
    totalAmountToPay,
    showPayButton,
    handleInitiatePayment,
    setShowPayButton,
}) => {
    const [prefix, setPrefix] = useState("P-");
    const formik = useFormik({
        initialValues: {
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
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setNonVerifiedMembers((prev) => [...prev, values]);
            resetForm();
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const isEligible = (category, values) => {
        // check if start_age and end_age comes between based on the dob of the member
        if (formData?.are_you_member === "Yes") {
            const validMembers = verifiedMembers.filter((member) => member !== null);
            const calculatedAge = calculateAge(validMembers[0]?.dob);
            return category?.start_age <= calculatedAge && category?.end_age >= calculatedAge;
        } else if (formData?.are_you_member === "No") {
            const validMembers = nonVerifiedMembers.filter((member) => member !== null);
            const calculatedAge = calculateAge(validMembers[0]?.dob);
            return category?.start_age <= calculatedAge && category?.end_age >= calculatedAge;
        } else {
            const calculatedAge = calculateAge(values.dob);
            return category?.start_age <= calculatedAge && category?.end_age >= calculatedAge;
        }
    };

    const handleVerify = async (value) => {
        try {
            if (value === "") {
                toast_popup("Please enter membership id", "error");
                return;
            }

            // set isallmember true if all member is verified
            const response = await verifyMember(prefix === "S" ? "S" + value : value);
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
                    toast_popup(`${response.result.name} does not have DOB in our records`, "error");
                    return;
                }

                if (!verifiedMembers.find((m) => m.member_id === data.member_id)) {
                    setVerifiedMembers((prev) => [...prev, data]);
                }
                toast_popup("Member verified successfully!", "success");
            } else {
                toast_popup(response.message || "Verification failed", "error");
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    const calculateTotalAmount = () => {
        if (!selectedCategory) return 0;

        const amountToPay =
            formData.yourself === "Yes"
                ? selectedCategory.members_fees
                : formData.yourself === "No" && formData?.are_you_member === "No"
                  ? selectedCategory.non_members_fees
                  : formData?.yourself === "No" && formData?.are_you_member === "Yes"
                    ? selectedCategory.members_fees
                    : 0;

        setTotalAmountToPay(amountToPay);

        return parseInt(amountToPay);
    };

    const renderMain = useMemo(() => {
        return (
            <div className="row">
                {authData && (
                    <div className="col-12 p-0">
                        <div className="radio-input p-0">
                            <label>Are you booking for yourself?</label>
                            <div className="input__radio-wrapper">
                                <div className="input__radio-single">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="yourself"
                                        id="yourself_yes"
                                        value="Yes"
                                        checked={formData?.yourself === "Yes"}
                                        onChange={() => [
                                            setFormData({
                                                yourself: "Yes",
                                                are_you_member: "",
                                                partner_member: "",
                                                team_members: [],
                                            }),
                                            setNonVerifiedMembers([]),
                                            setVerifiedMembers([
                                                {
                                                    _id: authData?._id,
                                                    member_id: authData?.member_id,
                                                    name: authData?.name,
                                                    email: authData?.email,
                                                    mobile: authData?.mobile,
                                                    gender: authData?.gender,
                                                    chss_number: authData?.chss_number,
                                                    dob: authData?.dob,
                                                },
                                            ]),
                                            setSelectedCategory(null),
                                            setTotalAmountToPay(0),
                                        ]}
                                    />
                                    <label className="form-check-label" htmlFor="yourself_yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="input__radio-single">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="yourself"
                                        id="yourself_no"
                                        value="No"
                                        checked={formData?.yourself === "No"}
                                        onChange={() => [
                                            setFormData({
                                                yourself: "No",
                                                are_you_member: "",
                                                partner_member: "",
                                                team_members: [],
                                            }),
                                            setNonVerifiedMembers([]),
                                            setVerifiedMembers([]),
                                            setSelectedCategory(null),
                                            setTotalAmountToPay(0),
                                        ]}
                                    />
                                    <label className="form-check-label" htmlFor="yourself_no">
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {formData?.yourself === "No" && (
                    <Fragment>
                        <div
                            className="card shadow-sm mb-4 border border-primary-subtle rounded-4"
                            style={{
                                borderLeft: "6px solid #0d6efd",
                                backgroundColor: "#fdfdff",
                            }}
                        >
                            <div
                                className="card-header d-flex justify-content-between align-items-center rounded-top-4"
                                style={{
                                    backgroundColor: "#e9f0fb",
                                    borderBottom: "1px solid #d0e2ff",
                                    padding: "1rem 1.5rem",
                                }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="mb-0 fw-semibold">Player Details</h5>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => {
                                            if (formData.are_you_member === "Yes") {
                                                setVerifiedMembers((prev) =>
                                                    prev.filter((item) => item.member_id !== formik?.values?.member_id)
                                                );
                                            } else {
                                                setNonVerifiedMembers((prev) =>
                                                    prev.filter((item) => item.email !== formik?.values?.email)
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
                                    </button>
                                </div>
                            </div>

                            <div className="card-body p-4">
                                <IsMember
                                    onChange={(val) => [
                                        setFormData({
                                            yourself: "No",
                                            are_you_member: val,
                                            partner_member: "",
                                            team_members: [],
                                        }),
                                        setNonVerifiedMembers([]),
                                        setVerifiedMembers([]),
                                        setSelectedCategory(null),
                                        setTotalAmountToPay(0),
                                    ]}
                                    value={formData.are_you_member}
                                />
                                {formData.are_you_member !== "" && (
                                    <div className="col-12 p-0 pt-3">
                                        <form
                                            onSubmit={formik.handleSubmit}
                                            className="p-4 border rounded w-96 mx-auto"
                                        >
                                            <Fragment>
                                                <div className="container">
                                                    <div
                                                        className="row mb-4 p-3"
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            borderRadius: "10px",
                                                            alignItems: "center",
                                                            backgroundColor: "#f9f9f9",
                                                        }}
                                                    >
                                                        {formData.are_you_member === "Yes" ? (
                                                            <Fragment>
                                                                <div className="col-md-6">
                                                                    <InputBox
                                                                        name="member_id"
                                                                        label="Enter your Membership ID"
                                                                        prefix={prefix}
                                                                        prefixOptions={["P-", "S"]}
                                                                        onPrefixChange={(val) => {
                                                                            setPrefix(val);
                                                                            formik.setFieldValue("member_id", ""); // reset ID on prefix change
                                                                        }}
                                                                        onChange={(e) => {
                                                                            let value = e.target.value.replace(
                                                                                /^P-/,
                                                                                ""
                                                                            );
                                                                            formik.setFieldValue("member_id", value);
                                                                        }}
                                                                        values={formik.values.member_id}
                                                                        errors={formik?.errors?.member_id}
                                                                        helperText={
                                                                            prefix === "P-"
                                                                                ? "Primary member id should be like P-0001"
                                                                                : "Secondary member id should be like S1-0001"
                                                                        }
                                                                        placeholder={
                                                                            prefix === "P-" ? "00001" : "1-00001"
                                                                        }
                                                                    />
                                                                    {verifiedMembers.filter((member) => member !== null)
                                                                        .length > 0 ? (
                                                                        <div className="mt-2">
                                                                            <p>
                                                                                <strong>Member Id:</strong>{" "}
                                                                                {
                                                                                    verifiedMembers.filter(
                                                                                        (member) => member !== null
                                                                                    )[0]?.member_id
                                                                                }
                                                                            </p>
                                                                            {verifiedMembers.filter(
                                                                                (member) => member !== null
                                                                            )[0]?.secondary_member_id && (
                                                                                <p>
                                                                                    <strong>
                                                                                        Secondary Member Id:
                                                                                    </strong>{" "}
                                                                                    {
                                                                                        verifiedMembers.filter(
                                                                                            (member) => member !== null
                                                                                        )[0]?.secondary_member_id
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                            <p>
                                                                                Name:{" "}
                                                                                {
                                                                                    verifiedMembers.filter(
                                                                                        (member) => member !== null
                                                                                    )[0]?.name
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                Mobile:{" "}
                                                                                {
                                                                                    verifiedMembers.filter(
                                                                                        (member) => member !== null
                                                                                    )[0]?.mobile
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                Email:{" "}
                                                                                {
                                                                                    verifiedMembers.filter(
                                                                                        (member) => member !== null
                                                                                    )[0]?.email
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                Gender:{" "}
                                                                                {
                                                                                    verifiedMembers.filter(
                                                                                        (member) => member !== null
                                                                                    )[0]?.gender
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                Age:{" "}
                                                                                {verifiedMembers.filter(
                                                                                    (member) => member !== null
                                                                                )[0]?.dob
                                                                                    ? calculateAge(
                                                                                          verifiedMembers.filter(
                                                                                              (member) =>
                                                                                                  member !== null
                                                                                          )[0]?.dob
                                                                                      )
                                                                                    : "Not Provided"}
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-primary mt-2"
                                                                            onClick={() =>
                                                                                handleVerify(formik?.values?.member_id)
                                                                            }
                                                                        >
                                                                            <i className="fas fa-user-check"></i> Fetch
                                                                            Details
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </Fragment>
                                                        ) : nonVerifiedMembers.filter((member) => member !== null)
                                                              .length > 0 ? (
                                                            <div className="mt-2">
                                                                <p>
                                                                    Name:{" "}
                                                                    {
                                                                        nonVerifiedMembers.filter(
                                                                            (member) => member !== null
                                                                        )[0]?.name
                                                                    }
                                                                </p>
                                                                <p>
                                                                    Mobile:{" "}
                                                                    {
                                                                        nonVerifiedMembers.filter(
                                                                            (member) => member !== null
                                                                        )[0]?.mobile
                                                                    }
                                                                </p>
                                                                <p>
                                                                    Email:{" "}
                                                                    {
                                                                        nonVerifiedMembers.filter(
                                                                            (member) => member !== null
                                                                        )[0]?.email
                                                                    }
                                                                </p>
                                                                <p>
                                                                    Gender:{" "}
                                                                    {
                                                                        nonVerifiedMembers.filter(
                                                                            (member) => member !== null
                                                                        )[0]?.gender
                                                                    }
                                                                </p>
                                                                <p>
                                                                    Age:{" "}
                                                                    {nonVerifiedMembers.filter(
                                                                        (member) => member !== null
                                                                    )[0]?.dob
                                                                        ? calculateAge(
                                                                              nonVerifiedMembers.filter(
                                                                                  (member) => member !== null
                                                                              )[0]?.dob
                                                                          )
                                                                        : "Not Provided"}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <Fragment>
                                                                <div className="input-group mb-1">
                                                                    <InputBox
                                                                        name="name"
                                                                        label="Name"
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        values={formik?.values?.name || ""}
                                                                        errors={formik?.errors?.name}
                                                                    />
                                                                    <InputBox
                                                                        name="email"
                                                                        label="Email"
                                                                        type="email"
                                                                        onChange={formik.handleChange("email")}
                                                                        onBlur={formik.handleBlur}
                                                                        values={formik?.values?.email || ""}
                                                                        errors={formik?.errors?.email}
                                                                    />
                                                                </div>
                                                                <div className="input-group mb-1">
                                                                    <InputBox
                                                                        name="mobile"
                                                                        label="Mobile"
                                                                        onChange={formik.handleChange("mobile")}
                                                                        onBlur={formik.handleBlur}
                                                                        values={formik?.values?.mobile || ""}
                                                                        errors={formik?.errors?.mobile}
                                                                    />
                                                                    <div className="input-single">
                                                                        <label htmlFor={"gender"}>Gender</label>
                                                                        <select
                                                                            name="gender"
                                                                            id="gender"
                                                                            onChange={formik.handleChange("gender")}
                                                                            onBlur={formik.handleBlur}
                                                                            value={formik?.values?.gender}
                                                                            className="form-select"
                                                                        >
                                                                            <option value={""}>Select</option>
                                                                            <option value={"Male"}>Male</option>
                                                                            <option value={"Female"}>Female</option>
                                                                        </select>
                                                                        {formik?.errors?.gender && (
                                                                            <span className="help-block with-errors">
                                                                                {formik?.errors?.gender}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="input-group mb-1">
                                                                    <InputBox
                                                                        name="dob"
                                                                        label="Date of Birth"
                                                                        type="date"
                                                                        onChange={(e) =>
                                                                            formik.setFieldValue(
                                                                                "dob",
                                                                                format(e.target.value, "yyyy-MM-dd")
                                                                            )
                                                                        }
                                                                        onBlur={formik.handleBlur}
                                                                        values={
                                                                            formik?.values?.dob
                                                                                ? format(
                                                                                      formik?.values?.dob,
                                                                                      "yyyy-MM-dd"
                                                                                  )
                                                                                : ""
                                                                        }
                                                                        errors={formik?.errors?.dob}
                                                                    />
                                                                    <InputBox
                                                                        name="chss_number"
                                                                        label="CHSS Number"
                                                                        onChange={formik.handleChange("chss_number")}
                                                                        onBlur={formik.handleBlur}
                                                                        values={formik?.values?.chss_number || ""}
                                                                        errors={formik?.errors?.chss_number}
                                                                    />
                                                                </div>

                                                                <div className="text-center cta-btn mt-3">
                                                                    <button
                                                                        type="submit"
                                                                        className="cmn-button cmn-button--secondary cmn-button-small"
                                                                    >
                                                                        Save Details
                                                                    </button>
                                                                </div>
                                                            </Fragment>
                                                        )}
                                                    </div>
                                                </div>
                                            </Fragment>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Fragment>
                )}

                {showPayButton && (
                    <Fragment>
                        <EligibleCategories
                            data={data}
                            formData={formData}
                            authData={authData}
                            verifiedMembers={verifiedMembers}
                            nonVerifiedMembers={nonVerifiedMembers}
                            isEligible={isEligible}
                            handleCategorySelect={(cat) => setSelectedCategory(cat)}
                            selectedCategory={selectedCategory}
                        />

                        {selectedCategory && (
                            <Summary
                                selectedCategory={selectedCategory}
                                formData={formData}
                                calculateTotalAmount={calculateTotalAmount}
                            />
                        )}

                        {totalAmountToPay > 0 && (
                            <div className="text-center cta-btn mt-3">
                                <button type="submit" className="cmn-button" onClick={() => handleInitiatePayment()}>
                                    Pay Now
                                </button>
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
        );
    });

    return renderMain;
};
