import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { allowedPaymentForTheseMail } from "@/utils/constants";

export const HallDetails = ({ data, isAuth, authData, currentFacility }) => {
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

    return (
        <div className="row align-items-center section__row">
            <div className="col-lg-6 section__col position-relative">
                <Slider ref={slider} {...sliderSettings}>
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
                            <p>{data?.description}</p>
                        </div>
                    </div>
                    {isAuth && allowedPaymentForTheseMail.includes(authData.email) ? (
                        <div className="product-description__content-footer">
                            <div className="product-pricing__cta">
                                <Link
                                    href={`/booking/${currentFacility?.permalink}/${data?.hall_id}`}
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
                                    Contact Admin for Booking
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="col-lg-12 col-xl-12 section__col">
                <div className="product-description__content">
                    <div className="product-description__content-tab">
                        <div className="product-description-tab-content">
                            <div
                                className="product-description-tab-single"
                                dangerouslySetInnerHTML={{ __html: data?.text_content }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
