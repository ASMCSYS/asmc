import Link from "next/link";

export const OurSports = () => {
    return (
        <section className="section sports--secondary" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row section__row align-items-center">
                    <div className="col-lg-6 section__col">
                        <div className="section__content">
                            <h5 className="section__content-sub-title">Our Sports</h5>
                            <h2 className="section__content-title">Do you want to be a professional sportsman?</h2>
                            <p className="section__content-text">
                                We offer a lot of courses of varying difficulty and beautiful scenery that golfers of
                                all skill levels can enjoy. You will learn ASMC from professionals with our competent
                                and experienced staff. You will have a great fun with our magnificent illuminated field.
                            </p>
                            <div className="section__content-cta">
                                <Link href="/coming-soon" className="cmn-button">
                                    Join Our Sports
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 section__col">
                        <div className="sports--secondary__thumb wow fadeInUp" data-wow-duration="0.4s">
                            <img src="/images/sports-thumb-two.png" alt="Image" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
