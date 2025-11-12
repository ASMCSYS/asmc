import { Fragment, useCallback } from "react";
import { Col, Row, Card, Alert } from "react-bootstrap";

const EligibleCategories = ({
    data,
    formData,
    authData,
    verifiedMembers,
    nonVerifiedMembers,
    handleCategorySelect,
    selectedCategory,
}) => {
    const checkEligibility = (cateObj) => {
        const currentYear = new Date().getFullYear();
        const participants = [...verifiedMembers, ...nonVerifiedMembers].filter((participant) => participant !== null);

        console.log(participants, "participantsparticipants");

        for (const participant of participants) {
            if (!participant || !participant.dob) {
                continue; // Skip participants without valid data
            }

            const birthYear = new Date(participant.dob).getFullYear();
            const age = currentYear - birthYear;

            if (cateObj.start_age > age || cateObj.end_age < age) {
                return {
                    isEligible: false,
                    reason: `Age ${age} not in range ${cateObj.start_age} - ${cateObj.end_age}`,
                };
            }

            if (cateObj?.gender?.length > 0 && !cateObj.gender.includes(participant.gender)) {
                return {
                    isEligible: false,
                    reason: `Gender ${participant.gender} not allowed`,
                };
            }
        }

        return {
            isEligible: true,
            reason: "",
        };
    };

    return (
        <div className="col-12 p-0 pt-3">
            <h5>
                <strong>Eligible Categories:</strong>
            </h5>
            <div className="batch-section">
                <Row className="slots-container p-3">
                    {data?.category_data.map((cateObj, index) => {
                        const { isEligible: isUserEligible, reason: ineligibleReason } = checkEligibility(cateObj);
                        const isSelected = selectedCategory?._id === cateObj._id;

                        return (
                            <Col key={index} md={4} className="mb-3">
                                <Card
                                    className={`text-center p-3 d-flex flex-column align-items-center h-100 
                                        ${isSelected ? "border-success shadow-lg" : isUserEligible ? "border-primary shadow-sm" : "border-danger bg-light text-muted"}`}
                                    style={{
                                        cursor: isUserEligible ? "pointer" : "not-allowed",
                                        transition: "all 0.3s ease-in-out",
                                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                                        boxShadow: isSelected
                                            ? "0px 4px 15px rgba(0, 128, 0, 0.3)"
                                            : "0px 2px 10px rgba(0, 0, 0, 0.1)",
                                    }}
                                    onClick={() => isUserEligible && handleCategorySelect(cateObj)}
                                >
                                    <Card.Body className="align-content-center">
                                        <Card.Title className="mb-2">
                                            {cateObj.category_name}{" "}
                                            {isSelected && <span className="text-success">✔</span>}
                                        </Card.Title>

                                        {!isUserEligible && (
                                            <Alert variant="danger" className="p-2">
                                                <small>
                                                    {ineligibleReason ||
                                                        "Sorry, you are not eligible for this category."}
                                                </small>
                                            </Alert>
                                        )}

                                        <p className="mb-2">
                                            <strong>Age:</strong> {cateObj.start_age} - {cateObj.end_age}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Gender:</strong> {cateObj.gender.join(", ")}
                                        </p>
                                        {cateObj.distance && (
                                            <p className="mb-2">
                                                <strong>Distance in meters:</strong> {cateObj.distance}
                                            </p>
                                        )}

                                        {cateObj.belts && (
                                            <p className="mb-2">
                                                <strong>Belts:</strong> {cateObj.belts}
                                            </p>
                                        )}

                                        <p className="mb-2">
                                            {data?.event_type === "Team" ? (
                                                <Fragment>
                                                    <strong>All Member Team Fees:</strong> ₹
                                                    {data.member_team_event_price}
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <strong>Member Fees:</strong> ₹{cateObj.members_fees}
                                                </Fragment>
                                            )}
                                        </p>

                                        <p className="mb-2">
                                            {data?.event_type === "Team" ? (
                                                <Fragment>
                                                    <strong>Any Non Member Team Fees:</strong> ₹
                                                    {data.non_member_team_event_price}
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <strong>Non-member Fees:</strong> ₹{cateObj.non_members_fees}
                                                </Fragment>
                                            )}
                                        </p>
                                        <div dangerouslySetInnerHTML={{ __html: cateObj?.category_description }}></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
};

export default EligibleCategories;
