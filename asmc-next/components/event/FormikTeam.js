const FormikTeam = () => {
    return (
        <Fragment>
            {formData.are_you_member !== "" && (
                <div className="col-md-12 p-0 pb-3">
                    <form onSubmit={memberFormik.handleSubmit} className="p-4 border rounded w-96 mx-auto">
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
                                                    prefix="P-"
                                                    label="Enter your membership id"
                                                    onChange={(e) => {
                                                        // check if other member is already verified
                                                        if (
                                                            verifiedMembers.find(
                                                                (item) => item?.member_id === e.target.value
                                                            )
                                                        ) {
                                                            toast_popup("This member is already verified", "error");
                                                            return;
                                                        }
                                                        memberFormik.setFieldValue("member_id", e.target.value);
                                                    }}
                                                    values={memberFormik?.values?.member_id || ""}
                                                    errors={memberFormik?.errors?.member_id}
                                                    disabled={findVerifiedMember(memberFormik?.values?.member_id)}
                                                />
                                                {findVerifiedMember(memberFormik?.values?.member_id) ? (
                                                    <RenderVerifiedMember member_id={memberFormik?.values?.member_id} />
                                                ) : (
                                                    <button
                                                        className="btn btn-primary mt-2"
                                                        onClick={() => handleVerify(memberFormik?.values?.member_id)}
                                                    >
                                                        <i className="fas fa-user-check"></i> Fetch Details
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
                                                            ? format(memberFormik?.values?.dob, "yyyy-MM-dd")
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
        </Fragment>
    );
};
