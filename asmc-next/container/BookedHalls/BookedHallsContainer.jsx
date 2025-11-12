import React, { Fragment } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "@/components/auth/Sidebar";
import { toast_popup } from "@/utils/toast";
import { format } from "date-fns";
import { useFetchSingleMemberQuery } from "@/redux/auth/authApis";
import { initiateRemainHallBookingPaymentApi } from "@/apis/bookings.api";
import { paymentUrl } from "@/utils/constants";

const BookedHallsContainer = (props) => {
    const { authData } = props;
    const { isLoading, data: memberData } = useFetchSingleMemberQuery({ _id: authData?._id }, { skip: !authData?._id });

    const handleSlotModal = (data) => {
        setSlotsData(data);
        setModalOpen(!modalOpen);
    };

    const initiatePayment = async (obj) => {
        try {
            const paymentPayload = {
                amount: obj.amount,
                booking_id: obj?.booking_id,
                customer_email: authData?.email,
                customer_phone: authData?.mobile,
                remarks: `Remaining amount of hall ---> Booking Id: ${obj?.booking_id}`,
            };
            const bookingPaymentRes = await initiateRemainHallBookingPaymentApi(paymentPayload);

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
                                    {!isLoading && memberData?.halls && memberData?.halls.length > 0 ? (
                                        memberData?.halls.map((obj, key) => {
                                            let paymentSuccess = obj.payment_status === "Success" ? true : false;

                                            const totalPayable =
                                                Number(obj?.hall_id?.booking_amount || 0) +
                                                Number(obj?.hall_id?.cleaning_charges || 0) +
                                                Number(obj?.hall_id?.refundable_deposit || 0) +
                                                Number(obj?.hall_id?.additional_charges || 0);

                                            const amountPaid = !paymentSuccess ? 0 : Number(obj?.amount_paid || 0);
                                            const pendingAmount = totalPayable - amountPaid;

                                            let paymentStatusLabel = "";
                                            let paymentStatusClass = "";

                                            if (paymentSuccess) {
                                                if (amountPaid >= totalPayable) {
                                                    paymentStatusLabel = "Fully Paid";
                                                    paymentStatusClass = "paid";
                                                } else if (amountPaid > 0 && amountPaid < totalPayable) {
                                                    paymentStatusLabel = "Partially Paid";
                                                    paymentStatusClass = "partial";
                                                } else {
                                                    paymentStatusLabel = "Not Paid";
                                                    paymentStatusClass = "pending";
                                                }
                                            } else {
                                                paymentStatusLabel = "Not Paid";
                                                paymentStatusClass = "pending";
                                            }

                                            return (
                                                <div className="hall-card" key={key}>
                                                    <div className="hall-header">
                                                        <img
                                                            src={obj?.hall_id?.images?.[0]}
                                                            alt="Hall"
                                                            className="hall-image"
                                                        />
                                                        <div className="hall-info">
                                                            <h3>{obj?.hall_id?.name}</h3>
                                                            <p className="location">
                                                                {obj?.hall_id?.location_id?.title} —{" "}
                                                                {obj?.hall_id?.sublocation_id?.title}
                                                            </p>
                                                            <p className="description">{obj?.hall_id?.description}</p>
                                                        </div>
                                                        <div className={`status-tag ${paymentStatusClass}`}>
                                                            {paymentStatusLabel}
                                                        </div>
                                                    </div>

                                                    <div className="hall-body">
                                                        <div className="section-box">
                                                            <h5>Booking Info</h5>
                                                            <ul>
                                                                <li>
                                                                    <strong>Booking ID:</strong> #{obj?.booking_id}
                                                                </li>
                                                                <li>
                                                                    <strong>Date:</strong>{" "}
                                                                    {format(obj?.booking_date, "dd-MM-yyyy")}
                                                                </li>
                                                                <li>
                                                                    <strong>Time Slot:</strong>{" "}
                                                                    {format(obj?.slot_from, "hh:mm a")} -{" "}
                                                                    {format(obj?.slot_to, "hh:mm a")}
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className="section-box financial-breakdown">
                                                            <h4 className="section-heading">Financial Breakdown</h4>
                                                            <ul className="breakdown-list">
                                                                <li>
                                                                    <span>Booking Amount:</span> ₹
                                                                    {obj?.hall_id?.booking_amount}
                                                                </li>
                                                                <li>
                                                                    <span>Cleaning Charges:</span> ₹
                                                                    {obj?.hall_id?.cleaning_charges}
                                                                </li>
                                                                <li>
                                                                    <span>Additional Charges:</span> ₹
                                                                    {obj?.hall_id?.additional_charges}
                                                                </li>
                                                                <li className="highlight total-payable">
                                                                    <strong>Total Payable (Excl. Deposit):</strong> ₹
                                                                    {totalPayable -
                                                                        Number(obj?.hall_id?.refundable_deposit)}
                                                                </li>
                                                                <li className="refundable-deposit">
                                                                    <span>Refundable Deposit (Paid upfront):</span>
                                                                    <span className="text-align-right">
                                                                        ₹{obj?.hall_id?.refundable_deposit}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            This amount is refundable after the event.
                                                                        </small>
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    <strong>Amount Paid:</strong> ₹{amountPaid}
                                                                </li>
                                                                <li>
                                                                    <strong>Pending Amount:</strong> ₹{pendingAmount}
                                                                </li>
                                                                {obj?.cancellation_charges > 0 && (
                                                                    <li className="cancellation-fee">
                                                                        <strong>Cancellation Charges:</strong> ₹
                                                                        {obj?.cancellation_charges}
                                                                    </li>
                                                                )}
                                                                {amountPaid >= totalPayable && (
                                                                    <li className="refund-status">
                                                                        <strong>Refund Status:</strong>{" "}
                                                                        <span className="tag refund">
                                                                            Deposit will be refunded post-event
                                                                        </span>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>

                                                        {obj?.hall_id?.terms && (
                                                            <div className="section-box cancellation-terms mt-3">
                                                                <h5>Cancellation Terms</h5>
                                                                <div
                                                                    className="terms-content"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: obj?.hall_id?.terms,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        )}

                                                        {pendingAmount > 0 && (
                                                            <div className="cta-btn text-center">
                                                                <button
                                                                    onClick={() =>
                                                                        initiatePayment({
                                                                            hall_id: obj?.hall_id?._id,
                                                                            booking_id: obj?.booking_id,
                                                                            amount: pendingAmount,
                                                                        })
                                                                    }
                                                                    className="cmn-button bounce"
                                                                >
                                                                    {amountPaid > 0
                                                                        ? "Pay Remaining Amount"
                                                                        : "Pay Now"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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

export default BookedHallsContainer;
