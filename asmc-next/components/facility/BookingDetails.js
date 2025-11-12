"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col } from "react-bootstrap";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { CommonModal } from "../common/Modal";
import { BookingModal } from "./BookingModel";
import { useGetSettingsQuery } from "@/redux/common/commonApis";

export const BookingDetails = ({ data, authData, isAuth, currentFacility }) => {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showBookingModel, setShowBookingModel] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const { data: settings } = useGetSettingsQuery();

    const generateNextDays = (daysCount = 14) => {
        const today = new Date();
        return Array.from({ length: daysCount }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return {
                label: format(date, "EEE, dd MMM"),
                value: format(date, "yyyy-MM-dd"),
                shortDay: format(date, "EEE"), // "Mon", "Tue", etc.
            };
        });
    };

    useEffect(() => {
        const nextDays = generateNextDays(parseInt(settings?.json?.booking_prior_days) || 15);
        setAvailableDates(nextDays);
        setSelectedDate(nextDays[0]);
    }, [data]);

    const getSlotsForDate = (shortDay) => {
        return data?.batchData?.flatMap((batch) =>
            batch.slots
                .filter((slotDay) => slotDay.day === shortDay)
                .map((slotDay) => ({
                    batch,
                    slotDay,
                }))
        );
    };

    return (
        <div className="row align-items-center section__row">
            <div className="product-description__content">
                <div className="product-description__content-head flex align-items-center justify-content-start mb-3">
                    <a href="/" onClick={(e) => (e.preventDefault(), router.back())}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </a>
                    <h5 className="m-0">{data?.name}</h5>
                </div>
                <div className="product-description__content-head">
                    <h6>Choose your slot</h6>
                </div>

                {/* Date Selector */}
                <div className="d-flex overflow-auto gap-2 py-2 border-bottom mb-3">
                    {availableDates.map((date, index) => (
                        <button
                            key={index}
                            className={`btn btn-sm ${selectedDate?.value === date.value ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                        >
                            {date.label}
                        </button>
                    ))}
                </div>

                {/* Slot Grid */}
                {selectedDate && (
                    <div className="row">
                        {getSlotsForDate(selectedDate.shortDay)?.length > 0 ? (
                            getSlotsForDate(selectedDate.shortDay).map(({ batch, slotDay }, idx) => (
                                <div key={idx} className="col-12 mb-4">
                                    <div className="p-4 rounded shadow-sm bg-white border">
                                        {/* Batch Header */}
                                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                            <h5 className="mb-0 text-capitalize">{batch.batch_name}</h5>
                                            <span className="badge bg-dark text-uppercase px-3 py-2">
                                                {batch.batch_type}
                                            </span>
                                        </div>

                                        {/* Slots Grid */}
                                        <div className="d-flex flex-wrap gap-3">
                                            {slotDay?.time_slots?.length > 0 ? (
                                                slotDay.time_slots.map((slot, slotIndex) => {
                                                    // Proper expiry check
                                                    const slotDateTime = new Date(
                                                        `${selectedDate.value}T${new Date(slot.from).toTimeString()}`
                                                    );
                                                    const now = new Date();
                                                    const isExpired = slotDateTime < now;

                                                    const isSelected =
                                                        selectedSlot?._id === batch?._id &&
                                                        selectedSlot?.day === slotDay.day &&
                                                        selectedSlot?.start_time === slot.from;

                                                    const isSlotBooked = batch?.booked_slots?.some(
                                                        (bookedSlot) =>
                                                            bookedSlot.booking_date === selectedDate.value &&
                                                            bookedSlot.booking_time === format(slot.from, "HH:mm a")
                                                    );

                                                    return (
                                                        <div
                                                            key={slotIndex}
                                                            className={`slot-box p-3 rounded text-center ${
                                                                isExpired
                                                                    ? "bg-secondary text-white opacity-75"
                                                                    : isSlotBooked
                                                                      ? "bg-warning text-dark border border-danger"
                                                                      : isSelected
                                                                        ? "bg-success text-white"
                                                                        : "bg-light border"
                                                            }`}
                                                            style={{
                                                                cursor:
                                                                    isExpired || isSlotBooked
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                                flex: "1 1 220px",
                                                                maxWidth: "240px",
                                                                minWidth: "200px",
                                                                transition: "0.2s ease-in-out",
                                                                boxShadow: isSelected
                                                                    ? "0 0 0 2px #198754"
                                                                    : isSlotBooked
                                                                      ? "0 0 0 2px rgba(255, 0, 0, 0.5)"
                                                                      : "0 0 0 1px rgba(0,0,0,0.05)",
                                                                background: isSlotBooked
                                                                    ? "linear-gradient(135deg, #ffe0e0, #ffbbbb)"
                                                                    : undefined,
                                                            }}
                                                            onClick={() => {
                                                                if (isSlotBooked || isExpired) return;
                                                                setSelectedSlot({
                                                                    _id: batch._id,
                                                                    day: slotDay.day,
                                                                    date: selectedDate.value,
                                                                    start_time: slot.from,
                                                                    end_time: slot.to,
                                                                    price: slot.price,
                                                                    non_price: slot.non_price,
                                                                    batch_name: batch.batch_name,
                                                                    batch_type: batch.batch_type,
                                                                    no_of_player: parseInt(batch?.no_of_player),
                                                                    fees: batch?.fees,
                                                                });
                                                            }}
                                                        >
                                                            <h5
                                                                className={`fw-semibold mb-2 fs-6 text-uppercase`}
                                                                style={{
                                                                    color:
                                                                        isSelected || isSlotBooked ? "inherit" : "#333",
                                                                }}
                                                            >
                                                                {format(new Date(slot.from), "hh:mm a")} –{" "}
                                                                {format(new Date(slot.to), "hh:mm a")}
                                                            </h5>

                                                            <span className="fw-bold fs-6">
                                                                ₹ {isAuth ? slot.price : slot.non_price}
                                                            </span>

                                                            {isExpired && (
                                                                <span>
                                                                    <small className="text-warning">Expired</small>
                                                                </span>
                                                            )}

                                                            {isSlotBooked && (
                                                                <span>
                                                                    <i className="bi bi-lock-fill me-1"></i>
                                                                    <small className="text-danger fw-bold">
                                                                        Booked
                                                                    </small>
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-center text-muted">
                                                    No slots available for this day
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No slots available for this day</p>
                        )}
                    </div>
                )}

                {/* Continue Button */}
                {selectedSlot && (
                    <div className="product-pricing__cta mt-3">
                        <button className="cmn-button" onClick={() => setShowBookingModel(true)}>
                            Continue
                        </button>
                    </div>
                )}

                {/* Booking Modal */}
                <CommonModal
                    open={showBookingModel}
                    onClose={() => setShowBookingModel(false)}
                    children={
                        <BookingModal
                            data={data}
                            authData={authData}
                            selectedSlot={selectedSlot}
                            selectedDate={selectedDate}
                        />
                    }
                    className={"slots-modal"}
                />
            </div>
        </div>
    );
};
