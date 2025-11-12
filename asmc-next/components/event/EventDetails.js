import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { format, isAfter, isBefore, parseISO, add, differenceInSeconds } from "date-fns";

// Helper to combine date and time into a JS Date object
function combineDateTime(date, time) {
    if (!date || !time) return null;
    // If time is already a Date, just use it
    if (typeof time === "object" && time instanceof Date) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds()
        );
    }
    // If time is a string (e.g., '14:00:00'), combine
    const [h, m, s] = (time || "00:00:00").split(":").map(Number);
    const d = new Date(date);
    d.setHours(h || 0, m || 0, s || 0, 0);
    return d;
}

function pad(n) {
    return n.toString().padStart(2, "0");
}

function getCountdownParts(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { d, h, m, s };
}

export const EventDetails = ({ data, isAuth, authData }) => {
    const slider = React.useRef(null);
    const sliderSettings = {
        infinite: false,
        autoplay: true,
        focusOnSelect: false,
        slidesToShow: 1,
        speed: 900,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
    };

    const formatDate = (date) => format(new Date(date), "dd MMM yyyy");
    const formatTime = (time) => format(new Date(time), "hh:mm a");

    // Registration logic
    const now = new Date();
    // Combine date from registration_start_date/registration_end_date with time from registration_start_time/registration_end_time
    let regStart = null;
    let regEnd = null;

    if (data?.registration_start_date && data?.registration_start_time) {
        const startDate = new Date(data.registration_start_date);
        const startTime = new Date(data.registration_start_time);
        regStart = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startTime.getHours(),
            startTime.getMinutes(),
            startTime.getSeconds()
        );
    }

    if (data?.registration_end_date && data?.registration_end_time) {
        const endDate = new Date(data.registration_end_date);
        const endTime = new Date(data.registration_end_time);
        regEnd = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            endTime.getHours(),
            endTime.getMinutes(),
            endTime.getSeconds()
        );
    }

    console.log(regStart, regEnd);
    console.log(now);

    const [timer, setTimer] = useState(0);
    const [timerType, setTimerType] = useState(""); // 'open' or 'close'

    // Compute booking status
    let canBook = false;
    if (regStart && regEnd) {
        canBook = isAfter(now, regStart) && isBefore(now, regEnd);
    }

    // Timer logic
    useEffect(() => {
        let interval;
        function updateTimer() {
            const now = new Date();
            if (regStart && isBefore(now, regStart)) {
                setTimerType("open");
                setTimer(Math.max(0, differenceInSeconds(regStart, now)));
            } else if (regEnd && isAfter(now, regStart) && isBefore(now, regEnd)) {
                setTimerType("close");
                setTimer(Math.max(0, differenceInSeconds(regEnd, now)));
            } else {
                setTimerType("");
                setTimer(0);
            }
        }
        updateTimer();
        interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [
        data?.registration_start_date,
        data?.registration_start_time,
        data?.registration_end_date,
        data?.registration_end_time,
    ]);

    // Timer display
    const { d, h, m, s } = getCountdownParts(timer);

    // --- UI ---
    return (
        <div className="row align-items-start section__row">
            {/* Image Slider */}
            <div className="col-lg-6 section__col position-relative">
                <Slider ref={slider} {...sliderSettings}>
                    {data?.thumbnail && (
                        <div className="product-description__thumb">
                            <img
                                src={data?.thumbnail}
                                alt="Event"
                                onError={(e) => {
                                    e.target.src =
                                        "https://ik.imagekit.io/hl37bqgg7/908513-1712119993746_LlxYgPGS6.jpeg";
                                }}
                            />
                        </div>
                    )}
                    {data?.images?.map((image, key) => (
                        <div className="product-description__thumb" key={key}>
                            <img src={image} alt={`Event image ${key + 1}`} />
                        </div>
                    ))}
                </Slider>
                <div className="slider-navigation activity-slider-action">
                    <button
                        className="next-testimonial--secondary cmn-button cmn-button--secondary"
                        onClick={() => slider?.current?.slickPrev()}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <button
                        className="prev-testimonial--secondary cmn-button cmn-button--secondary"
                        onClick={() => slider?.current?.slickNext()}
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>

            {/* Event Content */}
            <div className="col-lg-6 col-xl-5 offset-xl-1 section__col">
                <div className="product-description__content">
                    <h3 className="mb-2">{data?.event_name}</h3>
                    <h6 className="secondary-text mb-3">📍 {data?.location_data?.[0]?.title}</h6>

                    <p>
                        <strong>🗓 Registration:</strong> {formatDate(data?.registration_start_date)} -{" "}
                        {formatDate(data?.registration_end_date)}
                    </p>
                    <p>
                        <strong>🕒 Time:</strong> {formatTime(data?.registration_start_time)} -{" "}
                        {formatTime(data?.registration_end_time)}
                    </p>

                    <p>
                        <strong>🗓 Broadcast Date:</strong> {formatDate(data?.event_start_date)} -{" "}
                        {formatDate(data?.event_end_date)}
                    </p>
                    <p>
                        <strong>🕒 Time:</strong> {formatTime(data?.event_start_time)} -{" "}
                        {formatTime(data?.event_end_time)}
                    </p>

                    {/* Booking Section UI */}
                    <div
                        className="mt-4 mb-4 p-4"
                        style={{
                            background: "#f5faff",
                            borderRadius: 16,
                            border: "1px solid #b3e5fc",
                            boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
                            textAlign: "center",
                            maxWidth: 400,
                            margin: "0 auto",
                            minHeight: 120,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "12px",
                        }}
                    >
                        {timerType === "open" && timer > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <div style={{ color: "#1976d2", fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                                    Booking opens in
                                </div>
                                <div
                                    style={{
                                        fontSize: 24,
                                        fontFamily: "monospace",
                                        color: "#1976d2",
                                        letterSpacing: 1,
                                        fontWeight: 600,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {pad(d)}d : {pad(h)}h : {pad(m)}m : {pad(s)}s
                                </div>
                            </div>
                        )}
                        {timerType === "close" && timer > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <div style={{ color: "#d32f2f", fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                                    Booking closes in
                                </div>
                                <div
                                    style={{
                                        fontSize: 24,
                                        fontFamily: "monospace",
                                        color: "#d32f2f",
                                        letterSpacing: 1,
                                        fontWeight: 600,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {pad(d)}d : {pad(h)}h : {pad(m)}m : {pad(s)}s
                                </div>
                            </div>
                        )}
                        {!canBook && timerType !== "open" && timerType !== "close" && (
                            <div
                                style={{
                                    color: "#888",
                                    fontWeight: 500,
                                    fontSize: 16,
                                    lineHeight: 1.3,
                                    padding: "8px 0",
                                }}
                            >
                                Booking is not available at this time.
                            </div>
                        )}
                        <Link href={canBook ? `/events/booking/${data?.event_id}` : "#"} legacyBehavior>
                            <a
                                className={`cmn-button${!canBook ? " disabled" : ""}`}
                                style={{
                                    pointerEvents: canBook ? "auto" : "none",
                                    opacity: canBook ? 1 : 0.6,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    padding: "12px 24px",
                                    background: canBook ? "#1976d2" : "#bdbdbd",
                                    color: "#fff",
                                    borderRadius: 8,
                                    transition: "background 0.2s",
                                    textDecoration: "none",
                                    display: "inline-block",
                                    marginTop: "8px",
                                }}
                                aria-disabled={!canBook}
                            >
                                Book Now
                            </a>
                        </Link>
                        {!canBook && timerType === "" && (
                            <div
                                style={{
                                    color: "#b71c1c",
                                    fontSize: 14,
                                    marginTop: 8,
                                    lineHeight: 1.3,
                                }}
                            >
                                Booking is closed or not available.
                            </div>
                        )}
                    </div>

                    {data?.description && (
                        <p className="mt-4">
                            <strong>📝 Description:</strong>
                            <br />
                            {data.description}
                        </p>
                    )}
                </div>
            </div>

            {/* HTML Text Content */}
            <div className="col-lg-12 col-xl-12 section__col mt-4">
                <div className="product-description__content">
                    <div className="product-description__content-tab">
                        <div className="product-description-tab-content">
                            <div className="" dangerouslySetInnerHTML={{ __html: data?.text_content }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
