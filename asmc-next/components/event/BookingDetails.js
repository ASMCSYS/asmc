import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Col } from "react-bootstrap";
import { format, formatISO } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleLeft, faAngleRight, faPray } from "@fortawesome/free-solid-svg-icons";
import { CommonModal } from "../common/Modal";
import { BookingModal } from "./BookingModel";
import { Formik, useFormik } from "formik";
import { InputBox } from "../common/InputBox";
import { verifyMember } from "@/apis/members.api";
import { IsMember } from "./IsMember";
import { calculateAge } from "@/utils/helper";
import EligibleCategories from "./EligibleCategories";
import { Summary } from "./Summary";
import { initiateEventBookingApi, initiateEventBookingPaymentApi } from "@/apis/bookings.api";
import { toast_popup } from "@/utils/toast";
import { paymentUrl } from "@/utils/constants";
import { SingleEventForm } from "./SingleEventForm";
import { DoubleEventForm } from "./DoubleEventForm";
import { useFetchSingleMemberQuery } from "@/redux/auth/authApis";
import Link from "next/link";
import { TeamEventForm } from "./TeamEventForm";

export const BookingDetails = ({ data, authData }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        yourself: authData ? "" : "No",
        are_you_member: "",
        partner_member: "",
        team_members: [{ name: "", email: "", gender: "", mobile: "", dob: "", chss_number: "" }],
    });
    const [verifiedMembers, setVerifiedMembers] = useState([]);
    const [nonVerifiedMembers, setNonVerifiedMembers] = useState([]);
    const [showPayButton, setShowPayButton] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [totalAmountToPay, setTotalAmountToPay] = useState(0);
    const [alreadyBooked, setAlreadyBooked] = useState(false);

    console.log(verifiedMembers, "verifiedMembers");
    console.log(nonVerifiedMembers, "nonVerifiedMembers");

    const { isLoading: memberDataLoading, data: memberData } = useFetchSingleMemberQuery(
        { _id: authData?._id },
        { skip: !authData?._id }
    );

    useEffect(() => {
        if (memberData && memberData?.events && memberData?.events.length > 0) {
            const isBooked = memberData?.events.find((item) => item.event_id.event_id === data?.event_id);
            setAlreadyBooked(!!isBooked);
        }
    }, [memberData]);

    useEffect(() => {
        let showPay = false;

        if (data?.event_type === "Single") {
            const isMember = formData?.are_you_member === "Yes";
            const isNonMember = formData?.are_you_member === "No";

            if (formData?.yourself === "Yes") {
                showPay = true;
            } else if (isMember && verifiedMembers.length === 0) {
                showPay = false;
            } else if (isNonMember && nonVerifiedMembers.length === 0) {
                showPay = false;
            } else {
                showPay = formData?.are_you_member !== "";
            }
        } else if (data?.event_type === "Double") {
            const isMember1 = formData?.are_you_member === "Yes";
            const isMember2 = formData?.partner_member === "Yes";

            const bothAreMembers = isMember1 && isMember2;
            const bothAreNonMembers = !isMember1 && !isMember2;
            const oneIsMember = isMember1 !== isMember2; // One is a member, one is not

            if (bothAreMembers) {
                showPay = verifiedMembers.filter((member) => member !== null).length >= 2;
            } else if (bothAreNonMembers) {
                showPay = nonVerifiedMembers.filter((member) => member !== null).length >= 2;
            } else if (oneIsMember) {
                showPay =
                    verifiedMembers.filter((member) => member !== null).length >= 1 &&
                    nonVerifiedMembers.filter((member) => member !== null).length >= 1;
            }
        }

        setShowPayButton(showPay);
    }, [
        verifiedMembers,
        nonVerifiedMembers,
        data?.event_type,
        formData?.yourself,
        formData?.are_you_member,
        formData?.partner_member,
        selectedCategory,
    ]);

    const handleInitiatePayment = async () => {
        try {
            const firstUser =
                verifiedMembers.filter((member) => member !== null).length > 0
                    ? verifiedMembers.filter((member) => member !== null)[0]
                    : nonVerifiedMembers.filter((member) => member !== null).length > 0
                      ? nonVerifiedMembers.filter((member) => member !== null)[0]
                      : null;

            if (!firstUser) {
                toast_popup("Please select at least one member", "error");
                return;
            }
            const payload = {
                event_id: data?._id,
                category_id: selectedCategory?._id,
                booking_form_data: formData,
                category_data: selectedCategory,
                member_data:
                    formData?.yourself === "Yes"
                        ? [
                              {
                                  _id: authData?._id,
                                  member_id: authData?.member_id,
                                  name: authData?.name,
                                  email: authData?.email,
                                  mobile: authData?.mobile,
                                  gender: authData?.gender,
                                  dob: authData?.dob,
                              },
                          ]
                        : verifiedMembers.filter((member) => member !== null),
                non_member_data: nonVerifiedMembers.filter((member) => member !== null),
                amount_paid: totalAmountToPay,
            };

            const bookingRes = await initiateEventBookingApi(payload);

            if (bookingRes.success) {
                const paymentPayload = {
                    amount: parseInt(totalAmountToPay),
                    booking_id: bookingRes?.result?.booking_id,
                    customer_name: firstUser?.name,
                    customer_email: firstUser?.email,
                    customer_phone: firstUser?.mobile,
                    remarks: `Payment for event booking ---> Booking Id: ${bookingRes?.result?.booking_id}, Event Name : ${data?.event_name}, Event Id: ${data?.event_id}, member id: ${firstUser?.member_id}`,
                };
                const bookingPaymentRes = await initiateEventBookingPaymentApi(paymentPayload);

                if (bookingPaymentRes.success) {
                    const { accessCode, encryptedData, order_id } = bookingPaymentRes.result;

                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = paymentUrl;
                    form.style.display = "none";

                    const accessCodeField = document.createElement("input");
                    accessCodeField.name = "access_code";
                    accessCodeField.value = accessCode;
                    form.appendChild(accessCodeField);

                    const encRequestField = document.createElement("input");
                    encRequestField.name = "encRequest";
                    encRequestField.value = encryptedData;
                    form.appendChild(encRequestField);

                    const orderIdField = document.createElement("input");
                    orderIdField.name = "order_id";
                    orderIdField.value = order_id;
                    form.appendChild(orderIdField);

                    document.body.appendChild(form);

                    form.submit();
                } else {
                    toast_popup(bookingPaymentRes?.message, "error");
                }
            } else {
                toast_popup(bookingRes?.message, "error");
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    const RenderSingleEvent = useMemo(() => {
        return (
            <SingleEventForm
                data={data}
                authData={authData}
                formData={formData}
                setFormData={setFormData}
                setNonVerifiedMembers={setNonVerifiedMembers}
                nonVerifiedMembers={nonVerifiedMembers}
                verifiedMembers={verifiedMembers}
                setVerifiedMembers={setVerifiedMembers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setTotalAmountToPay={setTotalAmountToPay}
                totalAmountToPay={totalAmountToPay}
                showPayButton={showPayButton}
                handleInitiatePayment={handleInitiatePayment}
                setShowPayButton={setShowPayButton}
            />
        );
    }, [
        formData,
        nonVerifiedMembers,
        verifiedMembers,
        selectedCategory,
        showPayButton,
        totalAmountToPay,
        authData,
        data,
    ]);

    const RenderDoubleEvent = useMemo(() => {
        return (
            <DoubleEventForm
                data={data}
                authData={authData}
                formData={formData}
                setFormData={setFormData}
                setNonVerifiedMembers={setNonVerifiedMembers}
                nonVerifiedMembers={nonVerifiedMembers}
                verifiedMembers={verifiedMembers}
                setVerifiedMembers={setVerifiedMembers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setTotalAmountToPay={setTotalAmountToPay}
                totalAmountToPay={totalAmountToPay}
                showPayButton={showPayButton}
                handleInitiatePayment={handleInitiatePayment}
                setShowPayButton={setShowPayButton}
            />
        );
    }, [
        formData,
        nonVerifiedMembers,
        verifiedMembers,
        selectedCategory,
        showPayButton,
        totalAmountToPay,
        authData,
        data,
    ]);

    const RenderTeamEvent = useMemo(() => {
        return (
            <TeamEventForm
                data={data}
                authData={authData}
                formData={formData}
                setFormData={setFormData}
                setNonVerifiedMembers={setNonVerifiedMembers}
                nonVerifiedMembers={nonVerifiedMembers}
                verifiedMembers={verifiedMembers}
                setVerifiedMembers={setVerifiedMembers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setTotalAmountToPay={setTotalAmountToPay}
                totalAmountToPay={totalAmountToPay}
                showPayButton={showPayButton}
                handleInitiatePayment={handleInitiatePayment}
                setShowPayButton={setShowPayButton}
            />
        );
    }, [
        formData,
        nonVerifiedMembers,
        verifiedMembers,
        selectedCategory,
        showPayButton,
        totalAmountToPay,
        authData,
        data,
    ]);

    return (
        <div className="row align-items-center section__row">
            <div className="product-description__content">
                <div className="product-description__content-head flex align-items-center justify-content-start mb-3">
                    <a href="/" onClick={(e) => (e.preventDefault(), router.back())}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </a>
                    <h5 className="m-0">{data?.event_name}</h5>
                </div>
                {alreadyBooked ? (
                    <div className="container">
                        <div className="product-description__content-head">
                            <h6 className="text-danger mb-2">
                                You have already booked this event. Please check your bookings in the profile section.
                                You will not be able to book this event again until the admin allows second bookings
                                from the same member.
                            </h6>
                        </div>
                        <div className="text-center cta-btn mt-3">
                            <Link href={`/booked-events`} className="cmn-button">
                                Go to Profile
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Fragment>
                        <div className="product-description__content-head">
                            <h6>Please fill below details to book the event</h6>
                        </div>
                        <div className="container pt-4">
                            {data?.event_type === "Single" && RenderSingleEvent}
                            {data?.event_type === "Double" && RenderDoubleEvent}
                            {data?.event_type === "Team" && RenderTeamEvent}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
};
