import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useRouter } from "next/router";
import { useFetchBannerQuery, useFetchFacilityListQuery } from "@/redux/masters/mastersApis";
import { ActivityList } from "@/components/facility/ActivityList";
import { HallsList } from "@/components/facility/HallsList";

const FacilityContainer = (props) => {
    const router = useRouter();
    const { type } = router.query;

    const { data: bannerData } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "sports" });

    const [currentFacility, setCurrentFacility] = useState(null);
    const { data: facility } = useFetchFacilityListQuery({ sortBy: 1, sortField: "createdAt" });

    useEffect(() => {
        if (facility && facility.length > 0) {
            if (type) {
                const selectedFacility = facility?.find((f) => f.permalink === type);
                setCurrentFacility(selectedFacility);
            }
        }
    }, [facility, type]);
    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <Banner
                title={currentFacility?.title}
                image={bannerData?.url}
                breadcrumbs={[{ title: "Home", link: "/" }, { title: currentFacility?.title }]}
            />

            {type === "sports-booking" ? (
                <ActivityList currentFacility={currentFacility} />
            ) : (
                <HallsList currentFacility={currentFacility} />
            )}

            <Footer />
        </Fragment>
    );
};

export default FacilityContainer;
