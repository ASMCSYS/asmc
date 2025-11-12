import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { format, addDays, isSunday, isSameDay, startOfDay, isBefore } from "date-fns";
import { useFetchHallsBookedQuery } from "@/redux/masters/mastersApis";
import { initiateHallBookingApi, initiateHallBookingPaymentApi } from "@/apis/bookings.api";
import { toast_popup } from "@/utils/toast";
import { paymentUrl } from "@/utils/constants";
import { useGetSettingsQuery } from "@/redux/common/commonApis";

export const HallBookingDetails = ({ data, authData }) => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSundays, setAvailableSundays] = useState([]);
    const [paymentMode, setPaymentMode] = useState("advance");
    const [purpose, setPurpose] = useState("");
    const { data: bookedHall } = useFetchHallsBookedQuery({ hall_id: data?._id }, { skip: !data?.hall_id });
    const { data: settings } = useGetSettingsQuery();

    const today = new Date();

    useEffect(() => {
        const sundays = [];
        const bookingWindow = Number(
            data?.advance_booking_period || parseInt(settings?.json?.hall_booking_prior_days) || 90
        );
        const today = startOfDay(new Date());
        const endDate = addDays(today, bookingWindow);

        let date = today;

        while (isBefore(date, endDate) || date.getTime() === endDate.getTime()) {
            if (isSunday(date)) {
                sundays.push(date);
            }
            date = addDays(date, 1);
        }

        setAvailableSundays(sundays);
    }, [data]);

    const isBooked = (date) => {
        return bookedHall?.some((booked) => isSameDay(booked, date));
    };

    const totalAmount =
        Number(data?.booking_amount || 0) + Number(data?.refundable_deposit || 0) + Number(data?.cleaning_charges || 0);

    const advanceAmount = Number(data?.advance_payment_amount || 0);

    const finalPayableAmount = paymentMode === "full" ? totalAmount : advanceAmount;

    const confirmBooking = async () => {
        try {
            if (!selectedDate || !selectedSlot) {
                alert("Please select a date and slot.");
                return;
            }

            if (!purpose.trim()) {
                alert("Please provide the purpose of your hall booking.");
                return;
            }

            const payload = {
                hall_id: data?._id,
                member_id: authData?._id,
                slot_from: selectedSlot?.from,
                slot_to: selectedSlot?.to,
                booking_date: selectedDate,
                is_full_payment: paymentMode === "full",
                purpose: purpose,
            };

            const bookingRes = await initiateHallBookingApi(payload);
            if (bookingRes.success) {
                const paymentPayload = {
                    amount: bookingRes?.result?.amount_paid,
                    booking_id: bookingRes?.result?.booking_id,
                    customer_name: authData?.name,
                    customer_email: authData?.email,
                    customer_phone: authData?.mobile,
                    remarks: `Payment for hall booking ---> Booking Id: ${bookingRes?.result?.booking_id}, Hall Name : ${data?.name}, Hall Id: ${data?.hall_id}, member id: ${authData?.member_id}`,
                };
                const bookingPaymentRes = await initiateHallBookingPaymentApi(paymentPayload);
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

    return (
        <div className="hall-booking-wrapper container my-5 animate__animated animate__fadeInUp">
            <div className="back-button d-flex align-items-center mb-3">
                <a href="/" onClick={(e) => (e.preventDefault(), router.back())}>
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
                    <span>Back</span>
                </a>
            </div>

            <h2 className="mb-3">{data?.name}</h2>
            <p className="text-muted">{data?.description}</p>

            {/* Amount Cards */}
            <div className="row g-4 mt-4">
                {[
                    { label: "Booking Amount", value: data?.booking_amount },
                    { label: "Refundable Deposit", value: data?.refundable_deposit },
                    { label: "Cleaning Charges", value: data?.cleaning_charges },
                    { label: "Additional Charges For Hall (Per Hour)", value: data?.additional_charges },
                    { label: "Advance Payment", value: data?.advance_payment_amount },
                    { label: "Other Charges if any", value: data?.other_charges },
                ].map((item, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="amount-card shadow-sm p-3 rounded bg-light h-100 animate__animated animate__fadeInUp">
                            <h6 className="fw-bold">{item.label}</h6>
                            <p className="amount">₹{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="notes mt-4">
                <h5>Important Notes:</h5>
                <ul>
                    <li>Hall can only be booked for Sundays.</li>
                    <li>Booking is allowed only within {data?.advance_booking_period} days from today.</li>
                    <li>
                        Additional Charges are applicable <strong>per hour</strong> beyond slot timing.
                    </li>
                    <li>Select an available Sunday below to proceed.</li>
                </ul>
            </div>

            {/* Sunday Date Selection */}
            <div className="mt-5">
                <h5>Select Booking Date (Available Sundays):</h5>
                <div className="row g-2 mt-2">
                    {availableSundays.map((sunday, idx) => {
                        const isDisabled = isBooked(sunday);
                        const isSelected = selectedDate?.toDateString() === sunday.toDateString();
                        return (
                            <div key={idx} className="col-6 col-sm-4 col-md-3">
                                <button
                                    className={`btn w-100 ${isSelected ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => !isDisabled && setSelectedDate(sunday)}
                                    disabled={isDisabled}
                                >
                                    {format(sunday, "dd MMM yyyy")}{" "}
                                    {isDisabled && <span className="text-danger fw-bold">(Booked)</span>}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Slot Selection */}
            <div className="slot-info mt-4">
                <h5>Select a Time Slot:</h5>
                <div className="row g-2 mt-2">
                    {data?.time_slots?.map((slot, i) => {
                        const fromTime = new Date(slot.from);
                        const toTime = new Date(slot.to);

                        const selectedFromTime = selectedSlot ? new Date(selectedSlot.from) : null;
                        const selectedToTime = selectedSlot ? new Date(selectedSlot.to) : null;

                        const isSelected =
                            selectedFromTime?.getHours() === fromTime.getHours() &&
                            selectedFromTime?.getMinutes() === fromTime.getMinutes() &&
                            selectedToTime?.getHours() === toTime.getHours() &&
                            selectedToTime?.getMinutes() === toTime.getMinutes();

                        return (
                            <div key={i} className="col-6 col-md-4 col-lg-3">
                                <button
                                    className={`btn w-100 text-start shadow-sm ${
                                        isSelected ? "btn-primary text-white" : "btn-outline-primary"
                                    }`}
                                    onClick={() => {
                                        if (!selectedDate) {
                                            alert("Please select a booking date first.");
                                            return;
                                        }

                                        // Combine selected date with slot time
                                        const from = new Date(selectedDate);
                                        from.setHours(fromTime.getHours(), fromTime.getMinutes(), 0, 0);

                                        const to = new Date(selectedDate);
                                        to.setHours(toTime.getHours(), toTime.getMinutes(), 0, 0);

                                        setSelectedSlot({ from, to });
                                    }}
                                    disabled={!selectedDate}
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                    {format(fromTime, "hh:mm a")} - {format(toTime, "hh:mm a")}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Purpose Field */}
            {selectedDate && selectedSlot && (
                <div className="mt-4">
                    <h5>Purpose of Booking:</h5>
                    <div className="mt-2">
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Please describe the purpose of your hall booking..."
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                        />
                    </div>
                </div>
            )}

            {/* Payment Mode */}
            {selectedDate && selectedSlot && (
                <div className="mt-5">
                    <h5>Select Payment Option:</h5>
                    <div className="d-flex gap-3 mt-2">
                        <div className="form-check">
                            <input
                                type="radio"
                                id="advance"
                                name="paymentMode"
                                className="form-check-input"
                                checked={paymentMode === "advance"}
                                onChange={() => setPaymentMode("advance")}
                            />
                            <label className="form-check-label" htmlFor="advance">
                                Pay Advance Only (₹{advanceAmount})
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                type="radio"
                                id="full"
                                name="paymentMode"
                                className="form-check-input"
                                checked={paymentMode === "full"}
                                onChange={() => setPaymentMode("full")}
                            />
                            <label className="form-check-label" htmlFor="full">
                                Pay Full Amount (₹{totalAmount})
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Booking Button */}
            {selectedDate && selectedSlot && purpose.trim() && (
                <div className="mt-4 text-center">
                    <button className="btn btn-success px-4 py-2 shadow" onClick={confirmBooking}>
                        Continue Booking — ₹{finalPayableAmount} (
                        {paymentMode === "full" ? "Full Payment" : "Advance Only"})
                    </button>
                </div>
            )}
        </div>
    );
};
