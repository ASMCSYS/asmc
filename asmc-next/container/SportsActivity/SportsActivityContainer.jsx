import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "@/components/auth/Sidebar";
import { fetchSingleMember } from "@/apis/members.api";
import { toast_popup } from "@/utils/toast";
import { Loader } from "@/components/common/Loader";
import { getCountDependent } from "@/utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CommonModal } from "@/components/common/Modal";
import { SlotsModal } from "@/components/auth/SlotsModal";
import { addDays, format, isAfter, isBefore, isValid, isWithinInterval, subDays } from "date-fns";
import { RenewModal } from "@/components/auth/RenewModal";
import { allowedPaymentForTheseMail, allowedTestingEmails } from "@/utils/constants";
import { useFetchSingleMemberQuery } from "@/redux/auth/authApis";
import { useRenewSettings } from "@/hooks/useRenewSettings";

const SportsActivityContainer = (props) => {
    const { authData } = props;
    const { isLoading: memberDataLoading, data: memberData } = useFetchSingleMemberQuery(
        { _id: authData?._id },
        { skip: !authData?._id }
    );

    const { renewSettings } = useRenewSettings();

    const [slotsData, setSlotsData] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [showRenewModel, setShowRenewModel] = useState(false);

    const handleSlotModal = (data) => {
        setSlotsData(data);
        setModalOpen(!modalOpen);
    };

    const handleRenew = (data) => {
        const familyData = data?.family_member.filter((obj) => obj !== null);

        if (familyData.length > 0) {
            const findFamilyMembership = memberData.family_details.find((obj) => obj?._id === familyData[0]?._id);

            if (findFamilyMembership) {
                if (findFamilyMembership?.plans?.end_date) {
                    // check if end date is expired or about to expire in 15 days then return you have to subscribe to membership first
                    const [day, month, year] = findFamilyMembership?.plans?.end_date.split("/").map(Number);
                    const expirePlanDate = new Date(year, month - 1, day);
                    const today = new Date();
                    const addDaysDate = addDays(today, 15);

                    if (isBefore(expirePlanDate, addDaysDate)) {
                        toast_popup("You have to subscribe to membership first", "error");
                        return;
                    } else {
                        setShowRenewModel(data);
                    }
                } else {
                    toast_popup("You have to subscribe to membership first", "error");
                }
            }
        } else {
            // check if end date current plan is expired or about to expire in 15 days then return you have to subscribe to membership first
            if (memberData?.current_plan?.end_date) {
                const [day, month, year] = memberData?.current_plan?.end_date.split("/").map(Number);
                const expirePlanDate = new Date(year, month - 1, day);
                const today = new Date();
                const addDaysDate = addDays(today, 15);

                if (isBefore(expirePlanDate, addDaysDate)) {
                    toast_popup("You have to subscribe to membership first", "error");
                    return;
                } else {
                    setShowRenewModel(data);
                }
            } else {
                toast_popup("You have to subscribe to membership first", "error");
            }
        }
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
                                <Sidebar authData={authData} memberData={memberData} />
                                <div className="col-md-7 col-lg-8 col-xl-9">
                                    {!memberDataLoading && memberData?.bookings && memberData?.bookings.length > 0 ? (
                                        memberData?.bookings.map((obj, key) => {
                                            if (obj.type !== "enrollment") return false;
                                            let paymentSuccess = obj.payment_status === "Success" ? true : false;
                                            let showRenewButton = false;
                                            let expirePlanDate = null;

                                            if (obj?.fees_breakup?.end_date) {
                                                const [day, month, year] = obj?.fees_breakup?.end_date
                                                    .split("/")
                                                    .map(Number);
                                                expirePlanDate = new Date(year, month - 1, day);

                                                if (isValid(expirePlanDate)) {
                                                    // Use activity-specific renew settings from admin panel
                                                    const renewStartDays = renewSettings.activity_renew_start_days;
                                                    const renewEndDays = renewSettings.activity_renew_end_days;

                                                    console.log(
                                                        renewStartDays,
                                                        renewEndDays,
                                                        "renewStartDays, renewEndDays"
                                                    );

                                                    // Calculate start and end dates for renew button visibility
                                                    const renewStartDate = subDays(expirePlanDate, renewStartDays);
                                                    const renewEndDate = addDays(expirePlanDate, renewEndDays);

                                                    // Show the Renew button if the current date is within the renew period
                                                    if (
                                                        isWithinInterval(new Date(), {
                                                            start: renewStartDate,
                                                            end: renewEndDate,
                                                        })
                                                    ) {
                                                        showRenewButton = true;
                                                    } else {
                                                        showRenewButton = false;
                                                    }
                                                }
                                            }

                                            const familyData = obj?.family_member.filter((obj) => obj !== null);
                                            const familyIndex =
                                                familyData.length > 0
                                                    ? memberData.family_details.findIndex(
                                                          (fobj) => fobj?._id === familyData[0]?._id
                                                      )
                                                    : null;

                                            return (
                                                <div className={`checkout__single`} key={key}>
                                                    <h5 className={`d-flex justify-content-between align-items-center`}>
                                                        Activity - {obj?.activity_id?.name}
                                                        {paymentSuccess ? (
                                                            <span>
                                                                Payment Success{" "}
                                                                <FontAwesomeIcon
                                                                    icon={faCircleCheck}
                                                                    color="#0e7a31"
                                                                    fontSize={30}
                                                                    title="Payment Success"
                                                                />
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Payment Pending{" "}
                                                                <FontAwesomeIcon
                                                                    icon={faCircleXmark}
                                                                    color="red"
                                                                    fontSize={30}
                                                                    title="Payment Pending"
                                                                />
                                                            </span>
                                                        )}
                                                    </h5>
                                                    <div className={`plan-details-body`}>
                                                        <table className={`table`}>
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
                                                                            ? memberData.family_details[familyIndex]?.id
                                                                            : `P-${memberData?.member_id}`}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>CHSS Id</td>
                                                                    <td>
                                                                        {familyData.length > 0
                                                                            ? `${
                                                                                  memberData.family_details[familyIndex]
                                                                                      ?.card_number || "-"
                                                                              }`
                                                                            : `${memberData?.chss_number}`}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className={`plan-details-body`}>
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
                                                                    <span>{obj?.activity_id?.category[0].label}</span>
                                                                </li>
                                                            ) : null}
                                                            {obj?.activity_id?.location.length > 0 ? (
                                                                <li>
                                                                    <span>Location</span>
                                                                    <span>{obj?.activity_id?.location[0].label}</span>
                                                                </li>
                                                            ) : null}
                                                            <li>
                                                                <span>Plan Name</span>
                                                                <span>{obj?.fees_breakup?.plan_name}</span>
                                                            </li>
                                                            <li>
                                                                <span>Batch Name</span>
                                                                <span>{obj?.batch?.batch_name}</span>
                                                            </li>
                                                            <li>
                                                                <span>Activity Amount</span>
                                                                <span>{obj?.total_amount} Rs.</span>
                                                            </li>
                                                            {/* {
                                                                    getCountDependent(obj?.family_member, true) > 0 && (
                                                                        <li>
                                                                            <div className="d-flex">
                                                                                <p style={{ textWrap: "nowrap" }}>Secondary Member Price ({getCountDependent(obj?.family_member, true) || 0})</p>
                                                                                {
                                                                                    obj?.family_member.length > 0 && getCountDependent(obj?.family_member, true) > 0 && (
                                                                                        <div className={"iconContainer ml-5"} onClick={toggleDependent}>
                                                                                            <FontAwesomeIcon icon={faChevronDown} className={showDependent ? "rotated" : 'rotate-back'} />
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <span>
                                                                                {(obj?.activity_id?.fees_breakup?.dependent_member_price * getCountDependent(obj?.family_member, true)) || 0} Rs.
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                }

                                                                {
                                                                    showDependent && (
                                                                        obj?.family_member.map((data, key) => data?.is_dependent && (
                                                                            <li key={key} style={{ marginLeft: "2em" }}><span>{data?.name} ({data?.relation})</span><span>{data?.dependent_member_price || 0} Rs.</span></li>
                                                                        ))
                                                                    )
                                                                }
                                                                {
                                                                    getCountDependent(obj?.family_member, false) > 0 && (
                                                                        <li>
                                                                            <div className="d-flex">
                                                                                <p style={{ textWrap: "nowrap" }}>Non-dependent Member Price ({getCountDependent(obj?.family_member, false) || 0})</p>
                                                                                {
                                                                                    obj?.family_member.length > 0 && getCountDependent(obj?.family_member, false) > 0 && (
                                                                                        <div className={"iconContainer ml-5"} onClick={toggleNonDependent}>
                                                                                            <FontAwesomeIcon icon={faChevronDown} className={showNonDependent ? "rotated" : 'rotate-back'} />
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <span>
                                                                                {(obj?.activity_id?.fees_breakup?.non_dependent_member_price * getCountDependent(obj?.family_member, false) || 0)} Rs.
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                }

                                                                {
                                                                    showNonDependent && (
                                                                        obj?.family_member.map((data, key) => !data?.is_dependent && (
                                                                            <li key={key} style={{ marginLeft: "2em" }}><span>{data?.name} ({data?.relation})</span><span>{data?.dependent_member_price || 0} Rs.</span></li>
                                                                        ))
                                                                    )
                                                                } */}
                                                            {console.log(showRenewButton, "showRenewButton")}
                                                            {obj?.payment_status === "Success" &&
                                                                obj?.fees_breakup?.start_date &&
                                                                obj?.fees_breakup?.end_date && (
                                                                    <li>
                                                                        <span>
                                                                            {isValid(expirePlanDate) &&
                                                                            isAfter(
                                                                                addDays(isValid(expirePlanDate), 5),
                                                                                new Date()
                                                                            )
                                                                                ? "Your plan expired on "
                                                                                : "Your plan will expire on"}
                                                                            <span className="error-text">
                                                                                {" "}
                                                                                {format(expirePlanDate, "dd MMM, yyyy")}
                                                                            </span>
                                                                        </span>
                                                                        {showRenewButton && (
                                                                            <div
                                                                                className="text-center cta-btn m-0"
                                                                                onClick={() => handleRenew(obj)}
                                                                            >
                                                                                <button className="cmn-button cmn-button-small m-lg-2">
                                                                                    Renew
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                )}
                                                            <li>
                                                                <span
                                                                    style={{
                                                                        fontSize: 22,
                                                                    }}
                                                                >
                                                                    <strong>
                                                                        Total Amount {paymentSuccess ? "" : "to be"}{" "}
                                                                        Paid
                                                                    </strong>
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
                                                    {paymentSuccess && obj?.activity_id?.show_view_slots && (
                                                        <div className="d-flex justify-content-center">
                                                            <button
                                                                className="cmn-button cmn-button--secondary"
                                                                onClick={() => handleSlotModal(obj?.slots)}
                                                            >
                                                                View Slot Details
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <h4>No Activity Booked.</h4>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommonModal
                open={modalOpen}
                onClose={() => handleSlotModal(null)}
                children={<SlotsModal slotData={slotsData} />}
                className={"slots-modal"}
            />
            <CommonModal
                open={Boolean(showRenewModel)}
                onClose={() => setShowRenewModel(false)}
                children={<RenewModal memberData={showRenewModel} currentBatch={showRenewModel} type="enrollment" />}
                className={"slots-modal"}
            />
            <Footer />
        </Fragment>
    );
};

export default SportsActivityContainer;
