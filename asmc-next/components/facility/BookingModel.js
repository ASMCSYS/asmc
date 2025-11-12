import { getNextPlan, initiateBookingPaymentApi, initiateRenewPaymentApi } from "@/apis/bookings.api";
import { toast_popup } from "@/utils/toast";
import { Formik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { InputBox } from "../common/InputBox";
import { verifyMember } from "@/apis/members.api";
import * as yup from "yup";
import { paymentUrl } from "@/utils/constants";
import { format } from "date-fns";
import { BookingPlayerForm } from "./BookingPlayerForm";

export const BookingModal = ({ data, selectedSlot, selectedDate, authData }) => {
    const [verifiedMember, setVerifiedMember] = useState([]);
    const [nonVerifiedMember, setNonVerifiedMember] = useState([]);

    const [players, setPlayers] = useState(
        Array.from({ length: selectedSlot?.no_of_player }).map(() => ({
            is_member: "", // or "Yes"/"No"
            data: null,
        }))
    );

    const confirmBooking = async (values) => {
        try {
            const players = [...verifiedMember, ...nonVerifiedMember];

            const plan_details = {
                _id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?._id : null,
                plan_id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_id : null,
                plan_type: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_type : null,
                plan_name: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_name : null,
                price: parseInt(nonVerifiedMember.length > 0 ? selectedSlot.non_price : selectedSlot.price),
                day: selectedSlot?.day,
                booking_date: selectedDate?.value,
                start_time: format(selectedSlot?.start_time, "HH:mm a"),
                end_time: format(selectedSlot?.end_time, "HH:mm a"),
            };

            let payload = {
                amount: parseInt(nonVerifiedMember.length > 0 ? selectedSlot.non_price : selectedSlot.price),
                customer_email: authData.email,
                customer_phone: authData.mobile,
                remarks: `Booking Payment Member Id: ${authData?.member_id}`,
                batch_id: selectedSlot?._id,
                players: players,
                activity_id: data?._id,
                plan_details: plan_details,
                booking_date: selectedDate?.value,
                booking_time: format(selectedSlot?.start_time, "HH:mm a"),
            };
            const response = await initiateBookingPaymentApi(payload);

            const { accessCode, encryptedData, order_id } = response.result;

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

            form.submit(); // Submit form to CCAvenue
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    return (
        <div className="container pt-lg-5">
            <div className="row  justify-content-center">
                {data ? (
                    <div
                        className="col-12 col-md-12 card shadow-lg"
                        style={{ border: "1px solid #ddd", borderRadius: "10px" }}
                    >
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className="text-center">Booking Details</h5>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Activity Name:</strong> {data?.name}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Location:</strong> {data?.location?.[0]?.label}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Batch Name</strong> {selectedSlot?.batch_name} -{" "}
                                        {selectedSlot?.batch_type}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Selected Date</strong>{" "}
                                        {format(new Date(selectedDate?.value), "dd-MM-yyyy")}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Selected Slot</strong> {format(selectedSlot?.start_time, "HH:mm a")} -{" "}
                                        {format(selectedSlot?.end_time, "HH:mm a")}
                                    </p>
                                </div>
                            </div>

                            {selectedSlot?.no_of_player > 0 && (
                                <Formik
                                    initialValues={{}}
                                    // validationSchema={bookingSchema}
                                    onSubmit={(values) => confirmBooking(values)}
                                    enableReinitialize
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                                        <Fragment>
                                            <div className="input-group">
                                                <p>Please enter the name of all players required for this game.</p>
                                            </div>
                                            <div className="container">
                                                {Array.from({ length: selectedSlot?.no_of_player }, (_, i) => (
                                                    <BookingPlayerForm
                                                        key={i}
                                                        index={i}
                                                        player={players[i]}
                                                        setPlayer={(data) => {
                                                            const newPlayers = [...players];
                                                            newPlayers[i] = data;
                                                            setPlayers(newPlayers);
                                                        }}
                                                        verifiedMembers={verifiedMember}
                                                        setVerifiedMembers={setVerifiedMember}
                                                        nonVerifiedMembers={nonVerifiedMember}
                                                        setNonVerifiedMembers={setNonVerifiedMember}
                                                    />
                                                ))}
                                            </div>
                                            {verifiedMember.length + nonVerifiedMember.length ===
                                                parseInt(selectedSlot?.no_of_player) && (
                                                <Fragment>
                                                    <div className="input-group">
                                                        <h5>
                                                            <strong>Total Amount:</strong>{" "}
                                                            {nonVerifiedMember.length > 0
                                                                ? selectedSlot.non_price
                                                                : selectedSlot.price}{" "}
                                                            Rs.
                                                        </h5>
                                                    </div>

                                                    <div className="text-center cta-btn">
                                                        <button
                                                            type="submit"
                                                            className="cmn-button"
                                                            onClick={() => handleSubmit()}
                                                        >
                                                            Pay Now
                                                        </button>
                                                    </div>
                                                </Fragment>
                                            )}
                                        </Fragment>
                                    )}
                                </Formik>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="col-12 text-center mt-5 mb-5">
                        No plan available to upgrade, please contact admin for more details.
                    </div>
                )}
            </div>
        </div>
    );
};
