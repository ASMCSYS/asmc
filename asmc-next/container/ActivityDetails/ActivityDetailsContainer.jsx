import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useRouter } from "next/router";
import { useFetchActivityListQuery, useFetchFacilityListQuery } from "@/redux/masters/mastersApis";
import Pagination from "@/components/common/Pagination";
import { ActivityCard } from "@/components/facility/ActivityCard";
import { ActivityDetails } from "@/components/facility/ActivityDetails";

const ActivityDetailsContainer = (props) => {
    const { activity } = props;
    const [currentFacility, setCurrentFacility] = useState(null);
    const { data: facility } = useFetchFacilityListQuery({ sortBy: 1, sortField: "createdAt" });

    useEffect(() => {
        if (facility && facility.length > 0) {
            const selectedFacility = facility?.find((f) => f.permalink === "sports-booking");
            setCurrentFacility(selectedFacility);
        }
    }, [facility]);

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <Banner
                title={activity?.name}
                image={currentFacility?.banner_url}
                breadcrumbs={[
                    { title: "Home", link: "/" },
                    { title: currentFacility?.title, link: `/facilities/${currentFacility?.permalink}` },
                    { title: activity?.name },
                ]}
            />

            <section className="section product-description">
                <div className="container">
                    <ActivityDetails
                        data={activity}
                        isAuth={props.isAuth}
                        authData={props.authData}
                        currentFacility={currentFacility}
                    />
                </div>
            </section>

            <Footer />
        </Fragment>
    );
};

export default ActivityDetailsContainer;
