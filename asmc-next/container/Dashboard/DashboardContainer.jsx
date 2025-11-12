import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { Formik } from "formik";
import { Sidebar } from "@/components/auth/Sidebar";
import * as yup from "yup";
import { InputBox } from "@/components/common/InputBox";
import { toast_popup } from "@/utils/toast";

import { format, formatISO } from "date-fns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FamilyDetails } from "@/components/auth/FamilyDetails";
import { AddFamilyDetails } from "@/components/auth/AddFamilyDetails";
import { CommonModal } from "@/components/common/Modal";
import { updateProfile } from "@/apis/auth.api";
import { sizeValues } from "@/utils/constants";
import { TshirtInfoModal } from "@/components/auth/TshirtInfoModal";
import { TrackInfoModal } from "@/components/auth/TrackInfoModal";
import { NameInfoModal } from "@/components/auth/NameInfoModal";
import { useFetchSingleMemberQuery } from "@/redux/auth/authApis";
import ImageCropUpload from "@/components/common/ImageCropUpload";

const formValidation = yup.object().shape({
    name: yup.string().required("Required"),
    email: yup.string(),
    mobile: yup.string(),
    address: yup.string(),
    chss_number: yup.string(),
    chss_card_link: yup.string(),
    dob: yup.string(),
    gender: yup.string(),
    profile: yup.string(),
    family_details: yup.array(),
});

const initialFamilyData = {
    name: "",
    email: "",
    gender: "Male",
    mobile: "",
    dob: "",
    relation: "",
    is_dependent: true,
};

