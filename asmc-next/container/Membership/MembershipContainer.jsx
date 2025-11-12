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
import { faChevronDown, faChevronUp, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { format, isValid, isBefore, subDays } from "date-fns";
import { CommonModal } from "@/components/common/Modal";
import { RenewModal } from "@/components/auth/RenewModal";
import { useFetchSingleMemberQuery } from "@/redux/auth/authApis";
import { useRenewSettings } from "@/hooks/useRenewSettings";

const MembershipContainer = (props) => {
    const { authData } = props;
    const { isLoading, data: memberData } = useFetchSingleMemberQuery({ _id: authData?._id }, { skip: !authData?._id });

    const { renewSettings } = useRenewSettings();

    const [expirePlanDate, setExpirePlanDate] = useState(null);
    const [showRenewButton, setShowRenewButton] = useState(false);

    const [showRenewModel, setShowRenewModel] = useState(false);
    const [renewMemberData, setRenewMemberData] = useState({});

    useEffect(() => {
        if (memberData?.current_plan?.end_date) {
            const [day, month, year] = memberData?.current_plan?.end_date.split("/").map(Number);
            const expireDate = new Date(year, month - 1, day);

            if (isValid(expireDate)) {
                setExpirePlanDate(expireDate);

                // Use membership-specific renew settings from admin panel
                const renewStartDays = renewSettings.membership_renew_start_days;
                const renewButtonDate = subDays(expireDate, renewStartDays);

                // Show the Renew button if the current date is after the renewButtonDate
                if (isBefore(renewButtonDate, new Date())) {
                    setShowRenewButton(true);
                }
            }
        }
    }, [memberData]);

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
                                        <Fragment>
                                            <div className="checkout__single-wrapper">
                                                <div className={`checkout__single`}>
                                                    <h5
                                                        className={`d-flex justify-content-between align-items-center `}
                                                    >
                                                        {memberData?.name} ({"P-" + memberData?.member_id}) - Primary
                                                        Member
                                                        {memberData?.fees_paid ? (
                                                            <span>
                                                                Paid{" "}
                                                                <FontAwesomeIcon
                                                                    icon={faCircleCheck}
                                                                    color="#0e7a31"
                                                                    className={``}
                                                                    fontSize={30}
                                                                    title="Payment Success"
                                                                />
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Not Paid{" "}
                                                                <FontAwesomeIcon
                                                                    icon={faCircleXmark}
                                                                    color="red"
                                                                    className={``}
                                                                    fontSize={30}
                                                                    title="Payment Failed"
                                                                />
                                                            </span>
                                                        )}
                                                    </h5>
                                                    <div className={`plan-details-body `}>
                                                        <ul>
                                                            <li>
                                                                <span>Membership Booking ID</span>
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
                                                            {expirePlanDate && (
                                                                <li>
                                                                    <span>
                                                                        Your plan will expire on{" "}
                                                                        <span className="error-text">
                                                                            {format(expirePlanDate, "dd MMM, yyyy")}
                                                                        </span>
                                                                    </span>
                                                                    {showRenewButton && (
                                                                        <div
                                                                            className="text-center cta-btn m-0"
                                                                            onClick={() => {
                                                                                setShowRenewModel(!showRenewModel),
                                                                                    setRenewMemberData(memberData);
                                                                            }}
                                                                        >
                                                                            <button className="cmn-button cmn-button-small m-lg-2">
                                                                                Renew
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* Family Details Section */}
                                                {memberData?.family_details?.length > 0 ? (
                                                    memberData.family_details.map((member, index) => {
                                                        let expireMemberDate = "";
                                                        let showRenew = false;

                                                        if (member?.plans?.end_date) {
                                                            const [day, month, year] = member?.plans?.end_date
                                                                .split("/")
                                                                .map(Number);
                                                            expireMemberDate = new Date(year, month - 1, day);

                                                            if (isValid(expireMemberDate)) {
                                                                showRenew = isBefore(
                                                                    subDays(expireMemberDate, 15),
                                                                    new Date()
                                                                );
                                                            }
                                                        }
                                                        return (
                                                            <div className={`checkout__single`} key={index}>
                                                                <h5 className="d-flex justify-content-between align-items-center">
                                                                    {member.name} ({member?.id})
                                                                    {member?.fees_paid ? (
                                                                        <span>
                                                                            Paid{" "}
                                                                            <FontAwesomeIcon
                                                                                icon={faCircleCheck}
                                                                                color="#0e7a31"
                                                                                className={``}
                                                                                fontSize={30}
                                                                                title="Payment Success"
                                                                            />
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            Not Paid{" "}
                                                                            <FontAwesomeIcon
                                                                                icon={faCircleXmark}
                                                                                color="red"
                                                                                className={``}
                                                                                fontSize={30}
                                                                                title="Payment Pending"
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </h5>
                                                                <div className={`plan-details-body`}>
                                                                    <ul>
                                                                        <li>
                                                                            <span>Relationship</span>
                                                                            <span>{member.relation || "N/A"}</span>
                                                                        </li>
                                                                        <li>
                                                                            <span>Plan Name</span>
                                                                            <span>
                                                                                {member?.plans?.plan_name || "N/A"}
                                                                            </span>
                                                                        </li>
                                                                        <li>
                                                                            <span>Membership Amount</span>
                                                                            <span>
                                                                                {member?.is_dependent
                                                                                    ? member.plans
                                                                                          ?.dependent_member_price || 0
                                                                                    : member.plans
                                                                                          ?.non_dependent_member_price ||
                                                                                      0}{" "}
                                                                                Rs.
                                                                            </span>
                                                                        </li>
                                                                        {expireMemberDate && (
                                                                            <li>
                                                                                <span>
                                                                                    Your plan will expire on{" "}
                                                                                    <span className="error-text">
                                                                                        {format(
                                                                                            expireMemberDate,
                                                                                            "dd MMM, yyyy"
                                                                                        )}
                                                                                    </span>
                                                                                </span>
                                                                                {showRenew && (
                                                                                    <div
                                                                                        className="text-center cta-btn m-0"
                                                                                        onClick={() => {
                                                                                            setShowRenewModel(
                                                                                                !showRenewModel
                                                                                            ),
                                                                                                setRenewMemberData(
                                                                                                    member
                                                                                                );
                                                                                        }}
                                                                                    >
                                                                                        <button className="cmn-button cmn-button-small m-lg-2">
                                                                                            Renew
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p>No family members found.</p>
                                                )}
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommonModal
                open={showRenewModel}
                onClose={() => setShowRenewModel(false)}
                children={<RenewModal renewMemberData={renewMemberData} memberData={memberData} />}
                className={"slots-modal"}
            />
            <Footer />
        </Fragment>
    );
};

export default MembershipContainer;
