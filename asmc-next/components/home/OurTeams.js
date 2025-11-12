import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export const OurTeams = ({ data }) => {
    const slider = React.useRef(null);

    const sliderSettings = {
        infinite: true,
        autoplay: true,
        focusOnSelect: true,
        slidesToShow: 4,
        speed: 900,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        centerMode: true,
        centerPadding: "0px",
        responsive: [{
            breakpoint: 1200,
            settings: {
                slidesToShow: 5,
            },
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 424,
            settings: {
                slidesToShow: 1,
            },
        },
        ],
    }

    return (
        <section class="section team wow fadeInUp" data-aos="fade-up" data-aos-delay="50">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="section__header">
                            <h5 class="section__header-sub-title">Our Team</h5>
                            <h2 class="section__header-title">Meet Our ASMC Members</h2>
                        </div>
                    </div>
                </div>
                <Slider ref={slider} {...sliderSettings} className='team__slider--secondary'>
                    {
                        data && data.map((item, index) => {
                            return (
                                <div class="team__slider-card" key={index}>
                                    <div class="team__slider-card__thumb">
                                        <img src={item.profile || "https://ik.imagekit.io/hl37bqgg7/624201-1729265623412_d9D4J-bU2.png"} alt="Team" style={{ width: "100%", height: "300px", padding: 10, borderRadius: 10 }} />
                                    </div>
                                    <div class="team__slider-card__content">
                                        <h5>{item?.name}</h5>
                                        <p class="secondary-text">{item?.role} - {item?.activity_name}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Slider>
                <div className="slider-navigation justify-content-lg-end">
                    <button className="next-testimonial--secondary cmn-button cmn-button--secondary" onClick={() => slider?.current?.slickPrev()}>
                        {/* <i className="fa-solid fa-angle-left"></i> */}
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <button className="prev-testimonial--secondary cmn-button cmn-button--secondary" onClick={() => slider?.current?.slickNext()}>
                        {/* <i className="fa-solid fa-angle-right"></i> */}
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
        </section>
    )
}