const DashboardContainer = (props) => {
    const { authData } = props;
    const [isLoading, setIsLoading] = useState(false);

    const { isLoading: memberDataLoading, data: memberData } = useFetchSingleMemberQuery(
        { _id: authData?._id },
        { skip: !authData?._id }
    );

    // const [memberData, setMemberData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [showTshirtInfo, setShowTshirtInfo] = useState(false);
    const [showTrackInfo, setShowTrackInfo] = useState(false);
    const [showNameInfo, setShowNameInfo] = useState(false);

    const [familyMemberInitalval, setFamilyMemberInitalval] = useState(initialFamilyData);
    const [familyEditKey, setFamilyEditKey] = useState(false);
    const [familyMemberData, setFamilyMemberData] = useState([]);

    const initialValues = {
        _id: authData?._id,
        name: authData?.name,
        email: authData?.email,
        mobile: authData?.mobile,
        address: authData?.address,
        chss_number: authData?.chss_number,
        chss_card_link: authData?.chss_card_link,
        dob: authData?.dob,
        gender: authData?.gender,
        profile: authData?.profile,
        tshirt_size: authData?.tshirt_size,
        tshirt_name: authData?.tshirt_name,
        clothing_type: authData?.clothing_type,
        clothing_size: authData?.clothing_size,
    };

    useEffect(() => {
        setFamilyMemberData(authData?.family_details || []);
    }, [authData?.family_details]);

    const onFormSubmit = async (values) => {
        setIsLoading(true);
        try {
            let payload = {
                ...values,
                name: authData?.name,
                email: authData?.email,
                mobile: authData?.mobile,
                chss_number: authData?.chss_number,
            };
            payload.family_details = familyMemberData;

            const response = await updateProfile(payload);
            if (response?.success) {
                toast_popup("Profile Updated Successfully", "success");
            } else {
                toast_popup(response?.message, "error");
            }
            setIsLoading(false);
        } catch (error) {
            toast_popup(error.message, "error");
            setIsLoading(false);
        }
    };

    const handleAddFamilyMember = () => {
        setModalOpen(true);
    };

    const handleDeleteFamilyMember = (data, key) => {
        let oldData = JSON.parse(JSON.stringify(familyMemberData));
        oldData.splice(key, 1);
        setFamilyMemberData(oldData);
    };

    const handleEditFamilyMember = (data, key) => {
        setFamilyEditKey(key);
        setFamilyMemberInitalval(data);
        setModalOpen(true);
    };

    const FamilyMemberComponent = () => {
        const onFamilySubmit = (val) => {
            let oldData = JSON.parse(JSON.stringify(familyMemberData));

            if (familyEditKey !== false) {
                oldData[familyEditKey] = val;
            } else {
                oldData.push(val);
            }
            setFamilyMemberData(oldData);
            setFamilyMemberInitalval(initialFamilyData);
            setFamilyEditKey(false);
            setModalOpen(false);
        };

        return <AddFamilyDetails familyMemberInitalval={familyMemberInitalval} submit={onFamilySubmit} />;
    };

    // const initiateApp = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await fetchSingleMember(authData._id);
    //         if (res.success) {
    //             setMemberData(res?.result);
    //         } else {
    //             toast_popup(res?.message, "error");
    //         }
    //     } catch (error) {
    //         toast_popup(error?.response?.data?.message || error?.message, "error");
    //     }
    //     setIsLoading(false);
    // };

    // useEffect(() => {
    //     if (authData?._id) initiateApp();
    // }, [authData]);

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
                                                            <span className="help-block with-errors">
                                                                {errors.profile}
                                                            </span>
                                                        )}
                                                        {/* Show existing profile image if available */}
                                                        {values?.profile && typeof values.profile === "string" && (
                                                            <div className="mt-3">
                                                                <p className="text-muted mb-2">
                                                                    Current Profile Image:
                                                                </p>
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
                                                    <div className="input-group">
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
                                                            onChange={() => console.log("email")}
                                                            values={values?.email || ""}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="input-group text-align-left">
                                                        <InputBox
                                                            name="mobile"
                                                            label="Mobile Number"
                                                            onChange={() => console.log("mobile")}
                                                            values={values?.mobile || ""}
                                                            disabled={true}
                                                        />
                                                        <InputBox
                                                            name="chss_number"
                                                            label="CHSS Number"
                                                            onChange={handleChange("chss_number")}
                                                            values={values?.chss_number || ""}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="input-group text-align-left">
                                                        <InputBox
                                                            name="dob"
                                                            label="Date of Birth"
                                                            type="date"
                                                            onChange={(e) =>
                                                                setFieldValue(
                                                                    "dob",
                                                                    formatISO(new Date(e.target.value))
                                                                )
                                                            }
                                                            values={
                                                                values?.dob ? format(values?.dob, "yyyy-MM-dd") : ""
                                                            }
                                                        />
                                                        <div className="input-single">
                                                            <label htmlFor={"gender"}>Gender</label>
                                                            <select
                                                                name="gender"
                                                                id="gender"
                                                                onChange={handleChange("gender")}
                                                                value={values?.gender || ""}
                                                                className="form-select"
                                                            >
                                                                <option value={"Male"}>Male</option>
                                                                <option value={"Female"}>Female</option>
                                                            </select>
                                                            {errors?.gender && (
                                                                <span className="help-block with-errors">
                                                                    {errors.gender}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <InputBox
                                                        name="address"
                                                        label="Address"
                                                        onChange={handleChange("address")}
                                                        values={values?.address || ""}
                                                    />
                                                    <div className="input-group">
                                                        <div className="input-single">
                                                            <label htmlFor={"tshirt_size"}>
                                                                T-shirt Size
                                                                <span
                                                                    className="btn btn-done btn-blue no-border"
                                                                    onClick={() => setShowTshirtInfo(true)}
                                                                >
                                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                                </span>
                                                            </label>
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
                                                                <span className="help-block with-errors">
                                                                    {errors.tshirt_size}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <InputBox
                                                            name="tshirt_name"
                                                            label={
                                                                <>
                                                                    Name on T-shirt{" "}
                                                                    <span
                                                                        className="btn btn-done btn-blue no-border"
                                                                        onClick={() => setShowNameInfo(true)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faInfoCircle} />
                                                                    </span>
                                                                </>
                                                            }
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
                                                                            id="clothing_type_shorts"
                                                                            value="Shorts"
                                                                            onChange={() => {
                                                                                setFieldValue(
                                                                                    "clothing_type",
                                                                                    "Shorts"
                                                                                );
                                                                                setFieldValue("clothing_size", "");
                                                                            }}
                                                                            checked={values?.clothing_type === "Shorts"}
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="clothing_type_shorts"
                                                                        >
                                                                            Shorts
                                                                        </label>
                                                                    </div>
                                                                    <div className="input__radio-single">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="clothing_type"
                                                                            id="clothing_type_track"
                                                                            value="Track Pants"
                                                                            onChange={() => {
                                                                                setFieldValue(
                                                                                    "clothing_type",
                                                                                    "Track Pants"
                                                                                );
                                                                                setFieldValue("clothing_size", "");
                                                                            }}
                                                                            checked={
                                                                                values?.clothing_type === "Track Pants"
                                                                            }
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="clothing_type_track"
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
                                                                <label htmlFor={"clothing_size"}>
                                                                    {`${values.clothing_type} Size`}
                                                                    <span
                                                                        className="btn btn-done btn-blue no-border"
                                                                        onClick={() => setShowTrackInfo(true)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faInfoCircle} />
                                                                    </span>
                                                                </label>
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
                                                    <h5 className="family-flex">
                                                        Family Details
                                                        {/* <button className="btn-info icon-button" onClick={() => handleAddFamilyMember()}><FontAwesomeIcon icon={faPlusCircle} /></button> */}
                                                    </h5>

                                                    {values?.family_details?.map((item, index) => (
                                                        <FamilyDetails key={index} values={item} />
                                                    ))}

                                                    {familyMemberData && familyMemberData.length > 0 ? (
                                                        <Fragment>
                                                            <div className="row">
                                                                {familyMemberData.map((obj, key) => {
                                                                    return (
                                                                        <div
                                                                            className="col-sm-10 col-md-6 col-xl-6 section__col pt-4"
                                                                            key={key}
                                                                        >
                                                                            <FamilyDetails
                                                                                values={obj}
                                                                                editDetails={() =>
                                                                                    handleEditFamilyMember(obj, key)
                                                                                }
                                                                                deleteDetails={() =>
                                                                                    handleDeleteFamilyMember(obj, key)
                                                                                }
                                                                            />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </Fragment>
                                                    ) : null}

                                                    <CommonModal
                                                        open={modalOpen}
                                                        onClose={() => setModalOpen(false)}
                                                        children={<FamilyMemberComponent />}
                                                        className="family-modal"
                                                    />

                                                    <CommonModal
                                                        open={showTshirtInfo}
                                                        onClose={() => setShowTshirtInfo(false)}
                                                        children={<TshirtInfoModal />}
                                                    />

                                                    <CommonModal
                                                        open={showTrackInfo}
                                                        onClose={() => setShowTrackInfo(false)}
                                                        children={<TrackInfoModal />}
                                                    />
                                                    <CommonModal
                                                        open={showNameInfo}
                                                        onClose={() => setShowNameInfo(false)}
                                                        children={<NameInfoModal />}
                                                    />

                                                    <div className="text-center cta-btn">
                                                        <button
                                                            type="submit"
                                                            className="cmn-button"
                                                            onClick={() => handleSubmit()}
                                                            disabled={isLoading}
                                                        >
                                                            Update
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

export default DashboardContainer;
