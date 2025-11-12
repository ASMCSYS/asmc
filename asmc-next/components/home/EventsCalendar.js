"use client";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo } from "react";
import { useRouter } from "next/navigation"; // <-- App Router

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export const EventsCalendar = ({ data = [] }) => {
    const router = useRouter();

    const events = useMemo(() => {
        return data.map((item) => ({
            event_id: item.event_id,
            title: item.event_name,
            start: new Date(item.event_start_date),
            end: new Date(item.event_end_date),
            allDay: true,
            resource: item,
        }));
    }, [data]);

    const EventCard = ({ event }) => {
        const eventData = event.resource;
        return (
            <div className="p-2">
                <strong className="d-block">
                    {eventData?.event_name} - ({eventData?.location_data?.title})
                </strong>
            </div>
        );
    };

    const handleEventClick = (event) => {
        const eventId = event.resource?.event_id;
        if (eventId) {
            router.push(`/events/${eventId}`);
        }
    };

    const getEventStyle = (event) => {
        const now = new Date();
        const start = new Date(event.start);
        const end = new Date(event.end);

        let backgroundColor = "#ccc";

        if (end < now) {
            // Past Event
            backgroundColor = "#f8d7da"; // Light red
        } else if (start > now) {
            // Upcoming Event
            backgroundColor = "#d1ecf1"; // Light blue
        } else {
            // Ongoing Event
            backgroundColor = "#d4edda"; // Light green
        }

        return {
            style: {
                backgroundColor,
                borderRadius: "6px",
                padding: "2px 4px",
                color: "#000",
                border: "none",
            },
        };
    };

    if (!data.length) {
        return null;
    }

    return (
        <section className="my-5">
            <div className="container">
                <div className="mb-4 text-center">
                    <h2 className="fw-bold">Event Calendar</h2>
                </div>
                <div className="card shadow border-0">
                    <div className="card-body">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            components={{ event: EventCard }}
                            views={["month", "week", "day"]}
                            onSelectEvent={handleEventClick}
                            eventPropGetter={getEventStyle}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
