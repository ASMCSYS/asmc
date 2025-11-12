import { Formik } from "formik";
import { InputBox } from "../common/InputBox";
import * as yup from "yup";
import { Fragment, useState } from "react";
import { format, formatISO } from "date-fns";
import { sizeValues } from "@/utils/constants";
import ImageCropUpload from "../common/ImageCropUpload";

const FamilyMembersValidation = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string().required("Required"),
    gender: yup.string().required("Required"),
    mobile: yup.string().required("Required"),
    dob: yup.string().required("Required"),
    relation: yup.string().required("Required"),
    is_dependent: yup.string().required("Required"),
});

export const AddFamilyDetails = ({ familyMemberInitalval, submit }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="checkout__box text-align-left">
                        <Formik
                            initialValues={familyMemberInitalval}
                            onSubmit={(values) => submit(values)}
                            validationSchema={FamilyMembersValidation}
                            enableReinitialize
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                                <Fragment>
                                    <h5 className="text-align-center pb-4">Family Member Details</h5>
                                    <h4 className="text-align-center">Profile</h4>
                                    <div className="input-single">
                                        <label htmlFor="profileImage">Profile</label>
                                        <ImageCropUpload
                                            onUploadComplete={(serverPath, croppedFile) => {
                                                // Set the server path for form submission
                                                setFieldValue("profile", serverPath);

                                                // Optionally store the cropped file for other purposes
                                                console.log("Server path:", serverPath);
                                                console.log("Cropped file:", croppedFile);
                                            }}
                                            aspectRatio={1} // Square profile image
                                            minWidth={200}
                                            minHeight={200}
                                            maxWidth={800}
                                            maxHeight={800}
                                            quality={0.9}
                                            showPreview={true}
                                            maxSize={5 * 1024 * 1024} // 5MB
                                        />
                                        {errors.profile && (
                                            <span className="help-block with-errors">{errors.profile}</span>
                                        )}
                                        {/* Show existing profile image if available */}
                                        {values?.profile && typeof values.profile === "string" && (
                                            <div className="mt-3">
                                                <p className="text-muted mb-2">Current Profile Image:</p>
                                                <img
                                                    src={values.profile}
                                                    width={100}
                                                    height={100}
                                                    alt="Current profile"
                                                    className="rounded border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="input-group mb-1">
                                        <InputBox
                                            name="name"
                                            label="Name"
                                            onChange={handleChange("name")}
                                            values={values?.name || ""}
                                            errors={errors?.name}
                                            disabled={true}
                                        />
                                        <InputBox
                                            name="email"
                                            label="Email"
                                            type="email"
                                            onChange={handleChange("email")}
                                            values={values?.email || ""}
                                            errors={errors?.email}
                                        />
                                    </div>
                                    <div className="input-group mb-1">
                                        <InputBox
                                            name="mobile"
                                            label="Mobile"
                                            onChange={handleChange("mobile")}
                                            values={values?.mobile || ""}
                                            errors={errors?.mobile}
                                        />
                                        <div className="input-single">
                                            <label htmlFor={"gender"}>Gender</label>
                                            <select
                                                name="gender"
                                                id="gender"
                                                onChange={handleChange("gender")}
                                                value={values?.gender}
                                                className="form-select"
                                            >
                                                <option value={"Male"}>Male</option>
                                                <option value={"Female"}>Female</option>
                                            </select>
                                            {errors?.gender && (
                                                <span className="help-block with-errors">{errors.gender}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input-group mb-1">
                                        <InputBox
                                            name="dob"
                                            label="Date of Birth"
                                            type="date"
                                            onChange={(e) => setFieldValue("dob", formatISO(new Date(e.target.value)))}
                                            values={values?.dob ? format(values?.dob, "yyyy-MM-dd") : ""}
                                            errors={errors?.dob}
                                        />
                                        <InputBox
                                            name="relation"
                                            label="Relation"
                                            onChange={handleChange("relation")}
                                            values={values?.relation || ""}
                                            errors={errors?.relation}
                                        />
                                    </div>
                                    <div className="input-group mb-1">
                                        <div className="input-single">
                                            <label htmlFor={"is_dependent"}>Dependent Member</label>
                                            <select
                                                name="is_dependent"
                                                id="is_dependent"
                                                onChange={handleChange("is_dependent")}
                                                value={values?.is_dependent}
                                                className="form-select"
                                            >
                                                <option value={"true"}>Yes</option>
                                                <option value={"false"}>No</option>
                                            </select>
                                            {errors?.is_dependent && (
                                                <span className="help-block with-errors">{errors.is_dependent}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="input-single">
                                            <label htmlFor={"tshirt_size"}>T-shirt Size</label>
                                            <select
                                                name="tshirt_size"
                                                id="tshirt_size"
                                                onChange={handleChange("tshirt_size")}
                                                value={values?.tshirt_size || ""}
                                                className="form-select"
                                            >
                                                <option value={""}>Select</option>
                                                {sizeValues.map((item, index) => (
                                                    <option value={item}>{item}</option>
                                                ))}
                                            </select>
                                            {errors?.tshirt_size && (
                                                <span className="help-block with-errors">{errors.tshirt_size}</span>
                                            )}
                                        </div>
                                        <InputBox
                                            name="tshirt_name"
                                            label="Name on Tshirt"
                                            onChange={handleChange("tshirt_name")}
                                            values={values?.tshirt_name || ""}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <div className="input-singless">
                                            <div className="radio-input">
                                                <label htmlFor={"clothing_type"}>Clothing Type</label>
                                                <div className="input__radio-wrapper">
                                                    <div className="input__radio-single">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="clothing_type"
                                                            id="clothing_type_shortss"
                                                            value="Shorts"
                                                            onChange={() => {
                                                                setFieldValue("clothing_type", "Shorts");
                                                                setFieldValue("clothing_size", "");
                                                            }}
                                                            checked={values?.clothing_type === "Shorts"}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="clothing_type_shortss"
                                                        >
                                                            Shorts
                                                        </label>
                                                    </div>
                                                    <div className="input__radio-single">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="clothing_type"
                                                            id="clothing_type_trackk"
                                                            value="Track Pants"
                                                            onChange={() => {
                                                                setFieldValue("clothing_type", "Track Pants");
                                                                setFieldValue("clothing_size", "");
                                                            }}
                                                            checked={values?.clothing_type === "Track Pants"}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="clothing_type_trackk"
                                                        >
                                                            Track Pants
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors?.clothing_type && (
                                                    <span className="help-block with-errors">
                                                        {errors.clothing_type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {values.clothing_type && (
                                            <div className="input-single">
                                                <label
                                                    htmlFor={"clothing_size"}
                                                >{`${values.clothing_type} Size`}</label>
                                                <select
                                                    name="clothing_size"
                                                    id="clothing_size"
                                                    onChange={handleChange("clothing_size")}
                                                    value={values?.clothing_size || ""}
                                                    className="form-select"
                                                >
                                                    <option value={""}>Select</option>
                                                    {sizeValues.map((item, index) => (
                                                        <option value={item}>{item}</option>
                                                    ))}
                                                </select>
                                                {errors?.clothing_size && (
                                                    <span className="help-block with-errors">
                                                        {errors.clothing_size}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="section__cta text-start">
                                        <button
                                            type="submit"
                                            className="cmn-button"
                                            disabled={isLoading}
                                            onClick={() => handleSubmit()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};
