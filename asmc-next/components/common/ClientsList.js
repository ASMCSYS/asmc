import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React from "react";

export const ClientsList = () => {
    const slider = React.useRef(null);

    const sliderSettings = {
        infinite: true,
        autoplay: true,
        focusOnSelect: false,
        slidesToShow: 7,
        speed: 900,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        variableWidth: false
    }

    return (
        <div className="sponsor" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <Slider ref={slider} {...sliderSettings}>
                            {/* <div className="sponsor__inner"> */}
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/one.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/two.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/three.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/four.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/five.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/six.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/one.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/one.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/two.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/three.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/four.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/five.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/six.png"
                                    alt="Sponsor"
                                />
                            </div>
                            <div className="sponsor__inner-card">
                                <img
                                    src="/images/sponsor/one.png"
                                    alt="Sponsor"
                                />
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}