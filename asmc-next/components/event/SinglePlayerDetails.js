import { Fragment, useMemo, useState } from "react";
import { useFormik } from "formik";
import { verifyMember } from "@/apis/members.api";
import { toast_popup } from "@/utils/toast";
import { calculateAge } from "@/utils/helper";
import { InputBox } from "../common/InputBox";
import { IsMember } from "./IsMember";
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

export const SingelPlayerDetails = ({
    index,
    player,
    formData,
    setFormData,
    setNonVerifiedMembers,
    nonVerifiedMembers,
    verifiedMembers,
    setVerifiedMembers,
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
        onSubmit: (values, { resetForm }) => {
            const updatedTeam = [...formData.team_members];
            updatedTeam[index] = { ...values, is_member: "No" };

            setFormData((prev) => ({
                ...prev,
                team_members: updatedTeam,
            }));

            const updatedNonMembers = [...nonVerifiedMembers];
            updatedNonMembers[index] = { ...values, is_member: "No" };
            setNonVerifiedMembers(updatedNonMembers);

            toast_popup("Player details saved successfully!", "success");
            resetForm();
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const handleVerify = async (memberId) => {
        if (!memberId) {
            toast_popup("Please enter membership id", "error");
            return;
        }

        // check if other member is already verified
        if (verifiedMembers.find((item) => item?.member_id === memberId)) {
            toast_popup("This member is already verified", "error");
            return;
        }

        try {
            const response = await verifyMember(prefix === "S" ? "S" + memberId : memberId);
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

                // if (!verifiedMembers.find((m) => m.member_id === data.member_id)) {
                setVerifiedMembers((prev) => [...prev, data]);
                // }

                const updatedTeam = [...formData.team_members];
                updatedTeam[index] = data;

                setFormData((prev) => ({
                    ...prev,
                    team_members: updatedTeam,
                }));

                toast_popup("Member verified successfully!", "success");
            } else {
                toast_popup(response.message || "Verification failed", "error");
            }
        } catch (err) {
            toast_popup(err?.message || "Error verifying member", "error");
        }
    };

    const currentNonMember = nonVerifiedMembers[index];

    const renderMain = useMemo(() => {
        return (
            <Fragment>
                <IsMember
                    name="asmc_member"
                    index={index}
                    onChange={(val) => {
                        setFormData((prev) => ({
                            ...prev,
                            team_members: prev.team_members.map((tm, i) =>
                                i === index ? { ...tm, is_member: val } : tm
                            ),
                        }));
                    }}
                    value={player?.is_member || ""}
                    title="Is the player a member?"
                    disabled={Boolean(player?.name && player?.email && player?.mobile && player?.gender && player?.dob)}
                />

                {player?.is_member && (
                    <div className="col-12 p-0 pt-3">
                        <form onSubmit={formik.handleSubmit} className="p-4 border rounded w-96 mx-auto">
                            <div
                                className="row mb-4 p-3"
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                {player.is_member === "Yes" ? (
                                    <Fragment>
                                        <div className="col-md-6">
                                            {verifiedMembers.find((m) => m.member_id === player?.member_id) ? (
                                                <div className="mt-3">
                                                    <p>
                                                        <strong>Member Id:</strong> {player.member_id}
                                                    </p>
                                                    {player?.secondary_member_id && (
                                                        <p>
                                                            <strong>Secondary Member Id:</strong>{" "}
                                                            {player.secondary_member_id}
                                                        </p>
                                                    )}
                                                    <p>
                                                        <strong>Name:</strong> {player.name}
                                                    </p>
                                                    <p>
                                                        <strong>Mobile:</strong> {player.mobile}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {player.email}
                                                    </p>
                                                    <p>
                                                        <strong>Gender:</strong> {player.gender}
                                                    </p>
                                                    <p>
                                                        <strong>Age:</strong>{" "}
                                                        {player.dob ? calculateAge(player.dob) : "N/A"}
                                                    </p>
                                                </div>
                                            ) : (
                                                <Fragment>
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
                                                            let value = e.target.value.replace(/^P-/, "");
                                                            formik.setFieldValue("member_id", value);
                                                        }}
                                                        values={formik.values.member_id}
                                                        errors={formik?.errors?.member_id}
                                                        helperText={
                                                            prefix === "P-"
                                                                ? "Primary member id should be like P-0001"
                                                                : "Secondary member id should be like S1-0001"
                                                        }
                                                        placeholder={prefix === "P-" ? "00001" : "1-00001"}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary mt-2"
                                                        onClick={() => handleVerify(formik?.values?.member_id)}
                                                    >
                                                        <i className="fas fa-user-check"></i> Fetch Details
                                                    </button>
                                                </Fragment>
                                            )}
                                        </div>
                                    </Fragment>
                                ) : currentNonMember ? (
                                    <div className="mt-3">
                                        <p>
                                            <strong>Name:</strong> {currentNonMember.name}
                                        </p>
                                        <p>
                                            <strong>Mobile:</strong> {currentNonMember.mobile}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {currentNonMember.email}
                                        </p>
                                        <p>
                                            <strong>Gender:</strong> {currentNonMember.gender}
                                        </p>
                                        <p>
                                            <strong>Age:</strong>{" "}
                                            {currentNonMember.dob ? calculateAge(currentNonMember.dob) : "N/A"}
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
                                                touched={formik.touched.name}
                                            />
                                            <InputBox
                                                name="email"
                                                label="Email"
                                                type="email"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                values={formik?.values?.email || ""}
                                                errors={formik?.errors?.email || ""}
                                                touched={formik.touched.name}
                                            />
                                        </div>
                                        <div className="input-group mb-1">
                                            <InputBox
                                                name="mobile"
                                                label="Mobile"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                values={formik?.values?.mobile || ""}
                                                errors={formik?.errors?.mobile || ""}
                                                touched={formik.touched.name}
                                            />
                                            <div className="input-single">
                                                <label htmlFor={"gender"}>Gender</label>
                                                <select
                                                    name="gender"
                                                    id="gender"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    touched={formik.touched.name}
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
                                                onChange={(e) => formik.setFieldValue("dob", e.target.value)}
                                                onBlur={formik.handleBlur}
                                                values={formik?.values?.dob || ""}
                                                errors={formik?.errors?.dob}
                                                touched={formik.touched.name}
                                            />
                                            <InputBox
                                                name="chss_number"
                                                label="CHSS Number"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                values={formik?.values?.chss_number || ""}
                                                errors={formik?.errors?.chss_number}
                                                touched={formik.touched.name}
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
                        </form>
                    </div>
                )}
            </Fragment>
        );
    }, [player, formik.values, verifiedMembers, nonVerifiedMembers, prefix, currentNonMember]);

    return renderMain;
};
