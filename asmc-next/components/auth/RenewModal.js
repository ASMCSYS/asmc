import { getNextPlan, initiateRenewPaymentApi } from "@/apis/bookings.api";
import { paymentUrl } from "@/utils/constants";
import { toast_popup } from "@/utils/toast";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function calculatePlanAmount(plan, family, renewMemberData) {
    if (renewMemberData) {
        if (renewMemberData?.current_plan) {
            return plan?.amount;
        } else if (renewMemberData?.plans) {
            return renewMemberData?.is_dependent ? plan?.dependent_member_price : plan?.non_dependent_member_price;
        }
    } else {
        let totalAmount = plan?.amount || plan?.member_price || 0;

        if (family && family.length > 0) {
            family.map((obj) => {
                if (obj.is_dependent) {
                    totalAmount += plan?.dependent_member_price || 0;
                } else {
                    totalAmount += plan?.non_dependent_member_price || 0;
                }
                return totalAmount;
            });
        }
        return totalAmount;
    }
}

export const RenewModal = ({ memberData, type = "membership", currentBatch, renewMemberData = null }) => {
    const { current_plan = {}, fees_breakup = {} } = memberData;
    const [nextPlan, setNextPlan] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNextPlan = async () => {
        try {
            setLoading(true);
            let plan_id =
                type === "membership" ? current_plan.plan_id : type === "enrollment" ? fees_breakup?.plan_id : null;

            if (renewMemberData && renewMemberData?.current_plans?.plan_id) {
                plan_id = renewMemberData?.current_plans?.plan_id;
            } else if (renewMemberData && renewMemberData?.plans?.plan_id) {
                plan_id = renewMemberData?.plans?.plan_id;
            }

            if (!plan_id) {
                setLoading(false);
                return;
            }
            const res = await getNextPlan({
                plan_id: plan_id,
                type,
                activity_id: type === "enrollment" ? memberData?.activity_id?._id : null,
                batch_id: currentBatch?.batch?._id,
            });

            if (res && res.result) {
                setNextPlan(res.result);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    useEffect(() => {
        if (memberData) fetchNextPlan();
    }, [memberData]);

    const handlePlanChange = async (plan) => {
        try {
            let payload = {
                amount: calculatePlanAmount(plan, memberData?.family_details, renewMemberData),
                customer_email: memberData.email,
                customer_phone: memberData.mobile,
                remarks: `Renew Payment Member Id: ${memberData?.member_id}`,
                plan_id: plan?.plan_id,
                booking_id: type === "enrollment" ? memberData?._id : null,
                renew_member_id: memberData?._id,
                renew_secondary_member_id: renewMemberData?.plans ? renewMemberData?._id : null,
            };
            const response = await initiateRenewPaymentApi(payload);

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

            const paymentMethodField = document.createElement("input");
            paymentMethodField.name = "payment_option";
            paymentMethodField.value = "OPTCRDC";
            form.appendChild(paymentMethodField);

            document.body.appendChild(form);

            form.submit(); // Submit form to CCAvenue
        } catch (error) {
            toast_popup(error?.response?.data?.message || error?.message, "error");
        }
    };

    return (
        <div className="container pt-lg-5">
            <div className="row border-bottom border-top justify-content-center">
                {loading ? (
                    <div className="col-12 text-center mt-5 mb-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div>Loading plan details...</div>
                    </div>
                ) : Array.isArray(nextPlan) ? (
                    nextPlan.map((obj, index) => {
                        return (
                            <div
                                className="col-12 col-md-6 card shadow-lg m-1 bg-body rounded"
                                style={{ border: "1px solid #ddd", borderRadius: "10px" }}
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className="text-center">Plan Details</h5>
                                        </div>
                                        <div className="col-12">
                                            <p>
                                                <strong>Plan Name:</strong> {obj.plan_name}
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <p>
                                                <strong>Start Month:</strong>{" "}
                                                {format(new Date(2024, obj.start_month - 1), "MMMM")}
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <p>
                                                <strong>End Month:</strong>{" "}
                                                {format(new Date(2024, obj.end_month - 1), "MMMM")}
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <p>
                                                <strong>Total Amount:</strong>{" "}
                                                {calculatePlanAmount(obj, memberData?.family_details, renewMemberData)}{" "}
                                                Rs.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="text-center cta-btn m-0" onClick={() => handlePlanChange(obj)}>
                                            <button className="cmn-button cmn-button-small m-lg-2">Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : nextPlan ? (
                    <div
                        className="col-12 col-md-6 card shadow-lg"
                        style={{ border: "1px solid #ddd", borderRadius: "10px" }}
                    >
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className="text-center">Plan Details</h5>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Plan Name:</strong> {nextPlan.plan_name}
                                    </p>
                                </div>
                                {/* <div className="col-12">
                                        <p><strong>Amount:</strong> {type === "membership" ? nextPlan?.amount : nextPlan?.member_price} Rs.</p>
                                    </div> */}
                                <div className="col-12">
                                    <p>
                                        <strong>Start Month:</strong>{" "}
                                        {format(new Date(2024, nextPlan.start_month - 1), "MMMM")}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>End Month:</strong>{" "}
                                        {format(new Date(2024, nextPlan.end_month - 1), "MMMM")}
                                    </p>
                                </div>
                                {/* <div className="col-12">
                                        <p><strong>Dependent Member Price:</strong> {nextPlan.dependent_member_price} Rs.</p>
                                    </div>
                                    <div className="col-12">
                                        <p><strong>Non-Dependent Member Price:</strong> {nextPlan.non_dependent_member_price} Rs.</p>
                                    </div> */}
                                <div className="col-12">
                                    <p>
                                        <strong>Total Amount:</strong>{" "}
                                        {calculatePlanAmount(nextPlan, memberData?.family_details, renewMemberData)} Rs.
                                    </p>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="text-center cta-btn m-0" onClick={() => handlePlanChange(nextPlan)}>
                                    <button className="cmn-button cmn-button-small m-lg-2">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="col-12 text-center mt-5 mb-5">
                        No plan available to upgrade, please contact admin for more details.
                    </div>
                )}
            </div>
        </div>
    );
};
