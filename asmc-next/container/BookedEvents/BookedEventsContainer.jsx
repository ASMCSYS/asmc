import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "@/components/auth/Sidebar";
import { fetchSingleMember } from "@/apis/members.api";
import { toast_popup } from "@/utils/toast";
import { Loader } from "@/components/common/Loader";
import { getCountDependent } from "@/utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CommonModal } from "@/components/common/Modal";
import { SlotsModal } from "@/components/auth/SlotsModal";
import { format, isBefore, isValid, parseISO, subDays } from "date-fns";
import { RenewModal } from "@/components/auth/RenewModal";
import { allowedPaymentForTheseMail, paymentUrl } from "@/utils/constants";
import { useFetchSingleMemberQuery } from "@/redux/auth/authApis";
import { initiateEventBookingPaymentApi } from "@/apis/bookings.api";

const BookedEventsContainer = (props) => {
    const { authData } = props;
    const { isLoading, data: memberData } = useFetchSingleMemberQuery({ _id: authData?._id }, { skip: !authData?._id });

    const handleSlotModal = (data) => {
        setSlotsData(data);
        setModalOpen(!modalOpen);
    };

    const initiatePayment = async (eventData) => {
        try {
            const paymentPayload = {
                amount: eventData.amount_paid,
                booking_id: eventData?.booking_id,
                customer_email: authData?.email,
                customer_phone: authData?.mobile,
                remarks: `Payment for event booking ---> Booking Id: ${eventData?.booking_id}, Event Name : ${eventData?.event_id?.event_name}, Event Id: ${eventData?.event_id?.event_id}, member id: ${authData?.member_id}`,
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
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
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
                                    {!isLoading && memberData?.events && memberData?.events.length > 0 ? (
                                        memberData?.events.map((obj, key) => {
                                            let paymentSuccess = obj.payment_status === "Success" ? true : false;
                                            return (
                                                <Fragment>
                                                    {!paymentSuccess && (
                                                        <div className="checkout__single">
                                                            <h5>
                                                                Please make the payment of {obj?.amount_paid} Rs to
                                                                confirm your below event booking.
                                                            </h5>
                                                            <div className="text-center cta-btn">
                                                                <button
                                                                    onClick={() => initiatePayment(obj)}
                                                                    className="cmn-button"
                                                                >
                                                                    Pay Now
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={`checkout__single`} key={key}>
                                                        <h5
                                                            className={`d-flex justify-content-between align-items-center`}
                                                        >
                                                            Event - {obj?.event_id?.event_name}
                                                            {paymentSuccess ? (
                                                                <span>
                                                                    Payment Success{" "}
                                                                    <FontAwesomeIcon
                                                                        icon={faCircleCheck}
                                                                        color="#0e7a31"
                                                                        fontSize={30}
                                                                        title="Payment Success"
                                                                    />
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    Payment Pending{" "}
                                                                    <FontAwesomeIcon
                                                                        icon={faCircleXmark}
                                                                        color="red"
                                                                        fontSize={30}
                                                                        title="Payment Pending"
                                                                    />
                                                                </span>
                                                            )}
                                                        </h5>
                                                        <div className={`plan-details-body`}>
                                                            <ul>
                                                                <li>
                                                                    <span>Event Name</span>
                                                                    <span>{obj?.event_id?.event_name}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Event Start Dates</span>
                                                                    <span>
                                                                        {format(
                                                                            obj?.event_id?.event_start_date,
                                                                            "dd-MM-yyyy"
                                                                        )}{" "}
                                                                        -{" "}
                                                                        {format(
                                                                            obj?.event_id?.event_end_date,
                                                                            "dd-MM-yyyy"
                                                                        )}
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                            <li>
                                                                <span>Location</span>
                                                                <span>{obj?.event_id?.location_id?.title}</span>
                                                            </li>
                                                        </div>
                                                        <div className={`plan-details-body`}>
                                                            {[...obj?.member_data, ...obj?.non_member_data].length >
                                                            0 ? (
                                                                <div className={`table-responsive`}>
                                                                    <h6 className="mb-3">Players Details</h6>
                                                                    <table className={`table`}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>
                                                                                    <strong>Sr. No.</strong>
                                                                                </th>
                                                                                <th>
                                                                                    <strong>Info</strong>
                                                                                </th>
                                                                                <th>
                                                                                    <strong>CHSS Number</strong>
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {[
                                                                                ...obj?.member_data,
                                                                                ...obj?.non_member_data,
                                                                            ].map((pobj, pkey) => {
                                                                                return (
                                                                                    <tr key={pkey}>
                                                                                        <td>{pkey + 1}</td>
                                                                                        <td>
                                                                                            Name: {pobj?.name}
                                                                                            <br />
                                                                                            Email: {pobj?.email}
                                                                                            <br />
                                                                                            Mobile: {pobj?.mobile}
                                                                                        </td>
                                                                                        <td>
                                                                                            {pobj?.chss_number || "-"}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                        <div className={`plan-details-body`}>
                                                            <ul>
                                                                <li>
                                                                    <span>Booking ID</span>
                                                                    <span>#{obj?.booking_id}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Event ID</span>
                                                                    <span>#{obj?.event_id?.event_id}</span>
                                                                </li>
                                                                {obj?.category_data ? (
                                                                    <li>
                                                                        <span>Category</span>
                                                                        <span>{obj?.category_data?.category_name}</span>
                                                                    </li>
                                                                ) : null}
                                                                <li>
                                                                    <span style={{ fontSize: 22 }}>
                                                                        <strong>
                                                                            Total Amount {paymentSuccess ? "" : "to be"}{" "}
                                                                            Paid
                                                                        </strong>
                                                                    </span>
                                                                    <span style={{ fontSize: 22 }}>
                                                                        {obj?.amount_paid} Rs.
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <h4>No Event Booked.</h4>
                                    )}
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

export default BookedEventsContainer;
