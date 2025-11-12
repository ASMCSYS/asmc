import { format } from "date-fns";
import Link from "next/link"

export const UpcomingEvents = ({ data = [] }) => {
    return (
        <section className="section event" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section__header--secondary">
                            <div className="row align-items-center">
                                <div className="col-lg-8">
                                    <div className="section__header--secondary__content">
                                        <h5>Event</h5>
                                        <h2>Our upcoming events</h2>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="section__header--secondary__cta">
                                        <Link href="/events" className="cmn-button">See All Event</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center section__row">
                    {
                        data?.map((item, key) => {
                            return (
                                <div className="col-sm-10 col-md-6 section__col" key={key}>
                                    <div className="event__single">
                                        <div className="event__single-thumb">
                                            <Link href="/">
                                                <img src={item?.images?.length > 0 ? item.images[0] : ""} alt="Image" width={200} />
                                            </Link>
                                        </div>
                                        <div className="event__single-content">
                                            <h3>{format(item.start_date, 'd')} <span className="primary-text">{format(item.start_date, 'MMM')}</span></h3>
                                            <p>Friday at {format(item?.start_time, 'hh:mm a')}</p>
                                            <h5>{item?.event_name}</h5>
                                            <p class="secondary-text">
                                                <i class="asmc-location"></i> {item?.location_data?.title}
                                            </p>
                                            <p>Free</p>
                                            {/* <Link href="/coming-soon" className="cmn-button">Join Now</Link> */}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}