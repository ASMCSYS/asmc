import { FormControl, FormLabel, RadioGroup } from "@mui/material";
import { Fragment } from "react";
import { handleDateTimeDefault } from "../../../helpers/utils";

export const CardContent = ({ cardData, prePrint }) => {
    console.log(cardData, "cardData");

    return (
        <Fragment>
            <div className="main" style={{ backgroundColor: prePrint ? "transparent" : "#e5f4fd" }}>
                <div className="card">
                    <div className="header" style={{ opacity: prePrint ? 0 : 1 }}>
                        <img src="/assets/images/logo-icon.png" alt="logo" width="70" />
                        <h1>ANUSHAKTINAGAR SPORTS MANAGEMENT COMMITTEE (ASMC)</h1>
                    </div>
                    <div className="profile">
                        <h2 style={{ opacity: prePrint ? 0 : 1 }}>Member Profile</h2>
                        <div className="profile-details">
                            <table>
                                <tr>
                                    <td
                                        style={{
                                            width: "260px",
                                            height: "10rem",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                            color: prePrint ? "transparent" : "#000",
                                            backgroundColor: prePrint ? "transparent" : "",
                                        }}
                                    >
                                        Name
                                    </td>
                                    <td
                                        style={{
                                            height: "10rem",
                                            lineBreak: "anywhere",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                        }}
                                    >
                                        {cardData?.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            width: "260px",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                            backgroundColor: prePrint ? "transparent" : "",
                                            height: "7.5rem",
                                            color: prePrint ? "transparent" : "#000",
                                        }}
                                    >
                                        Mobile No.
                                    </td>
                                    <td
                                        style={{
                                            lineBreak: "anywhere",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                        }}
                                    >
                                        {cardData?.mobile}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            width: "260px",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                            backgroundColor: prePrint ? "transparent" : "",
                                            height: "7.5rem",
                                            color: prePrint ? "transparent" : "#000",
                                        }}
                                    >
                                        Email ID
                                    </td>
                                    <td
                                        style={{
                                            lineBreak: "anywhere",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                        }}
                                    >
                                        {cardData?.email}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            width: "260px",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                            backgroundColor: prePrint ? "transparent" : "",
                                            height: "7.5rem",
                                            color: prePrint ? "transparent" : "#000",
                                        }}
                                    >
                                        CHSS / ID
                                    </td>
                                    <td
                                        style={{
                                            lineBreak: "anywhere",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                        }}
                                    >
                                        {cardData?.chss_number}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            width: "260px",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                            backgroundColor: prePrint ? "transparent" : "",
                                            height: "7.5rem",
                                            color: prePrint ? "transparent" : "#000",
                                        }}
                                    >
                                        DOB
                                    </td>
                                    <td
                                        style={{
                                            lineBreak: "anywhere",
                                            border: "2px solid",
                                            borderColor: prePrint ? "transparent" : "#4e889b",
                                        }}
                                    >
                                        {cardData?.dob ? handleDateTimeDefault(cardData?.dob, "dd/MM/yyyy") : "-"}
                                    </td>
                                </tr>
                            </table>
                            <div
                                className="profile-photo"
                                style={{
                                    opacity: prePrint && !cardData?.profile ? 0 : 1,
                                }}
                            >
                                {cardData?.profile ? (
                                    <img src={cardData?.profile} className="photo" alt="profile" />
                                ) : (
                                    <div className="photo"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="membership-details">
                    <h2 style={{ opacity: prePrint ? 0 : 1 }}>Membership Details</h2>
                    <div className="membership-table">
                        <table>
                            <tr>
                                <td
                                    style={{
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                        backgroundColor: prePrint ? "transparent" : "",
                                        color: prePrint ? "transparent" : "#000",
                                    }}
                                >
                                    Membership No.
                                </td>
                                <td
                                    style={{
                                        minWidth: "700px",
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                    }}
                                >
                                    {cardData?.membership_no}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                        backgroundColor: prePrint ? "transparent" : "",
                                        color: prePrint ? "transparent" : "#000",
                                    }}
                                >
                                    Membership Type
                                </td>
                                <td
                                    style={{
                                        minWidth: "700px",
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                    }}
                                >
                                    {cardData?.membership_type}{" "}
                                    <span style={{ color: "red", fontWeight: "bold" }}>
                                        {cardData?.chss_number === "NON CHSS" ? "(Non Dependent)" : null}
                                    </span>
                                    {cardData?.membership_type === "Secondary" && (
                                        <span style={{ color: "red", fontWeight: "bold" }}>
                                            {cardData?.is_dependent ? null : "(Non Dependent)"}
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                        backgroundColor: prePrint ? "transparent" : "",
                                        color: prePrint ? "transparent" : "#000",
                                    }}
                                >
                                    Membership Plan
                                </td>
                                <td
                                    style={{
                                        minWidth: "700px",
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                    }}
                                >
                                    {cardData?.membership_plan}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                        backgroundColor: prePrint ? "transparent" : "",
                                        color: prePrint ? "transparent" : "#000",
                                    }}
                                >
                                    Relation With Primary
                                </td>
                                <td
                                    style={{
                                        minWidth: "700px",
                                        border: "2px solid",
                                        borderColor: prePrint ? "transparent" : "#4e889b",
                                    }}
                                >
                                    {cardData?.relation_with_primary}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="footer" style={{ opacity: prePrint ? 0 : 1 }}>
                    Office: NCC Complex, Opposite Post Office, Anushaktinagar
                    <br />
                    Email: asmc.dae@gmail.com; Phone: 2558 0497
                </div>
            </div>
            <div className="back-main" style={{ backgroundColor: prePrint ? "transparent" : "#e5f4fd" }}>
                <div class="table-container">
                    <table>
                        <tr style={{ opacity: prePrint ? 0 : 1, border: prePrint ? "none" : "2px solid #4e889b" }}>
                            <th
                                style={{
                                    opacity: prePrint ? 0 : 1,
                                    border: prePrint ? "none" : "2px solid #4e889b",
                                    padding: prePrint ? "16px" : "15px",
                                    width: "55px",
                                    width: "6.6%",
                                }}
                            >
                                Sr. No.
                            </th>
                            <th
                                style={{
                                    opacity: prePrint ? 0 : 1,
                                    border: prePrint ? "none" : "2px solid #4e889b",
                                    padding: prePrint ? "16px" : "15px",
                                    width: "25.5%",
                                }}
                            >
                                Sports Activities
                            </th>
                            <th
                                style={{
                                    opacity: prePrint ? 0 : 1,
                                    border: prePrint ? "none" : "2px solid #4e889b",
                                    padding: prePrint ? "16px" : "15px",
                                    width: "20.8%",
                                }}
                            >
                                Category Main / Sub
                            </th>
                            <th
                                style={{
                                    opacity: prePrint ? 0 : 1,
                                    border: prePrint ? "none" : "2px solid #4e889b",
                                    padding: prePrint ? "16px" : "15px",
                                    width: "10.4%",
                                }}
                            >
                                Valid Upto
                            </th>
                            <th
                                style={{
                                    opacity: prePrint ? 0 : 1,
                                    border: prePrint ? "none" : "2px solid #4e889b",
                                    padding: prePrint ? "16px" : "15px",
                                    width: "23.6%",
                                }}
                            >
                                Batch Name
                            </th>
                            <th
                                style={{
                                    opacity: prePrint ? 0 : 1,
                                    border: prePrint ? "none" : "2px solid #4e889b",
                                    padding: prePrint ? "16px" : "15px",
                                    width: "13.2%",
                                }}
                            >
                                Sign
                            </th>
                        </tr>
                        {cardData?.bookings &&
                            cardData?.bookings.map((obj, index) => {
                                return (
                                    <tr>
                                        <td style={{ border: "2px solid #4e889b" }}>{index + 1}</td>
                                        <td style={{}}>
                                            <span>{obj?.activity}</span>
                                            <span style={{ display: "block", fontSize: 35 }}>
                                                {obj?.location ? `${obj?.location}` : ""}{" "}
                                                {obj?.sublocation ? `(${obj?.sublocation})` : ""}
                                            </span>
                                        </td>
                                        <td style={{}}>
                                            <span>{obj?.category}</span>
                                            <span style={{ display: "block", fontSize: 35 }}>
                                                {obj?.sub_category ? `(${obj?.sub_category})` : ""}
                                            </span>
                                        </td>
                                        <td style={{}}>{obj?.valid_upto}</td>
                                        <td style={{}}>{obj?.batch_name}</td>
                                        <td style={{}}></td>
                                    </tr>
                                );
                            })}
                    </table>
                </div>
            </div>
        </Fragment>
    );
};
