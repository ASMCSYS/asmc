import { Banner } from "@/components/common/Banner";
import { ContactForm } from "@/components/common/ContactForm";
import { Loader } from "@/components/common/Loader";
import { Footer } from "@/components/includes/Footer";
import { Header } from "@/components/includes/Header";
import { useFetchBannerQuery } from "@/redux/masters/mastersApis";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const ContactUsContainer = (props) => {
    const { data: bannerData, isLoading } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "contact_us" });
    console.log(props, "props");

    if (isLoading) {
        return <Loader />
    }

    return (
        <Fragment>
            <Header isAuth={props.isAuth} />
            <Banner title={"Contact Us"} image={bannerData?.url} breadcrumbs={[{ title: "Home", link: "/" }, { title: "Contact Us" }]} />

            <section class="section contact wow fadeInUp" data-aos="fade-up" data-aos-delay="50">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-7">
                            <div class="section__header">
                                <h2 class="section__header-title">Contact Us</h2>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center section__row">
                        <div class="col-sm-6 col-lg-4 col-xl-4 section__col h-100">
                            <div class="contact__item">
                                <div class="contact__item-thumb">
                                    <i class="asmc-phone"></i>
                                </div>
                                <div class="contact__item-content">
                                    <h5>Call Now</h5>
                                    <p class="secondary-text">022 2558 0497</p>
                                    <p class="secondary-text">{"-"}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-4 col-xl-4 section__col">
                            <div class="contact__item">
                                <div class="contact__item-thumb">
                                    <i class="asmc-email"></i>
                                </div>
                                <div class="contact__item-content">
                                    <h5>Email Address</h5>
                                    <p class="secondary-text">info@asmcdae.in</p>
                                    <p class="secondary-text">asmc.dae@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-4 col-xl-4 section__col">
                            <div class="contact__item">
                                <div class="contact__item-thumb">
                                    <i class="asmc-pin-location"></i>
                                </div>
                                <div class="contact__item-content">
                                    <h5>Location</h5>
                                    <p class="secondary-text">New Community Center Complex,</p>
                                    <p class="secondary-text">
                                        Anushaktinagar, Mumbai - 400 094
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ContactForm />

            <div class="map-wrapper">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15086.344722877659!2d72.9262694!3d19.0379482!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c5dc240ac3bb%3A0xb480dc1f82da75dd!2sNew%20Community%20Centre!5e0!3m2!1sen!2sin!4v1725681930129!5m2!1sen!2sin" width="100" height="800" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <Footer />
        </Fragment>
    )
}

export default ContactUsContainer;
