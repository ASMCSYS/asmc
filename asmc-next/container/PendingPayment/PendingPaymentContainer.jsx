import React, { Fragment, useEffect, useRef, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "@/components/auth/Sidebar";
import { fetchSingleMember } from "@/apis/members.api";
import { toast_popup } from "@/utils/toast";
import { Loader } from "@/components/common/Loader";
import { capitalizeFirstLetter, generateURL, getCountDependent, getNonPaidCountDependent } from "@/utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CommonModal } from "@/components/common/Modal";
import { SlotsModal } from "@/components/auth/SlotsModal";
import QRCode from "react-qr-code";
import { allowedPaymentForTheseMail, BaseUrl, PaymentUPI, paymentUrl } from "@/utils/constants";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { initiatePaymentApi } from "@/apis/bookings.api";
import { useRouter } from "next/router";

const PendingPaymentContainer = (props) => {
    const { authData } = props;
    const [memberData, setMemberData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const printRef = useRef();

    const [totalAmount, setTotalAmount] = useState(0);
    const [showDependent, setShowDependent] = useState(false);
    const [showNonDependent, setShowNonDependent] = useState(false);

    const toggleDependent = () => {
        setShowDependent(!showDependent);
    };
    const toggleNonDependent = () => {
        setShowNonDependent(!showNonDependent);
    };

    const initiateApp = async () => {
        setIsLoading(true);
        try {
            const res = await fetchSingleMember(authData._id);
            if (res.success) {
                let result = res?.result;
                result.bookings = result.bookings.reverse();

                // sort payment history by date desc
                result.payment_history = result.payment_history.reverse();
                setMemberData(result);
            } else {
                toast_popup(res?.message, "error");
            }
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (authData?._id) initiateApp();
    }, [authData]);

    useEffect(() => {
        let total_amount = memberData.fees_verified ? 0 : memberData?.current_plan?.final_amount;
        if (memberData.fees_verified && memberData.family_details) {
            memberData.family_details.map((obj, key) => {
                if (obj.fees_paid === false) {
                    if (obj.is_dependent === true) {
                        total_amount += obj?.plans?.dependent_member_price;
                    } else if (obj.is_dependent === false) {
                        total_amount += obj?.plans?.non_dependent_member_price;
                    }
                }
            });
        }
        if (memberData?.bookings) {
            memberData?.bookings.map((obj, key) => {
                if (obj.payment_status === "Pending") {
                    total_amount += obj.total_amount;
                }
            });
        }
        setTotalAmount(total_amount);
    }, [memberData]);

    const initiatePayment = async () => {
        try {
            let payload = {
                amount: totalAmount,
                customer_email: authData.email,
                customer_phone: authData.mobile,
                remarks: `Member Id: ${memberData?.member_id}`,
            };
            const response = await initiatePaymentApi(payload);

            const { accessCode, encryptedData, order_id } = response.result;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = paymentUrl;
            form.style.display = "none";

            const accessCodeField = document.createElement("input");
            accessCodeField.name = "access_code";
            accessCodeField.value = accessCode;
            form.appendChild(accessCodeField);

            const encRequestField = document.createElement("input");
            encRequestField.name = "encRequest";
            encRequestField.value = encryptedData;
            form.appendChild(encRequestField);

            const orderIdField = document.createElement("input");
            orderIdField.name = "order_id";
            orderIdField.value = order_id;
            form.appendChild(orderIdField);

            document.body.appendChild(form);

            form.submit(); // Submit form to CCAvenue
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                <title>Print</title>
                <style>
                    /* Add custom styles for print here */
                    body {
                    font-family: Arial, sans-serif;
                    }
                    table {
                    width: 100%;
                    border-collapse: collapse;
                    }
                    th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    }
                    th {
                    background-color: #f4f4f4;
                    text-align: left;
                    }
                </style>
                </head>
                <body>
                ${printContent}
                </body>
            </html>
            `);
        printWindow.document.close();
        printWindow.print();
    };

    const familyMemberFeesPaid = memberData?.family_details?.filter((obj) => obj.fees_paid === false);

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
                                <Sidebar authData={authData} memberData={memberData} />
                                <div className="col-md-7 col-lg-8 col-xl-9">
                                    {!isLoading && (
                                        <div className="checkout__single-wrapper">
                                            {memberData?.bookings && totalAmount ? (
                                                <div className="checkout__single">
                                                    <h5> Total Amount to be Paid ({totalAmount} Rs.)</h5>
                                                    <div className="text-center cta-btn">
                                                        <button
                                                            onClick={() => initiatePayment()}
                                                            className="cmn-button"
                                                            disabled={isSubmitting}
                                                        >
                                                            Pay Now
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {!memberData?.fees_verified && (
                                                <div
                                                    className={`checkout__single ${
                                                        memberData?.fees_verified && "bg-success"
                                                    }`}
                                                >
                                                    <h5
                                                        className={`d-flex justify-content-between align-items-center ${
                                                            memberData?.fees_verified && "text-white"
                                                        }`}
                                                    >
                                                        {memberData?.name} ({"P-" + memberData?.member_id}) - Membership
                                                        Plan Details
                                                        {memberData?.fees_verified ? (
                                                            <span>
                                                                Payment Success{" "}
                                                                <FontAwesomeIcon
                                                                    icon={faCircleCheck}
                                                                    color="#0e7a31"
                                                                    className={`${
                                                                        memberData?.fees_verified && "text-white"
                                                                    }`}
                                                                    fontSize={30}
                                                                    title="Payment Success"
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </h5>
                                                    <div
                                                        className={`plan-details-body ${
                                                            memberData?.fees_verified && "success-text-white"
                                                        }`}
                                                    >
                                                        <ul>
                                                            <li>
                                                                <span>Plan ID</span>
                                                                <span>{memberData?.current_plan?.plan_id}</span>
                                                            </li>
                                                            <li>
                                                                <span>Plan Name</span>
                                                                <span>{memberData?.current_plan?.plan_name}</span>
                                                            </li>
                                                            <li>
                                                                <span>Membership Amount</span>
                                                                <span>{memberData?.current_plan?.amount} Rs.</span>
                                                            </li>
                                                            {/* <li><span>Dependent Member Price ({getCountDependent(memberData?.family_details, true) || 0})</span><span>{(memberData?.current_plan?.dependent_member_price * getCountDependent(memberData?.family_details))} Rs.</span></li> */}
                                                            {getCountDependent(memberData?.family_details, true) >
                                                                0 && (
                                                                <li>
                                                                    <div className="d-flex">
                                                                        <p
                                                                            style={{
                                                                                textWrap: "nowrap",
                                                                            }}
                                                                        >
                                                                            Dependent Member Price (
                                                                            {getCountDependent(
                                                                                memberData?.family_details,
                                                                                true
                                                                            ) || 0}
                                                                            )
                                                                        </p>
                                                                        {memberData?.family_details.length > 0 &&
                                                                            getCountDependent(
                                                                                memberData?.family_details,
                                                                                true
                                                                            ) > 0 && (
                                                                                <div
                                                                                    className={"iconContainer ml-5"}
                                                                                    onClick={toggleDependent}
                                                                                >
                                                                                    <FontAwesomeIcon
                                                                                        icon={faChevronDown}
                                                                                        className={
                                                                                            showDependent
                                                                                                ? "rotated"
                                                                                                : "rotate-back"
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                    <span>
                                                                        {!showDependent &&
                                                                            memberData?.current_plan
                                                                                ?.dependent_member_price *
                                                                                getCountDependent(
                                                                                    memberData?.family_details,
                                                                                    true
                                                                                ) +
                                                                                " Rs."}
                                                                    </span>
                                                                </li>
                                                            )}

                                                            {showDependent &&
                                                                memberData?.family_details.map(
                                                                    (data, key) =>
                                                                        data?.is_dependent && (
                                                                            <li
                                                                                key={key}
                                                                                style={{
                                                                                    marginLeft: "2em",
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {data?.name} ({data?.relation})
                                                                                </span>
                                                                                <span>
                                                                                    {memberData?.current_plan
                                                                                        ?.dependent_member_price ||
                                                                                        0}{" "}
                                                                                    Rs.
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                )}
                                                            {getCountDependent(memberData?.family_details, false) >
                                                                0 && (
                                                                <li>
                                                                    <div className="d-flex">
                                                                        <p
                                                                            style={{
                                                                                textWrap: "nowrap",
                                                                            }}
                                                                        >
                                                                            Non-dependent Member Price (
                                                                            {getCountDependent(
                                                                                memberData?.family_details,
                                                                                false
                                                                            ) || 0}
                                                                            )
                                                                        </p>
                                                                        {memberData?.family_details.length > 0 &&
                                                                            getCountDependent(
                                                                                memberData?.family_details,
                                                                                false
                                                                            ) > 0 && (
                                                                                <div
                                                                                    className={"iconContainer ml-5"}
                                                                                    onClick={toggleNonDependent}
                                                                                >
                                                                                    <FontAwesomeIcon
                                                                                        icon={faChevronDown}
                                                                                        className={
                                                                                            showNonDependent
                                                                                                ? "rotated"
                                                                                                : "rotate-back"
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                    <span>
                                                                        {!showNonDependent &&
                                                                            memberData?.current_plan
                                                                                ?.non_dependent_member_price *
                                                                                getCountDependent(
                                                                                    memberData?.family_details,
                                                                                    false
                                                                                ) +
                                                                                " Rs."}
                                                                    </span>
                                                                </li>
                                                            )}

                                                            {showNonDependent &&
                                                                memberData?.family_details.map(
                                                                    (data, key) =>
                                                                        !data?.is_dependent && (
                                                                            <li
                                                                                key={key}
                                                                                style={{
                                                                                    marginLeft: "2em",
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {data?.name} ({data?.relation})
                                                                                </span>
                                                                                <span>
                                                                                    {memberData?.current_plan
                                                                                        ?.non_dependent_member_price ||
                                                                                        0}{" "}
                                                                                    Rs.
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                )}
                                                            <br />

                                                            {/* <li><span style={{ fontSize: 22 }}><strong>Total Amount to be Paid</strong></span><span style={{ fontSize: 22 }}>{memberData?.current_plan?.amount} Rs.</span></li> */}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {familyMemberFeesPaid &&
                                                familyMemberFeesPaid.length > 0 &&
                                                familyMemberFeesPaid.map((familyData, key) => (
                                                    <div className={`checkout__single`}>
                                                        <h5
                                                            className={`d-flex justify-content-between align-items-center`}
                                                        >
                                                            {familyData.name} ({familyData?.id}) - Secondary Membership
                                                            Plan Details
                                                        </h5>
                                                        <div className={`plan-details-body`}>
                                                            <ul>
                                                                <li>
                                                                    <span>Plan ID</span>
                                                                    <span>{familyData?.plans?.plan_id}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Plan Name</span>
                                                                    <span>{familyData?.plans?.plan_name}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Membership Amount</span>
                                                                    <span>
                                                                        {familyData?.is_dependent
                                                                            ? familyData?.plans?.dependent_member_price
                                                                            : familyData?.plans
                                                                                  ?.non_dependent_member_price}{" "}
                                                                        Rs.
                                                                    </span>
                                                                </li>
                                                                {/* {
                                                                        getNonPaidCountDependent(memberData?.family_details, true) > 0 && (
                                                                            <li>
                                                                                <div className="d-flex">
                                                                                    <p style={{ textWrap: "nowrap" }}>Dependent Member Price ({getNonPaidCountDependent(memberData?.family_details, true) || 0})</p>
                                                                                    {
                                                                                        memberData?.family_details.length > 0 && getNonPaidCountDependent(memberData?.family_details, true) > 0 && (
                                                                                            <div className={"iconContainer ml-5"} onClick={toggleDependent}>
                                                                                                <FontAwesomeIcon icon={faChevronDown} className={showDependent ? "rotated" : 'rotate-back'} />
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                                <span>
                                                                                    {!showDependent && (memberData?.current_plan?.dependent_member_price * getNonPaidCountDependent(memberData?.family_details, true)) + " Rs."}
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    }

                                                                    {
                                                                        showDependent && (
                                                                            memberData?.family_details.map((data, key) => data?.is_dependent && !data.fees_paid && (
                                                                                <li key={key} style={{ marginLeft: "2em" }}><span>{data?.name} ({data?.relation})</span><span>{memberData?.current_plan?.dependent_member_price || 0} Rs.</span></li>
                                                                            ))
                                                                        )
                                                                    }
                                                                    {
                                                                        getNonPaidCountDependent(memberData?.family_details, false) > 0 && (
                                                                            <li>
                                                                                <div className="d-flex">
                                                                                    <p style={{ textWrap: "nowrap" }}>Non-dependent Member Price ({getNonPaidCountDependent(memberData?.family_details, false) || 0})</p>
                                                                                    {
                                                                                        memberData?.family_details.length > 0 && getNonPaidCountDependent(memberData?.family_details, false) > 0 && (
                                                                                            <div className={"iconContainer ml-5"} onClick={toggleNonDependent}>
                                                                                                <FontAwesomeIcon icon={faChevronDown} className={showNonDependent ? "rotated" : 'rotate-back'} />
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                                <span>
                                                                                    {!showNonDependent && (memberData?.current_plan?.non_dependent_member_price * getNonPaidCountDependent(memberData?.family_details, false)) + " Rs."}
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    }

                                                                    {
                                                                        showNonDependent && (
                                                                            memberData?.family_details.map((data, key) => !data?.is_dependent && !data.fees_paid && (
                                                                                <li key={key} style={{ marginLeft: "2em" }}><span>{data?.name} ({data?.relation})</span><span>{memberData?.current_plan?.non_dependent_member_price || 0} Rs.</span></li>
                                                                            ))
                                                                        )
                                                                    } */}
                                                                <br />

                                                                {/* <li><span style={{ fontSize: 22 }}><strong>Total Amount to be Paid</strong></span><span style={{ fontSize: 22 }}>{familyData?.is_dependent ? familyData?.plans?.dependent_member_price : familyData?.plans?.non_dependent_member_price} Rs.</span></li> */}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}

                                            {memberData?.bookings
                                                ? memberData?.bookings.map((obj, key) => {
                                                      let paymentSuccess =
                                                          obj.payment_status === "Success" ? true : false;
                                                      if (paymentSuccess) return null;

                                                      const familyData = obj?.family_member.filter(
                                                          (obj) => obj !== null
                                                      );
                                                      const familyIndex =
                                                          familyData.length > 0
                                                              ? memberData.family_details.findIndex(
                                                                    (fobj) => fobj?._id === familyData[0]?._id
                                                                )
                                                              : null;

                                                      return (
                                                          <div
                                                              className={`checkout__single ${
                                                                  paymentSuccess && "bg-success"
                                                              }`}
                                                              key={key}
                                                          >
                                                              <h5
                                                                  className={`d-flex justify-content-between align-items-center ${
                                                                      paymentSuccess && "text-white"
                                                                  }`}
                                                              >
                                                                  Activity - {obj?.activity_id?.name}
                                                                  {paymentSuccess ? (
                                                                      <span>
                                                                          Payment Success{" "}
                                                                          <FontAwesomeIcon
                                                                              icon={faCircleCheck}
                                                                              color="#0e7a31"
                                                                              className={`${
                                                                                  paymentSuccess && "text-white"
                                                                              }`}
                                                                              fontSize={30}
                                                                              title="Payment Success"
                                                                          />
                                                                      </span>
                                                                  ) : null}
                                                              </h5>
                                                              <div className={`plan-details-body`}>
                                                                  <table
                                                                      className={`table table-bordered table-responsive`}
                                                                  >
                                                                      <tbody>
                                                                          <tr>
                                                                              <td>Name</td>
                                                                              <td>
                                                                                  {familyData.length > 0
                                                                                      ? familyData[0]?.name
                                                                                      : memberData?.name}
                                                                              </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td>Member Id</td>
                                                                              <td>
                                                                                  {familyData.length > 0
                                                                                      ? memberData.family_details[
                                                                                            familyIndex
                                                                                        ]?.id
                                                                                      : `P-${memberData?.member_id}`}
                                                                              </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td>CHSS Id</td>
                                                                              <td>
                                                                                  {familyData.length > 0
                                                                                      ? `${memberData.family_details[familyIndex]?.card_number}`
                                                                                      : `${memberData?.chss_number}`}
                                                                              </td>
                                                                          </tr>
                                                                      </tbody>
                                                                  </table>
                                                              </div>
                                                              <div
                                                                  className={`plan-details-body ${
                                                                      paymentSuccess && "success-text-white"
                                                                  }`}
                                                              >
                                                                  <ul>
                                                                      <li>
                                                                          <span>Booking ID</span>
                                                                          <span>#{obj?.booking_id}</span>
                                                                      </li>
                                                                      <li>
                                                                          <span>Activity Name</span>
                                                                          <span>{obj?.activity_id?.name}</span>
                                                                      </li>
                                                                      {obj?.activity_id?.category.length > 0 ? (
                                                                          <li>
                                                                              <span>Category</span>
                                                                              <span>
                                                                                  {obj?.activity_id?.category[0].label}
                                                                              </span>
                                                                          </li>
                                                                      ) : null}
                                                                      <li>
                                                                          <span>Activity Location</span>
                                                                          <span>
                                                                              {obj?.batch?.location_id?.address}
                                                                          </span>
                                                                      </li>
                                                                      <li>
                                                                          <span>Plan Name</span>
                                                                          <span>{obj?.fees_breakup?.plan_name}</span>
                                                                      </li>
                                                                      <li>
                                                                          <span>Activity Amount</span>
                                                                          <span>{obj?.total_amount} Rs.</span>
                                                                      </li>

                                                                      <li>
                                                                          <span
                                                                              style={{
                                                                                  fontSize: 22,
                                                                              }}
                                                                          >
                                                                              <strong>Total Amount to be Paid</strong>
                                                                          </span>
                                                                          <span
                                                                              style={{
                                                                                  fontSize: 22,
                                                                              }}
                                                                          >
                                                                              {obj?.total_amount} Rs.
                                                                          </span>
                                                                      </li>
                                                                  </ul>
                                                              </div>
                                                          </div>
                                                      );
                                                  })
                                                : null}

                                            <div ref={printRef}>
                                                {memberData?.payment_history &&
                                                    memberData?.payment_history.map((obj, key) => {
                                                        const paymentRes = obj.payment_response
                                                            ? JSON.parse(obj.payment_response)
                                                            : null;
                                                        return (
                                                            <div className="checkout__single">
                                                                <div className="payment-success" key={key}>
                                                                    <div className="payment-success__header">
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                obj?.payment_status === "Success"
                                                                                    ? faCircleCheck
                                                                                    : faCircleXmark
                                                                            }
                                                                            color={
                                                                                obj?.payment_status === "Success"
                                                                                    ? "#0e7a31"
                                                                                    : "red"
                                                                            }
                                                                            fontSize={60}
                                                                            style={{
                                                                                width: 60,
                                                                                height: 60,
                                                                            }}
                                                                        />
                                                                        <h3>
                                                                            {obj?.payment_status === "Success"
                                                                                ? "Payment Successful"
                                                                                : obj?.payment_status === "Failed"
                                                                                  ? "Payment Failed"
                                                                                  : "Payment Initiated"}
                                                                        </h3>
                                                                        <p className="primary-text">
                                                                            {obj?.payment_status === "Success"
                                                                                ? "Congratulation! your payment has been successfull."
                                                                                : ""}
                                                                        </p>
                                                                    </div>
                                                                    <div className="payment-success__body">
                                                                        <ul>
                                                                            <li>
                                                                                <span>Type</span>
                                                                                <span
                                                                                    style={{
                                                                                        marginLeft: 5,
                                                                                    }}
                                                                                >
                                                                                    {capitalizeFirstLetter(
                                                                                        obj?.booking_type
                                                                                    )}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                <span>Transactions ID</span>
                                                                                <span
                                                                                    style={{
                                                                                        marginLeft: 5,
                                                                                    }}
                                                                                >
                                                                                    {paymentRes?.tracking_id}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                <span>Date</span>
                                                                                <span
                                                                                    style={{
                                                                                        marginLeft: 5,
                                                                                    }}
                                                                                >
                                                                                    {format(
                                                                                        parseISO(obj?.createdAt),
                                                                                        "dd MMM, yyyy hh:mm:ss a"
                                                                                    )}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                <span>Mode of Payment</span>
                                                                                <span
                                                                                    style={{
                                                                                        marginLeft: 5,
                                                                                    }}
                                                                                >
                                                                                    {paymentRes?.payment_mode ||
                                                                                        obj?.payment_mode}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                <span>Transaction Status</span>
                                                                                <span
                                                                                    style={{
                                                                                        width: "300px",
                                                                                        marginLeft: 5,
                                                                                    }}
                                                                                    className={`btn ${
                                                                                        obj?.payment_status ===
                                                                                        "Success"
                                                                                            ? "btn-success"
                                                                                            : obj?.payment_status ===
                                                                                                "Failed"
                                                                                              ? "btn-danger"
                                                                                              : "btn-info"
                                                                                    } w-auto text-center text-white`}
                                                                                >
                                                                                    {obj?.payment_status === "Success"
                                                                                        ? "Payment Success"
                                                                                        : "Payment Failed"}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: 22,
                                                                                    }}
                                                                                >
                                                                                    <strong>Total Amount</strong>
                                                                                </span>
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: 22,
                                                                                        marginLeft: 5,
                                                                                    }}
                                                                                >
                                                                                    {obj?.amount_paid} Rs.
                                                                                </span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            {/* print transaction button to print the above history */}
                                            <div className="text-center cta-btn">
                                                <button onClick={() => handlePrint()} className="cmn-button">
                                                    Print Transaction History
                                                </button>
                                            </div>
                                        </div>
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

export default PendingPaymentContainer;
