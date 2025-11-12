import React, { Fragment } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useRouter } from "next/router";
import { useFetchBannerQuery } from "@/redux/masters/mastersApis";
import { EventDetails } from "@/components/event/EventDetails";
import { Loader } from "@/components/common/Loader";

const EventDetailsContainer = (props) => {
    const router = useRouter();
    const { event } = props;
    console.log(event, "event");
    const { type } = router.query;
    const { data: bannerData } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "events" });

    return (
        <Fragment>
            <ScrollProgressBar />
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
                    {event ? (
                        <EventDetails data={event} isAuth={props.isAuth} authData={props.authData} />
                    ) : (
                        <Loader show={true} />
                    )}
                </div>
            </section>

            <Footer />
        </Fragment>
    );
};

export default EventDetailsContainer;
