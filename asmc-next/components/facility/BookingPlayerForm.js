import { Fragment, useMemo, useState } from "react";
import { calculateAge } from "@/utils/helper";
import { InputBox } from "../common/InputBox";
import { toast_popup } from "@/utils/toast";
import { verifyMember } from "@/apis/members.api";
import { IsMember } from "../event/IsMember";
import { useFormik } from "formik";
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

export const BookingPlayerForm = ({
    index,
    verifiedMembers,
    setVerifiedMembers,
    nonVerifiedMembers,
    setNonVerifiedMembers,
    player,
    setPlayer,
}) => {
    const [prefix, setPrefix] = useState("P-");
    const [memberId, setMemberId] = useState(null);
    const [isMember, setIsMember] = useState(player?.is_member);

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
            setNonVerifiedMembers((prev) => [...prev, { ...values, is_member: "No" }]);
            setPlayer({ is_member: "No", ...values });

            toast_popup("Player details saved successfully!", "success");
            resetForm();
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const handleVerify = async () => {
        if (!memberId) {
            toast_popup("Please enter membership id", "error");
            return;
        }
        // check if other member is already verified
        if (verifiedMembers.find((item) => item?.member_id === player?.memberId)) {
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
                if (
                    verifiedMembers.find((m) =>
                        m?.secondary_member_id
                            ? m.secondary_member_id === data.secondary_member_id
                            : m.member_id === data.member_id
                    )
                ) {
                    toast_popup("This member is already verified", "error");
                    return;
                }
                if (
                    !verifiedMembers.find((m) =>
                        m?.secondary_member_id
                            ? m.secondary_member_id === data.secondary_member_id
                            : m.member_id === data.member_id
                    )
                ) {
                    setVerifiedMembers((prev) => [...prev, data]);
                    setPlayer(data);
                }
                toast_popup("Member verified successfully!", "success");
            } else {
                toast_popup(response.message || "Verification failed", "error");
            }
        } catch (err) {
            toast_popup(err?.message || "Error verifying member", "error");
        }
    };

    const renderMain = useMemo(() => {
        return (
            <Fragment>
                <IsMember
                    name="asmc_member"
                    onChange={(val) => {
                        setIsMember(val);
                    }}
                    value={isMember || ""}
                    title={`Is the player ${index + 1} member?`}
                    index={index}
                />
                {isMember && (
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
                                {isMember === "Yes" ? (
                                    <Fragment>
                                        <div className="col-md-6">
                                            {verifiedMembers.find((m) => m.member_id === player?.member_id) ? (
                                                <div className="mt-3">
                                                    <p>
                                                        <strong>Member Id:</strong> {memberId}
                                                    </p>
                                                    {player?.secondary_member_id && (
                                                        <p>
                                                            <strong>Secondary Member Id:</strong>{" "}
                                                            {player?.secondary_member_id}
                                                        </p>
                                                    )}
                                                    <p>
                                                        <strong>Name:</strong> {player?.name}
                                                    </p>
                                                    <p>
                                                        <strong>Mobile:</strong> {player?.mobile}
                                                    </p>
                                                    <p>
                                                        <strong>Email:</strong> {player?.email}
                                                    </p>
                                                    <p>
                                                        <strong>Gender:</strong> {player?.gender}
                                                    </p>
                                                    <p>
                                                        <strong>Age:</strong>{" "}
                                                        {player?.dob ? calculateAge(player?.dob) : "N/A"}
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
                                                            setMemberId(""); // reset ID on prefix change
                                                        }}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/^P-/, "");
                                                            setMemberId(value);
                                                        }}
                                                        values={memberId}
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
                                                        onClick={() => handleVerify()}
                                                    >
                                                        <i className="fas fa-user-check"></i> Fetch Details
                                                    </button>
                                                </Fragment>
                                            )}
                                        </div>
                                    </Fragment>
                                ) : player?.name && player?.email ? (
                                    <div className="mt-3">
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
                                            <strong>Age:</strong> {player.dob ? calculateAge(player.dob) : "N/A"}
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
    }, [verifiedMembers, prefix, nonVerifiedMembers, formik, isMember, player]);

    return renderMain;
};
