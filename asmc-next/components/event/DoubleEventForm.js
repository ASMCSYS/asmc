import { verifyMember } from "@/apis/members.api";
import { calculateAge } from "@/utils/helper";
import { toast_popup } from "@/utils/toast";
import { useFormik } from "formik";
import { IsMember } from "./IsMember";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { InputBox } from "../common/InputBox";
import { format, isValid, set } from "date-fns";
import EligibleCategories from "./EligibleCategories";
import { Summary } from "./Summary";
import * as yup from "yup";

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
const PartnerFormValidation = yup.object().shape({
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

export const DoubleEventForm = ({
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
    const [partnerPrefix, setPartnerPrefix] = useState("P-");
    const [memberFormSubmitted, setMemberFormSubmitted] = useState(false);
    const [partnerFormSubmitted, setPartnerFormSubmitted] = useState(false);

    const memberFormik = useFormik({
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
            setNonVerifiedMembers((prev) => [...prev, { ...values, is_member: "No" }]);
            setMemberFormSubmitted(true);
            // resetForm();
        },
    });

    const partnerFormik = useFormik({
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
        validationSchema: PartnerFormValidation,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setNonVerifiedMembers((prev) => [...prev, { ...values, is_member: "No" }]);
            setPartnerFormSubmitted(true);
            // resetForm();
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const isEligible = (category, values) => {
        // check if start_age and end_age comes between based on the dob of the member

        const allMembers = [...nonVerifiedMembers, ...verifiedMembers];
        // check if all the members are eligible
        const isAllMembersEligible = allMembers.every((member) => {
            const calculatedAge = calculateAge(member?.dob);
            return category?.start_age <= calculatedAge && category?.end_age >= calculatedAge;
        });

        return isAllMembersEligible;
    };

    const handleVerify = async (value, typePrefix) => {
        try {
            if (value === "") {
                toast_popup("Please enter membership id", "error");
                return;
            }

            // check if other member is already verified
            if (verifiedMembers.find((item) => item?.member_id === value)) {
                toast_popup("This member is already verified", "error");
                return;
            }

            // set isallmember true if all member is verified
            const response = await verifyMember(typePrefix === "S" ? "S" + value : value);
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

                setVerifiedMembers((prev) => [...prev, data]);
                toast_popup("Member verified successfully!", "success");
            } else {
                toast_popup(response.message || "Verification failed", "error");
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        const memberFee = parseInt(selectedCategory.members_fees);
        const nonMemberFee = parseInt(selectedCategory.non_members_fees);

        if (formData.are_you_member === "Yes") totalAmount += memberFee;
        else totalAmount += nonMemberFee;

        if (formData.partner_member === "Yes") totalAmount += memberFee;
        else totalAmount += nonMemberFee;

        setTotalAmountToPay(totalAmount);
        return parseInt(totalAmount);
    };

    const findVerifiedMember = (member_id, prefix) => {
        return (
            verifiedMembers.find((item) => {
                if (prefix === "S") return item?.secondary_member_id === "S" + member_id;
                else return item?.member_id === member_id;
            }) || null
        );
    };

    const RenderVerifiedMember = ({ member_id, prefix }) => {
        const findMember = findVerifiedMember(member_id, prefix);
        if (!findMember) return null;
        return (
            <div className="mt-2">
                <p>
                    <strong>Member Id:</strong> {findMember.member_id}
                </p>
                {findMember?.secondary_member_id && (
                    <p>
                        <strong>Secondary Member Id:</strong> {findMember.secondary_member_id}
                    </p>
                )}
                <p>Name: {findMember?.name}</p>
                <p>Mobile: {findMember?.mobile}</p>
                <p>Email: {findMember?.email}</p>
                <p>Gender: {findMember?.gender}</p>
                <p>Age: {findMember?.dob ? calculateAge(findMember?.dob) : "Not Provided"}</p>
            </div>
        );
    };
    const RenderNonVerifiedMember = ({ email }) => {
        console.log(email, "email");
        const findMember = nonVerifiedMembers.filter((member) => member !== null).find((item) => item?.email === email);
        if (!findMember) return null;
        return (
            <div className="mt-2">
                <p>Name: {findMember?.name}</p>
                <p>Mobile: {findMember?.mobile}</p>
                <p>Email: {findMember?.email}</p>
                <p>Gender: {findMember?.gender}</p>
                <p>Age: {findMember?.dob ? calculateAge(findMember?.dob) : "Not Provided"}</p>
            </div>
        );
    };

    const renderMain = useMemo(() => {
        return (
            <div className="row">
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
                                <h5 className="mb-0 fw-semibold">Primary Player Details</h5>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => {
                                        if (formData.are_you_member === "Yes") {
                                            setVerifiedMembers((prev) =>
                                                prev.filter(
                                                    (item) => item.member_id !== memberFormik?.values?.member_id
                                                )
                                            );
                                        } else {
                                            setNonVerifiedMembers((prev) =>
                                                prev.filter((item) => item.email !== memberFormik?.values?.email)
                                            );
                                        }
                                        setFormData({
                                            ...formData,
                                            are_you_member: "",
                                        });
                                        setMemberFormSubmitted(false);
                                        setSelectedCategory(null);
                                        setTotalAmountToPay(0);
                                        setShowPayButton(false);
                                        memberFormik.resetForm();
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
                                        ...formData,
                                        are_you_member: val,
                                    }),
                                    setSelectedCategory(null),
                                    setTotalAmountToPay(0),
                                ]}
                                name="are_you_member"
                                value={formData.are_you_member}
                                disabled={findVerifiedMember(memberFormik?.values?.member_id, prefix)}
                            />

                            {formData.are_you_member !== "" && (
                                <div className="col-12 p-0 pt-3">
                                    <form
                                        onSubmit={memberFormik.handleSubmit}
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
                                                                        memberFormik.setFieldValue("member_id", ""); // reset ID on prefix change
                                                                    }}
                                                                    onChange={(e) => {
                                                                        let value = e.target.value.replace(/^P-/, "");

                                                                        if (
                                                                            verifiedMembers.find(
                                                                                (item) => item?.member_id === value
                                                                            )
                                                                        ) {
                                                                            toast_popup(
                                                                                "This member is already verified",
                                                                                "error"
                                                                            );
                                                                            return;
                                                                        }
                                                                        memberFormik.setFieldValue("member_id", value);
                                                                    }}
                                                                    values={memberFormik.values.member_id}
                                                                    errors={memberFormik?.errors?.member_id}
                                                                    helperText={
                                                                        prefix === "P-"
                                                                            ? "Primary member id should be like P-0001"
                                                                            : "Secondary member id should be like S1-0001"
                                                                    }
                                                                    placeholder={prefix === "P-" ? "00001" : "1-00001"}
                                                                    disabled={findVerifiedMember(
                                                                        memberFormik?.values?.member_id,
                                                                        prefix
                                                                    )}
                                                                />

                                                                {findVerifiedMember(
                                                                    memberFormik?.values?.member_id,
                                                                    prefix
                                                                ) ? (
                                                                    <RenderVerifiedMember
                                                                        member_id={memberFormik?.values?.member_id}
                                                                        prefix={prefix}
                                                                    />
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-primary mt-2"
                                                                        onClick={() =>
                                                                            handleVerify(
                                                                                memberFormik?.values?.member_id,
                                                                                prefix
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fas fa-user-check"></i> Fetch
                                                                        Details
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </Fragment>
                                                    ) : memberFormSubmitted ? (
                                                        <RenderNonVerifiedMember email={memberFormik?.values?.email} />
                                                    ) : (
                                                        <Fragment>
                                                            <div className="input-group mb-1">
                                                                <InputBox
                                                                    name="name"
                                                                    label="Name"
                                                                    onChange={memberFormik.handleChange}
                                                                    onBlur={memberFormik.handleBlur}
                                                                    values={memberFormik?.values?.name || ""}
                                                                    errors={memberFormik?.errors?.name}
                                                                />
                                                                <InputBox
                                                                    name="email"
                                                                    label="Email"
                                                                    type="email"
                                                                    onChange={memberFormik.handleChange("email")}
                                                                    values={memberFormik?.values?.email || ""}
                                                                    errors={memberFormik?.errors?.email}
                                                                />
                                                            </div>
                                                            <div className="input-group mb-1">
                                                                <InputBox
                                                                    name="mobile"
                                                                    label="Mobile"
                                                                    onChange={memberFormik.handleChange("mobile")}
                                                                    values={memberFormik?.values?.mobile || ""}
                                                                    errors={memberFormik?.errors?.mobile}
                                                                />
                                                                <div className="input-single">
                                                                    <label htmlFor={"gender"}>Gender</label>
                                                                    <select
                                                                        name="gender"
                                                                        id="gender"
                                                                        onChange={memberFormik.handleChange("gender")}
                                                                        value={memberFormik?.values?.gender}
                                                                        className="form-select"
                                                                    >
                                                                        <option value={""}>Select</option>
                                                                        <option value={"Male"}>Male</option>
                                                                        <option value={"Female"}>Female</option>
                                                                    </select>
                                                                    {memberFormik?.errors?.gender && (
                                                                        <span className="help-block with-errors">
                                                                            {memberFormik?.errors?.gender}
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
                                                                        memberFormik.setFieldValue(
                                                                            "dob",
                                                                            format(e.target.value, "yyyy-MM-dd")
                                                                        )
                                                                    }
                                                                    values={
                                                                        memberFormik?.values?.dob
                                                                            ? format(
                                                                                  memberFormik?.values?.dob,
                                                                                  "yyyy-MM-dd"
                                                                              )
                                                                            : ""
                                                                    }
                                                                    errors={memberFormik?.errors?.dob}
                                                                />
                                                                <InputBox
                                                                    name="chss_number"
                                                                    label="CHSS Number"
                                                                    onChange={memberFormik.handleChange("chss_number")}
                                                                    values={memberFormik?.values?.chss_number || ""}
                                                                    errors={memberFormik?.errors?.chss_number}
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
                                <h5 className="mb-0 fw-semibold">Partner Player Details</h5>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => {
                                        if (formData.partner_member === "Yes") {
                                            setVerifiedMembers((prev) =>
                                                prev.filter(
                                                    (item) => item.member_id !== partnerFormik?.values?.member_id
                                                )
                                            );
                                        } else {
                                            setNonVerifiedMembers((prev) =>
                                                prev.filter((item) => item.email !== partnerFormik?.values?.email)
                                            );
                                        }
                                        setFormData({
                                            ...formData,
                                            partner_member: "",
                                        });
                                        setPartnerFormSubmitted(false);
                                        setSelectedCategory(null);
                                        setTotalAmountToPay(0);
                                        setShowPayButton(false);
                                        partnerFormik.resetForm();
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
                                        ...formData,
                                        partner_member: val,
                                    }),
                                    setSelectedCategory(null),
                                    setTotalAmountToPay(0),
                                ]}
                                name="partner_member"
                                value={formData.partner_member}
                                title="Is your partner ASMC member?"
                                disabled={findVerifiedMember(partnerFormik?.values?.member_id, partnerPrefix)}
                            />
                        </div>

                        {formData.partner_member !== "" && (
                            <div className="col-md-12 p-0 pb-3">
                                <form onSubmit={partnerFormik.handleSubmit} className="p-4 border rounded w-96 mx-auto">
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
                                                {formData.partner_member === "Yes" ? (
                                                    <Fragment>
                                                        <div className="col-md-6">
                                                            <InputBox
                                                                name="member_id"
                                                                label="Enter your Membership ID"
                                                                prefix={partnerPrefix}
                                                                prefixOptions={["P-", "S"]}
                                                                onPrefixChange={(val) => {
                                                                    setPartnerPrefix(val);
                                                                    partnerFormik.setFieldValue("member_id", ""); // reset ID on prefix change
                                                                }}
                                                                onChange={(e) => {
                                                                    let value = e.target.value.replace(/^P-/, "");

                                                                    if (
                                                                        verifiedMembers.find(
                                                                            (item) => item?.member_id === value
                                                                        )
                                                                    ) {
                                                                        toast_popup(
                                                                            "This member is already verified",
                                                                            "error"
                                                                        );
                                                                        return;
                                                                    }
                                                                    partnerFormik.setFieldValue("member_id", value);
                                                                }}
                                                                values={partnerFormik.values.member_id}
                                                                errors={partnerFormik?.errors?.member_id}
                                                                helperText={
                                                                    partnerPrefix === "P-"
                                                                        ? "Primary member id should be like P-0001"
                                                                        : "Secondary member id should be like S1-0001"
                                                                }
                                                                placeholder={
                                                                    partnerPrefix === "P-" ? "00001" : "1-00001"
                                                                }
                                                                disabled={findVerifiedMember(
                                                                    partnerFormik?.values?.member_id,
                                                                    partnerPrefix
                                                                )}
                                                            />
                                                            {findVerifiedMember(
                                                                partnerFormik?.values?.member_id,
                                                                partnerPrefix
                                                            ) ? (
                                                                <RenderVerifiedMember
                                                                    member_id={partnerFormik?.values?.member_id}
                                                                    prefix={partnerPrefix}
                                                                />
                                                            ) : (
                                                                <button
                                                                    className="btn btn-primary mt-2"
                                                                    onClick={() =>
                                                                        handleVerify(
                                                                            partnerFormik?.values?.member_id,
                                                                            partnerPrefix
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fas fa-user-check"></i> Fetch Details
                                                                </button>
                                                            )}
                                                        </div>
                                                    </Fragment>
                                                ) : partnerFormSubmitted ? (
                                                    <RenderNonVerifiedMember email={partnerFormik?.values?.email} />
                                                ) : (
                                                    <Fragment>
                                                        <div className="input-group mb-1">
                                                            <InputBox
                                                                name="name"
                                                                label="Name"
                                                                onChange={partnerFormik.handleChange("name")}
                                                                onBlur={partnerFormik.handleBlur}
                                                                values={partnerFormik?.values?.name || ""}
                                                                errors={partnerFormik?.errors?.name}
                                                                touched={partnerFormik?.touched?.name}
                                                            />
                                                            <InputBox
                                                                name="email"
                                                                label="Email"
                                                                type="email"
                                                                onChange={partnerFormik.handleChange("email")}
                                                                onBlur={partnerFormik.handleBlur}
                                                                values={partnerFormik?.values?.email || ""}
                                                                errors={partnerFormik?.errors?.email}
                                                                touched={partnerFormik?.touched?.email}
                                                            />
                                                        </div>
                                                        <div className="input-group mb-1">
                                                            <InputBox
                                                                name="mobile"
                                                                label="Mobile"
                                                                onChange={partnerFormik.handleChange("mobile")}
                                                                onBlur={partnerFormik.handleBlur}
                                                                values={partnerFormik?.values?.mobile || ""}
                                                                errors={partnerFormik?.errors?.mobile}
                                                                touched={partnerFormik?.touched?.mobile}
                                                            />
                                                            <div className="input-single">
                                                                <label htmlFor={"gender"}>Gender</label>
                                                                <select
                                                                    name="gender"
                                                                    id="gender"
                                                                    onChange={partnerFormik.handleChange("gender")}
                                                                    onBlur={partnerFormik.handleBlur}
                                                                    value={partnerFormik?.values?.gender}
                                                                    className="form-select"
                                                                >
                                                                    <option value={""}>Select</option>
                                                                    <option value={"Male"}>Male</option>
                                                                    <option value={"Female"}>Female</option>
                                                                </select>
                                                                {partnerFormik?.errors?.gender && (
                                                                    <span className="help-block with-errors">
                                                                        {partnerFormik?.errors?.gender}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="input-group mb-1">
                                                            <InputBox
                                                                name="dob"
                                                                label="Date of Birth"
                                                                type="date"
                                                                onChange={(e) => {
                                                                    if (isValid(new Date(e.target.value)))
                                                                        partnerFormik.setFieldValue(
                                                                            "dob",
                                                                            format(e.target.value, "yyyy-MM-dd")
                                                                        );
                                                                }}
                                                                onBlur={partnerFormik.handleBlur}
                                                                values={
                                                                    partnerFormik?.values?.dob
                                                                        ? format(
                                                                              partnerFormik?.values?.dob,
                                                                              "yyyy-MM-dd"
                                                                          )
                                                                        : ""
                                                                }
                                                                errors={partnerFormik?.errors?.dob}
                                                                touched={partnerFormik?.touched?.dob}
                                                            />
                                                            <InputBox
                                                                name="chss_number"
                                                                label="CHSS Number"
                                                                onChange={partnerFormik.handleChange("chss_number")}
                                                                onBlur={partnerFormik.handleBlur}
                                                                values={partnerFormik?.values?.chss_number || ""}
                                                                errors={partnerFormik?.errors?.chss_number}
                                                                touched={partnerFormik?.touched?.chss_number}
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
                </Fragment>

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
                                quantity={
                                    [...verifiedMembers, ...nonVerifiedMembers].filter((member) => member !== null)
                                        .length
                                }
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
