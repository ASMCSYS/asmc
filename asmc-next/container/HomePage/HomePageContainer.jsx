import React, { Fragment, useEffect, useState } from "react";
import { Loader } from "@/components/common/Loader";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { HomeAboutUs } from "@/components/home/HomeAboutUs";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { useFetchBannerQuery, useFetchEventsListQuery } from "@/redux/masters/mastersApis";
import { fetchEvents } from "@/apis/events.api";
import { toast_popup } from "@/utils/toast";
import { MainBanner } from "@/components/home/MainBanner";
import { OurTeams } from "@/components/home/OurTeams";
import { fetchTeamMember } from "@/apis/members.api";
import { EventsCalendar } from "@/components/home/EventsCalendar";
import { MissionVision } from "@/components/home/MissionVision";
import { JoinSports } from "@/components/home/JoinSports";
import { Testimonial } from "@/components/home/Testimonial";
import { OurSports } from "@/components/home/OurSports";

const HomePageContainer = (props) => {
    const { data: bannerData, isLoading } = useFetchBannerQuery({
        sortBy: 1,
        sortField: "createdAt",
        type: "home_page",
    });

    const [teamsData, setTeamsData] = useState(null);

    useEffect(() => {
        const initiateApp = async () => {
            try {
                const teamRes = await fetchTeamMember();
                if (teamRes.success) {
                    setTeamsData(teamRes?.result);
                }
            } catch (error) {
                toast_popup(error?.response?.data?.message || error?.message, "error");
            }
        };

        initiateApp();
    }, []);

    const {
        data: eventData,
        isLoading: eventLoading,
        isFetching,
    } = useFetchEventsListQuery({
        pageNo: 0,
        limit: 1000,
        sortField: "event_start_date",
        sortBy: -1,
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Fragment>
            <ScrollProgressBar />
            {/* <Loader show={true} /> */}
            <Header isAuth={props.isAuth} />

            {/* <VideoBanner /> */}
            <MainBanner bannerData={bannerData} />

            <HomeAboutUs />

            {/* <MissionVision /> */}

            <OurTeams data={teamsData} />

            {/* <Subscription /> */}

            {/* <OurSports /> */}

            <EventsCalendar data={eventData?.result} />

            {/* <JoinSports /> */}

            <Testimonial />

            <Footer />
        </Fragment>
    );
};

export default HomePageContainer;
