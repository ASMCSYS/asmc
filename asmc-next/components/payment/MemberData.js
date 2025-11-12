import { BaseUrl, PaymentUPI } from "@/utils/constants";
import { generateURL, getCountDependent } from "@/utils/helper";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ToastContainer from "../common/ToastContainer";
import { toast_popup } from "@/utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import QRCode from "react-qr-code";
import { Button } from "react-bootstrap";

export const MemberData = ({ data }) => {
    const [file, setFile] = useState();
    const [referenceNo, setReferenceNo] = useState();
    const [paymentSuccess, setPaymentSuccess] = useState(data?.fees_paid || false);
    const [isLoading, setIsLoading] = useState(false);

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        let total_amount = data.fees_paid ? 0 : data?.current_plan?.final_amount;
        if (data?.bookings) {
            data?.bookings.map((obj, key) => {
                if (obj.payment_status === "Pending") {
                    total_amount += obj.total_amount;
                    setPaymentSuccess(false);
                }
            });
        }
        setTotalAmount(total_amount);
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('reference_no', referenceNo);
            formData.append('member_id', data._id);
            formData.append('amount_paid', totalAmount);

            const response = await axios.post(`${BaseUrl}/members/payment`, formData, {
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
            setIsLoading(false);
        } catch (error) {
            toast_popup(error.message, "error");
            setIsLoading(false);
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
                                        <Image src={data?.profile} width={100} height={100} alt="Profile" />
                                    </div>
                                    <p className="primary-text">{data?.name}</p>
                                    <p className="secondary-text">#{data?.member_id}</p>

                                    <div className="profile-other-data">
                                        <p>Email: {data?.email}</p>
                                        <p>Mobile: {data?.mobile}</p>
                                        <p>DOB: {format(parseISO(data?.dob), "dd MMM, yyyy")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 col-lg-8 col-xl-9 section__col">
                                <div className="checkout__single-wrapper">
                                    <div className={`checkout__single ${data?.fees_verified && 'bg-success'}`}>
                                        <h5 className={`d-flex justify-content-between align-items-center ${data?.fees_verified && 'text-white'}`}>
                                            Membership Plan Details
                                            {data?.fees_verified ? <span>Payment Success <FontAwesomeIcon icon={faCircleCheck} color="#0e7a31" className={`${data?.fees_verified && 'text-white'}`} fontSize={30} title="Payment Success" /></span> : null}
                                        </h5>
                                        <div className={`plan-details-body ${data?.fees_verified && 'success-text-white'}`}>
                                            <ul>
                                                <li><span>Plan ID</span><span>{data?.current_plan?.plan_id}</span></li>
                                                <li><span>Plan Name</span><span>{data?.current_plan?.plan_name}</span></li>
                                                <li><span>Membership Amount</span><span>{data?.current_plan?.amount} Rs.</span></li>
                                                <li><span>Dependent Member Price ({getCountDependent(data?.family_details, true) || 0})</span><span>{(data?.current_plan?.dependent_member_price * getCountDependent(data?.family_details))} Rs.</span></li>
                                                <li><span>Non-dependent Member Price ({getCountDependent(data?.family_details, false) || 0})</span><span>{(data?.current_plan?.non_dependent_member_price * getCountDependent(data?.family_details, false) || 0)} Rs.</span></li>

                                                <li><span style={{ fontSize: 22 }}><strong>Total Amount to be Paid</strong></span><span style={{ fontSize: 22 }}>{data?.current_plan?.final_amount} Rs.</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    {
                                        data?.bookings
                                            ?
                                            data?.bookings.map((obj, key) => {
                                                let paymentSuccess = obj.payment_status === "Verified" ? true : false;
                                                return (
                                                    <div className={`checkout__single ${paymentSuccess && 'bg-success'}`} key={key}>
                                                        <h5 className={`d-flex justify-content-between align-items-center ${paymentSuccess && 'text-white'}`}>
                                                            Booking {key + 1} Details
                                                            {paymentSuccess ? <span>Payment Success <FontAwesomeIcon icon={faCircleCheck} color="#0e7a31" className={`${paymentSuccess && 'text-white'}`} fontSize={30} title="Payment Success" /></span> : null}
                                                        </h5>
                                                        <div className={`plan-details-body ${paymentSuccess && 'success-text-white'}`}>
                                                            <ul>
                                                                <li><span>Booking ID</span><span>#{obj?.booking_id}</span></li>
                                                                <li><span>Activity Name</span><span>{obj?.activity_id?.name}</span></li>
                                                                <li><span>Activity Location</span><span>{obj?.activity_id?.location?.title}</span></li>
                                                                <li><span>Plan Name</span><span>{obj?.fees_breakup?.plan_name}</span></li>
                                                                <li><span>Activity Amount</span><span>{obj?.total_amount} Rs.</span></li>

                                                                <li><span style={{ fontSize: 22 }}><strong>Total Amount to be Paid</strong></span><span style={{ fontSize: 22 }}>{obj?.total_amount} Rs.</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            null
                                    }
                                    {
                                        data?.bookings && totalAmount
                                            ?
                                            <div className="checkout__single">
                                                <h5> Total Amount to be Paid ({totalAmount} Rs.)</h5>
                                                <div className="checkout__single-form">
                                                    <QRCode value={generateURL({ amount: totalAmount, name: `ASMC Payment`, upi: PaymentUPI })} />
                                                    <p style={{ paddingTop: 2 }}>Scan QR code using any UPI app to make payment.</p>
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
                                                        <button type="submit" className="cmn-button" disabled={isLoading}>
                                                            Submit Now
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            :
                                            null
                                    }

                                    {
                                        data?.payment_history && data?.payment_history.map((obj, key) => {
                                            return (
                                                <div className="checkout__single">
                                                    <div className="payment-success" key={key}>
                                                        <div className="payment-success__header">
                                                            <FontAwesomeIcon icon={faCircleCheck} color="#0e7a31" fontSize={60} />
                                                            <h3>Payment Successful</h3>
                                                            <p className="primary-text">{obj?.payment_verified ? "Congratulation! your payment has been verified. Your membership has been activated you will received your username and email very soon." : "We are processing the same and you will be notified via email."}</p>
                                                        </div>
                                                        <div className="payment-success__body">
                                                            <ul>
                                                                <li><span>Transactions ID</span><span>{obj?.payment_id}</span></li>
                                                                <li><span>Date</span><span>{format(parseISO(obj?.createdAt), "dd MMM, yyyy hh:mm:ss a")}</span></li>
                                                                <li><span>Mode of Payment</span><span>{obj?.payment_mode}</span></li>
                                                                <li><span>Transaction Status</span><span className={`btn ${obj?.payment_verified ? "btn-success" : "btn-info"} w-auto text-center text-white`}>{obj?.payment_verified ? "Verficiation Success" : "Verficiation Pending"}</span></li>
                                                                <li><span>Amount Paid</span><span>{obj?.amount_paid} Rs.</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}