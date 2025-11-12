import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useRouter } from "next/router";
import { useFetchBannerQuery } from "@/redux/masters/mastersApis";
import { BookingDetails } from "@/components/event/BookingDetails";
import { ToastContainer } from "react-toastify";

const EventDetailsContainer = (props) => {
    const router = useRouter();
    const { event } = props;
    const { type } = router.query;
    const { data: bannerData } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "events" });

    return (
        <Fragment>
            <ScrollProgressBar />
            <ToastContainer />
            <Header isAuth={props.isAuth} />

            <Banner
                title={"Events"}
                image={bannerData?.url}
                breadcrumbs={[
                    { title: "Home", link: "/" },
                    { title: "Events", link: `/events` },
                    { title: event?.event_name },
                ]}
            />

            <section className="section product-description">
                <div className="container">
                    <BookingDetails data={event} authData={props.authData} isAuth={props.isAuth} />
                </div>
            </section>

            <Footer />
        </Fragment>
    );
};

export default EventDetailsContainer;
