import { BaseUrl, PaymentUPI } from "@/utils/constants";
import { generateURL, getCountDependent } from "@/utils/helper";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { Fragment, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ToastContainer from "../common/ToastContainer";
import { toast_popup } from "@/utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import QRCode from "react-qr-code";

export const BookingData = ({ data }) => {
    const { member_id: memberData } = data;
    const [file, setFile] = useState();
    const [referenceNo, setReferenceNo] = useState();
    const [paymentSuccess, setPaymentSuccess] = useState(data?.payment_status === "Paid" || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('reference_no', referenceNo);
            formData.append('booking_id', data._id);

            const response = await axios.put(`${BaseUrl}/bookings/payment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.success) {
                toast_popup(response?.data?.message, "success");
                setPaymentSuccess(true);
            } else {
                toast_popup(response?.data?.message, "error");
            }
        } catch (error) {
            toast_popup(error.message, "error");
        }
    }

    return (
        <div className="section checkout">
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row section__row">
                            <div className="col-md-5 col-lg-4 col-xl-3 section__col">
                                <div className="checkout__box">
                                    <div className="checkout-profile-image">
                                        <Image src={memberData?.profile} width={100} height={100} alt="Profile" />
                                    </div>
                                    <p className="primary-text">{memberData?.name}</p>
                                    <p className="secondary-text">#{memberData?.member_id}</p>

                                    <div className="profile-other-memberData">
                                        <p>Email: {memberData?.email}</p>
                                        <p>Mobile: {memberData?.mobile}</p>
                                        <p>DOB: {format(parseISO(memberData?.dob), "dd MMM, yyyy")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 col-lg-8 col-xl-9 section__col">
                                <div className="checkout__single-wrapper">
                                    <div className="checkout__single">
                                        <h5>Booking Details</h5>
                                        <div className="plan-details-body">
                                            <ul>
                                                <li><span>Booking ID</span><span>{data?.booking_id}</span></li>
                                                <li><span>Plan Name</span><span>{data?.fees_breakup?.plan_name}</span></li>
                                                <li><span>Activity Name</span><span>{data?.activity_id?.name}</span></li>
                                                <li><span><strong>Members</strong></span><span><strong>Price</strong></span></li>

                                                <li><span>{data?.member_id?.name} (Primary)</span><span>{data?.fees_breakup?.amount}</span></li>
                                                {
                                                    data?.family_member.map((obj, key) => {
                                                        return (
                                                            <li><span>{obj?.name} ({obj?.is_dependent ? "Kid" : "Secondary"})</span><span>{obj?.is_dependent ? data?.fees_breakup?.dependent_member_price : data?.fees_breakup?.non_dependent_member_price}</span></li>
                                                        )
                                                    })
                                                }


                                                <li><span style={{ fontSize: 22 }}><strong>Total Amount to be Paid</strong></span><span style={{ fontSize: 22 }}>{data?.total_amount} Rs.</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="checkout__single">
                                        {
                                            data?.payment_status === "Paid" || paymentSuccess ?
                                                <div className="payment-success">
                                                    <div className="payment-success__header">
                                                        <FontAwesomeIcon icon={faCircleCheck} color="#0e7a31" fontSize={60} />
                                                        <h3>Payment Successful</h3>
                                                        <p className="primary-text">{data?.payment_history?.payment_verified ? "Congratulation! your payment has been verified. Your membership has been activated you will received your username and email very soon." : "We are processing the same and you will be notified via email."}</p>
                                                    </div>
                                                    <div className="payment-success__body">
                                                        <ul>
                                                            <li><span>Transactions ID</span><span>{data?.payment_history?.payment_id}</span></li>
                                                            {/* <li><span>Date</span><span>{format(parseISO(data?.payment_history?.createdAt), "dd MMM, yyyy hh:mm:ss a")}</span></li> */}
                                                            <li><span>Mode of Payment</span><span>{data?.payment_history?.payment_mode}</span></li>
                                                            <li><span>Transaction Status</span><span>{data?.payment_history?.payment_verified ? "Verficiation Success" : "Verficiation Pending"}</span></li>
                                                            <li><span>Amount Paid</span><span>{data?.total_amount} Rs.</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                :
                                                <Fragment>
                                                    <h5>Payment Methods (QR Code)</h5>
                                                    <div className="checkout__single-form">
                                                        <QRCode value={generateURL({ amount: data?.total_amount, name: `ASMC Payment - Booking Id: ${data?.booking_id}`, upi: PaymentUPI })} />
                                                        <p>Scan QR code using any UPI app to make payment.</p>
                                                    </div>
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="checkout__single-form">
                                                            <div className="input-group">
                                                                <div className="input-single">
                                                                    <label htmlFor="screenshot">After payment is completed upload the screen shot of the payment here</label>
                                                                    <input type="file" name="file" id="screenshot" required onChange={(e) => setFile(e.target.files[0])} />
                                                                </div>
                                                                <div className="input-single">
                                                                    <label htmlFor="referenceNo">Reference No. (Enter payemnt id from screenshot here)</label>
                                                                    <input type="text" name="user-card-cvc" onChange={(e) => setReferenceNo(e.target.value)} id="referenceNo" required placeholder="Payment Reference Id" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center cta-btn">
                                                            <button type="submit" className="cmn-button">Submit Now</button>
                                                        </div>
                                                    </form>
                                                </Fragment>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}