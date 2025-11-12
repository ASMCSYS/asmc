import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useFetchTestimonialsQuery } from "@/redux/masters/mastersApis";

export const Testimonial = () => {
    const slider = React.useRef(null);

    const sliderSettings = {
        infinite: true,
        autoplay: true,
        focusOnSelect: false,
        slidesToShow: 1,
        speed: 900,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        variableWidth: false,
    };

    const { data: testimonialsData } = useFetchTestimonialsQuery({
        pageNo: 0,
        limit: 10,
        sortField: "createdAt",
        sortBy: -1,
    });

    return (
        <section className="section testimonial testimonial--secondary" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row align-items-center section__row">
                    <div className="col-lg-6 col-xxl-6 section__col">
                        <div className="section__content">
                            {/* <h5 className="section__content-sub-title">Testimonial</h5> */}
                            <h2 className="section__content-title">Our Members Talk About Us</h2>
                            <p className="section__content-text">
                                Our professional team will make sure that you find the right course and the best trainer
                                to receive maximum efficiency. All our trainers are professional ASMC players with the
                                highest...
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xxl-5 offset-xxl-1 section__col">
                        <Slider ref={slider} {...sliderSettings}>
                            {testimonialsData &&
                                testimonialsData?.result &&
                                testimonialsData?.result.map((obj, index) => {
                                    return (
                                        <div className="testimonial__slider-card">
                                            <div className="testimonial__slider-card__body">
                                                <div className="quotation">
                                                    <i className="asmc-quote"></i>
                                                </div>
                                                <div className="testimonial__slider-card__body-review">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <i
                                                            key={index}
                                                            className={
                                                                index < parseInt(obj?.star)
                                                                    ? "asmc-star"
                                                                    : "asmc-star asmc-star-normal"
                                                            }
                                                        ></i>
                                                    ))}
                                                </div>
                                                <p>{obj?.message}</p>
                                            </div>
                                            <div className="testimonial__slider-card__author">
                                                <div className="testimonial__slider-card__author-thumb">
                                                    <img src={obj?.profile} alt="Image" />
                                                </div>
                                                <div className="testimonial__slider-card__author-info">
                                                    <h6>{obj?.name}</h6>
                                                    <p className="secondary-text">{obj?.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Slider>
                        <div className="slider-navigation justify-content-lg-end">
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
                </div>
            </div>
        </section>
    );
};
