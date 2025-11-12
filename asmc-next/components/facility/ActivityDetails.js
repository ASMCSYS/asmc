import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { allowedPaymentForTheseMail } from "@/utils/constants";

export const ActivityDetails = ({ data, isAuth, authData, currentFacility }) => {
    const slider = React.useRef(null);
    const [planIndex, setPlanIndex] = React.useState(null);

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

    const handlePlanSelect = (e, plan_id) => {
        e.preventDefault();
        setPlanIndex(plan_id);
    };

    return (
        <div className="row align-items-center section__row">
            <div className="col-lg-6 section__col position-relative">
                <Slider ref={slider} {...sliderSettings}>
                    {data?.thumbnail && (
                        <div className="product-description__thumb">
                            <img
                                src={data?.thumbnail}
                                alt="Slider Thumbnail"
                                onError={(e) => {
                                    e.target.src =
                                        "https://ik.imagekit.io/hl37bqgg7/908513-1712119993746_LlxYgPGS6.jpeg"; // Path to your sample image
                                }}
                            />
                        </div>
                    )}
                    {data?.images?.length > 0
                        ? data?.images?.map((image, key) => {
                              return (
                                  <div className="product-description__thumb">
                                      <img src={image} alt="Sliders" />
                                  </div>
                              );
                          })
                        : null}
                </Slider>
                <div className="slider-navigation activity-slider-action">
                    <button
                        className="next-testimonial--secondary cmn-button cmn-button--secondary"
                        onClick={() => slider?.current?.slickPrev()}
                    >
                        {/* <i className="fa-solid fa-angle-left"></i> */}
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <button
                        className="prev-testimonial--secondary cmn-button cmn-button--secondary"
                        onClick={() => slider?.current?.slickNext()}
                    >
                        {/* <i className="fa-solid fa-angle-right"></i> */}
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
            <div className="col-lg-6 col-xl-5 offset-xl-1 section__col">
                <div className="product-description__content">
                    <div className="product-description__content-head">
                        <h5>{data?.name}</h5>
                    </div>
                    <div className="product-description__content-tab">
                        <div className="product-description-tab-btns">
                            <p>{data?.short_description}</p>
                        </div>
                    </div>
                    {isAuth &&
                    data?.batchData &&
                    data?.batchData.length > 0 &&
                    allowedPaymentForTheseMail.includes(authData.email) ? (
                        <div className="product-description__content-footer">
                            <div className="product-pricing__cta">
                                <Link
                                    href={`/booking/${currentFacility?.permalink}/${data?.activity_id}`}
                                    className="cmn-button"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="product-description__content-footer">
                            <div className="product-pricing__cta">
                                <Link href={`/contact-us`} className="cmn-button">
                                    Contact Admin for enrollment
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Vacancies Section */}
            {data?.vacancies && data.vacancies.length > 0 && (
                <div className="activity-vacancies-section mb-4">
                    <h5 className="mb-3" style={{ fontWeight: 600, letterSpacing: 0.5 }}>
                        Available Vacancies & Batches
                    </h5>
                    <div className="custom-table-responsive" style={{ overflowX: "auto" }}>
                        <table
                            className="custom-vacancy-table"
                            style={{
                                width: "100%",
                                background: "#fff",
                                borderRadius: 12,
                                overflow: "hidden",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                borderCollapse: "separate",
                                borderSpacing: 0,
                            }}
                        >
                            <thead>
                                <tr style={{ background: "#f7f8fa" }}>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Batch Name</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Batch Code</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Location</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Category</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Start Time</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>End Time</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Available Seats</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.vacancies.map((vacancy, idx) => {
                                    // Color grading for available seats
                                    let seatColor = "#28a745"; // green
                                    if (vacancy.batch_limit <= 3)
                                        seatColor = "#dc3545"; // red
                                    else if (vacancy.batch_limit <= 8)
                                        seatColor = "#ffc107"; // yellow
                                    else if (vacancy.batch_limit <= 15) seatColor = "#17a2b8"; // blue

                                    return (
                                        <tr
                                            key={vacancy._id}
                                            style={{
                                                background: idx % 2 === 0 ? "#f9fafb" : "#fff",
                                                transition: "background 0.2s",
                                            }}
                                        >
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                <span style={{ fontWeight: 500 }}>{vacancy.batch_name}</span>
                                                {vacancy.subcategory_name && (
                                                    <div style={{ fontSize: 12, color: "#888" }}>
                                                        {vacancy.subcategory_name}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                {vacancy.batch_code}
                                            </td>
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                <span>{vacancy.location_title}</span>
                                                {vacancy.sublocation_title && (
                                                    <div style={{ fontSize: 12, color: "#888" }}>
                                                        {vacancy.sublocation_title}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                {vacancy.category_title}
                                            </td>
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                {vacancy.start_time
                                                    ? new Date(vacancy.start_time).toLocaleTimeString([], {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : "-"}
                                            </td>
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                {vacancy.end_time
                                                    ? new Date(vacancy.end_time).toLocaleTimeString([], {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : "-"}
                                            </td>
                                            <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        minWidth: 36,
                                                        padding: "4px 12px",
                                                        borderRadius: 16,
                                                        background: seatColor + "22",
                                                        color: seatColor,
                                                        fontWeight: 600,
                                                        fontSize: 15,
                                                        textAlign: "center",
                                                        letterSpacing: 0.5,
                                                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                                    }}
                                                >
                                                    {vacancy.batch_limit}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <style jsx>{`
                        .custom-vacancy-table th,
                        .custom-vacancy-table td {
                            border-bottom: 1px solid #ececec;
                        }
                        .custom-vacancy-table tr:last-child td {
                            border-bottom: none;
                        }
                        .custom-vacancy-table th {
                            background: #f7f8fa;
                        }
                        .custom-vacancy-table tr:hover {
                            background: #eef6ff !important;
                        }
                    `}</style>
                </div>
            )}
            <div className="col-lg-12 col-xl-12 section__col">
                <div className="product-description__content">
                    <div className="product-description__content-tab">
                        <div className="product-description-tab-content">
                            <div
                                className="product-description-tab-single"
                                dangerouslySetInnerHTML={{ __html: data?.description }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
