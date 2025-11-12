import { signout } from "@/utils/helper";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const Sidebar = ({ authData, memberData }) => {
    const router = useRouter();
    const handleLogout = (e) => {
        e.preventDefault();
        signout(() => (window.location.href = "/sign-in"));
    };

    const [totalPaymentPending, setTotalPaymentPending] = useState(0);

    useEffect(() => {
        let total = 0;
        if (!memberData?.fees_verified) {
            total += 1;
        } else {
            const familyMembers = memberData.family_details;
            familyMembers.map((obj, key) => {
                if (!obj.fees_paid) {
                    total += 1;
                }
            });
        }
        if (memberData?.bookings) {
            memberData.bookings.map((obj, key) => {
                if (obj.payment_status === "Pending") {
                    total += 1;
                }
            });
        }

        setTotalPaymentPending(total);
    }, [memberData]);

    return (
        <div className="col-md-5 col-lg-4 col-xl-3">
            <div className="sticky">
                <div className="checkout__box position-relative">
                    <div className="checkout-profile-image">
                        {authData?.profile ? (
                            <Image src={authData?.profile} width={100} height={100} alt="Profile" />
                        ) : (
                            ""
                        )}
                    </div>
                    <p className="primary-text">{authData?.name}</p>
                    <p className="secondary-text">#{authData?.member_id}</p>

                    <div className="profile-other-data">
                        <p>Email: {authData?.email}</p>
                        <p>Mobile: {authData?.mobile}</p>
                        <p>DOB: {authData?.dob ? format(authData?.dob, "dd-MM-yyyy") : ""}</p>
                    </div>
                    <Link href={"/dashboard"} className="edit-icon">
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Link>
                </div>
                <Link href="/membership" className={`link-row ${router.pathname === "/membership" ? "active" : ""}`}>
                    Membership Fee Details
                </Link>
                <Link
                    href="/sports-activity"
                    className={`link-row ${router.pathname === "/sports-activity" ? "active" : ""}`}
                >
                    Enrolled Activity
                </Link>
                <Link
                    href="/booked-activity"
                    className={`link-row ${router.pathname === "/booked-activity" ? "active" : ""}`}
                >
                    Booked Activity
                </Link>
                <Link
                    href="/booked-events"
                    className={`link-row ${router.pathname === "/booked-events" ? "active" : ""}`}
                >
                    Booked Events
                </Link>
                <Link
                    href="/booked-halls"
                    className={`link-row ${router.pathname === "/booked-halls" ? "active" : ""}`}
                >
                    Booked Halls
                </Link>
                <Link
                    href="/pending-payment"
                    className={`link-row ${router.pathname === "/pending-payment" ? "active" : ""}`}
                >
                    Payment History
                    {totalPaymentPending ? (
                        <span
                            className="badge"
                            style={{
                                color: "red",
                                borderColor: "red",
                                borderWidth: "1px",
                                borderStyle: "solid",
                            }}
                        >
                            {totalPaymentPending}
                        </span>
                    ) : null}
                </Link>
                <Link
                    href="/change-password"
                    className={`link-row ${router.pathname === "/change-password" ? "active" : ""}`}
                >
                    Change Password
                </Link>
                <Link href="/" onClick={(e) => handleLogout(e)} className="link-row">
                    Logout
                </Link>
                {/* <Link href="/bookings" className="link-row">View Bookings</Link> */}
            </div>
        </div>
    );
};
