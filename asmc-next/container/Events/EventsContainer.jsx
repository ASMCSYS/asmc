import React, { Fragment, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useFetchBannerQuery, useFetchEventsListQuery } from "@/redux/masters/mastersApis";
import { format, isAfter, isBefore } from "date-fns";
import Link from "next/link";
import styles from "./EventsContainer.module.css"; // import your CSS module

const EventsContainer = ({ authData, isAuth }) => {
    const [pagination] = useState({
        pageNo: 0,
        limit: 8,
        sortBy: -1,
        sortField: "event_start_date",
        keywords: "",
    });

    const { data: bannerData } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "events" });
    const { data: allData, isLoading } = useFetchEventsListQuery(pagination);

    // Filter events by broadcast window
    const now = new Date();
    const filteredEvents =
        allData?.result?.filter((item) => {
            const start = item.broadcast_start_date ? new Date(item.broadcast_start_date) : null;
            const end = item.broadcast_end_date ? new Date(item.broadcast_end_date) : null;
            // Show if now is between start and end (inclusive)
            return (
                (!start || isBefore(start, now) || start.getTime() === now.getTime()) &&
                (!end || isAfter(end, now) || end.getTime() === now.getTime())
            );
        }) || [];

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={isAuth} />

            <Banner
                title="Events"
                image={bannerData?.url}
                breadcrumbs={[{ title: "Home", link: "/" }, { title: "Events" }]}
            />

            <section className={styles.eventSection}>
                <div className={styles.container}>
                    {!isLoading && filteredEvents.length > 0 ? (
                        <div className={styles.grid}>
                            {filteredEvents.map((item, idx) => (
                                <div className={styles.card} key={idx}>
                                    <Link href={`/events/${item?.event_id}`} className={styles.imageWrapper}>
                                        <img
                                            src={item?.images?.[0] || "/placeholder.jpg"}
                                            alt={item?.event_name}
                                            className={styles.image}
                                        />
                                        <span className={styles.categoryBadge}>{item?.event_type || "Event"}</span>
                                    </Link>

                                    <div className={styles.cardBody}>
                                        <h3 className={styles.title}>{item?.event_name}</h3>

                                        <p className={styles.date}>
                                            🗓️ {format(new Date(item.event_start_date), "dd MMM")} -{" "}
                                            {format(new Date(item.event_end_date), "dd MMM yyyy")}
                                        </p>

                                        <p className={styles.time}>
                                            ⏰ {format(new Date(item?.event_start_time), "hh:mm a")} -{" "}
                                            {format(new Date(item?.event_end_time), "hh:mm a")}
                                        </p>

                                        <p className={styles.location}>📍 {item?.location_data?.title || "TBA"}</p>

                                        <p className={styles.description}>
                                            {item?.description?.length > 90
                                                ? item.description.slice(0, 90) + "..."
                                                : item.description || "No description available."}
                                        </p>

                                        <p className={styles.registration}>
                                            Registration: {format(new Date(item.registration_start_date), "dd MMM")} -{" "}
                                            {format(new Date(item.registration_end_date), "dd MMM")}
                                        </p>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <Link href={`/events/${item?.event_id}`} className={styles.joinButton}>
                                            Join Now
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noData}>
                            <h4>No Events Available</h4>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </Fragment>
    );
};

export default EventsContainer;
