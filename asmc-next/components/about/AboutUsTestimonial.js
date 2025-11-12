import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react";

export const AboutUsTestimonial = () => {
    const slider = React.useRef(null);

    const sliderSettings = {
        infinite: true,
        autoplay: true,
        focusOnSelect: false,
        slidesToShow: 3,
        speed: 900,
        slidesToScroll: 2,
        arrows: false,
        dots: false,
        variableWidth: false
    }

    return (
        <section className="section testimonial" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="section__header">
                            <h5 className="section__header-sub-title"> Testimonial </h5>
                            <h2 className="section__header-title"> Our Members Thinking About Us </h2>
                            <p> ASMC Sports Sports is a golf sports with a history that goes back to XX century. From a cricket sports to soccer tournaments, </p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-sm-10 col-md-12">
                        <Slider ref={slider} {...sliderSettings}>
                            <div className="testimonial__slider-card">
                                <div className="testimonial__slider-card__body">
                                    <div className="testimonial__slider-card__body-review" >
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                    </div>
                                    <p> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in </p>
                                </div>
                                <div className="testimonial__slider-card__author">
                                    <div className="testimonial__slider-card__author-thumb" >
                                        <img src="/images/testimonial/one.png" alt="Image" />
                                    </div>
                                    <div className="testimonial__slider-card__author-info" >
                                        <h6>Jenelia D'suza</h6>
                                        <p className="secondary-text">Student</p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial__slider-card">
                                <div className="testimonial__slider-card__body">
                                    <div className="testimonial__slider-card__body-review" >
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                    </div>
                                    <p> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in </p>
                                </div>
                                <div className="testimonial__slider-card__author">
                                    <div className="testimonial__slider-card__author-thumb" >
                                        <img src="/images/testimonial/two.png" alt="Image" />
                                    </div>
                                    <div className="testimonial__slider-card__author-info" >
                                        <h6>Sarika Paleccha</h6>
                                        <p className="secondary-text">Player</p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial__slider-card">
                                <div className="testimonial__slider-card__body">
                                    <div className="testimonial__slider-card__body-review" >
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                    </div>
                                    <p> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in </p>
                                </div>
                                <div className="testimonial__slider-card__author">
                                    <div className="testimonial__slider-card__author-thumb" >
                                        <img src="/images/testimonial/three.png" alt="Image" />
                                    </div>
                                    <div className="testimonial__slider-card__author-info" >
                                        <h6>Brad Hogds</h6>
                                        <p className="secondary-text"> Junior Player </p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial__slider-card">
                                <div className="testimonial__slider-card__body">
                                    <div className="testimonial__slider-card__body-review" >
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                    </div>
                                    <p> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in </p>
                                </div>
                                <div className="testimonial__slider-card__author">
                                    <div className="testimonial__slider-card__author-thumb" >
                                        <img src="/images/testimonial/one.png" alt="Image" />
                                    </div>
                                    <div className="testimonial__slider-card__author-info" >
                                        <h6>Jenelia D'suza</h6>
                                        <p className="secondary-text">Student</p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial__slider-card">
                                <div className="testimonial__slider-card__body">
                                    <div className="testimonial__slider-card__body-review" >
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                    </div>
                                    <p> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in </p>
                                </div>
                                <div className="testimonial__slider-card__author">
                                    <div className="testimonial__slider-card__author-thumb" >
                                        <img src="/images/testimonial/two.png" alt="Image" />
                                    </div>
                                    <div className="testimonial__slider-card__author-info" >
                                        <h6>Sarika Paleccha</h6>
                                        <p className="secondary-text">Player</p>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial__slider-card">
                                <div className="testimonial__slider-card__body">
                                    <div className="testimonial__slider-card__body-review" >
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                        <i className="asmc-star"></i>
                                    </div>
                                    <p> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in </p>
                                </div>
                                <div className="testimonial__slider-card__author">
                                    <div className="testimonial__slider-card__author-thumb" >
                                        <img src="/images/testimonial/three.png" alt="Image" />
                                    </div>
                                    <div className="testimonial__slider-card__author-info" >
                                        <h6>Brad Hogds</h6>
                                        <p className="secondary-text"> Junior Player </p>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="slider-navigation">
                            <button className="next-testimonial cmn-button cmn-button--secondary" onClick={() => slider?.current?.slickPrev()}>
                                {/* <i className="fa-solid fa-angle-left"></i> */}
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>
                            <button className="prev-testimonial cmn-button cmn-button--secondary" onClick={() => slider?.current?.slickNext()}>
                                {/* <i className="fa-solid fa-angle-right"></i>  */}
                                <FontAwesomeIcon icon={faAngleRight} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}