import React, { Fragment, useRef } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { useFetchGuestBookingQuery } from "@/redux/auth/authApis";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GuestBookedEventsContainer = (props) => {
    const router = useRouter();
    const order_id = router.query.order_id;
    const { isLoading, data } = useFetchGuestBookingQuery({ order_id });

    const invoiceRef = useRef(null);

    // Function to download invoice as PDF
    const downloadInvoice = () => {
        const input = invoiceRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice_${order_id}.pdf`);
        });
    };

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <div className="section checkout">
                <ToastContainer />
                <div className="container pt-lg-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="row section__row">
                                <div className="col-md-12 col-lg-12 col-xl-12">
                                    {!isLoading && data && (
                                        <Fragment>
                                            {/* Print Button */}
                                            <div ref={invoiceRef}>
                                                <div className="p-4 bg-success text-white">
                                                    <div className="text-success mb-3">
                                                        <i
                                                            className="bi bi-check-circle-fill"
                                                            style={{ fontSize: "3rem" }}
                                                        ></i>
                                                    </div>
                                                    <h2 className="fw-bold text-white">Booking Confirmed!</h2>
                                                    <p className="text-white">
                                                        Thank you for booking your event. Your order has been
                                                        successfully placed.
                                                    </p>
                                                    <p className="text-white">
                                                        Please save this order ID for future reference: {"#"}
                                                        {order_id}
                                                    </p>
                                                </div>

                                                <div className={`checkout__single`}>
                                                    <h5 className={`d-flex justify-content-between align-items-center`}>
                                                        Event - {data?.event_data?.event_name}
                                                    </h5>
                                                    <div className={`plan-details-body`}>
                                                        <ul>
                                                            <li>
                                                                <span>Event Name</span>
                                                                <span>{data?.event_data?.event_name}</span>
                                                            </li>
                                                            <li>
                                                                <span>Event Start Dates</span>
                                                                <span>
                                                                    {format(
                                                                        data?.event_data?.event_start_date,
                                                                        "dd-MM-yyyy"
                                                                    )}{" "}
                                                                    -
                                                                    {format(
                                                                        data?.event_data?.event_end_date,
                                                                        "dd-MM-yyyy"
                                                                    )}
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <span>Location</span>
                                                                <span>{data?.event_data?.location_data?.title}</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className={`plan-details-body`}>
                                                        {[...data?.member_data, ...data?.non_member_data].length >
                                                            0 && (
                                                            <div className={`table-responsive`}>
                                                                <h6 className="mb-3">Players Details</h6>
                                                                <table className={`table`}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>
                                                                                <strong>Sr. No.</strong>
                                                                            </th>
                                                                            <th>
                                                                                <strong>Info</strong>
                                                                            </th>
                                                                            <th>
                                                                                <strong>CHSS Number</strong>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {[
                                                                            ...data?.member_data,
                                                                            ...data?.non_member_data,
                                                                        ].map((pobj, pkey) => (
                                                                            <tr key={pkey}>
                                                                                <td>{pkey + 1}</td>
                                                                                <td>
                                                                                    Name: {pobj?.name} <br />
                                                                                    Email: {pobj?.email} <br />
                                                                                    Mobile: {pobj?.mobile}
                                                                                </td>
                                                                                <td>{pobj?.chss_number || "-"}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className={`plan-details-body`}>
                                                        <ul>
                                                            <li>
                                                                <span>Booking ID</span>
                                                                <span>#{data?.booking_id}</span>
                                                            </li>
                                                            <li>
                                                                <span>Event ID</span>
                                                                <span>#{data?.event_data?.event_id}</span>
                                                            </li>
                                                            {data?.category_data && (
                                                                <li>
                                                                    <span>Category</span>
                                                                    <span>{data?.category_data?.category_name}</span>
                                                                </li>
                                                            )}
                                                            <li>
                                                                <span style={{ fontSize: 22 }}>
                                                                    <strong>Total Amount Paid</strong>
                                                                </span>
                                                                <span style={{ fontSize: 22 }}>
                                                                    {data?.amount_paid} Rs.
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <button onClick={downloadInvoice} className="btn btn-primary">
                                                    Download Payment Receipt
                                                </button>
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default GuestBookedEventsContainer;
