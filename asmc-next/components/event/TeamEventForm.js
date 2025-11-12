import { calculateAge } from "@/utils/helper";
import { Fragment, useEffect, useMemo, useState } from "react";
import EligibleCategories from "./EligibleCategories";
import { Summary } from "./Summary";
import { SingelPlayerDetails } from "./SinglePlayerDetails";

export const TeamEventForm = ({
    data,
    authData,
    formData,
    setFormData,
    setNonVerifiedMembers,
    nonVerifiedMembers,
    verifiedMembers,
    setVerifiedMembers,
    selectedCategory,
    setSelectedCategory,
    setTotalAmountToPay,
    totalAmountToPay,
    showPayButton,
    handleInitiatePayment,
    setShowPayButton,
}) => {
    console.log(totalAmountToPay, "totalAmountToPay");

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        if (nonVerifiedMembers.length > 0) {
            totalAmount = parseInt(data?.non_member_team_event_price);
        } else if (verifiedMembers.length > 0) {
            totalAmount = parseInt(data?.member_team_event_price);
        } else {
            totalAmount = 0;
        }

        setTotalAmountToPay(totalAmount);
        return totalAmount;
    };

    const handleRemovePlayer = (indexToRemove) => {
        const updatedMembers = formData.team_members.filter((_, i) => i !== indexToRemove);
        const updatedVerified = verifiedMembers.filter((_, i) => i !== indexToRemove);
        const updatedNonVerified = nonVerifiedMembers.filter((_, i) => i !== indexToRemove);

        setFormData((prev) => ({
            ...prev,
            team_members: updatedMembers,
        }));

        setVerifiedMembers(updatedVerified);
        setNonVerifiedMembers(updatedNonVerified);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const currentCount = formData?.team_members?.length || 0;
            const hasMinimumPlayers = currentCount >= parseInt(data?.min_players_limit);
            const allPlayersValid = formData?.team_members?.every(
                (member) => member?.name?.trim() && member?.dob?.trim()
            );

            if (hasMinimumPlayers && allPlayersValid) {
                setShowPayButton(true);
            } else {
                setShowPayButton(false);
            }
        }, 100); // Wait 100ms before evaluating

        return () => clearTimeout(timeout);
    }, [formData?.team_members, data?.min_players_limit, selectedCategory]);

    const renderMain = useMemo(() => {
        return (
            <div className="row">
                <div className="col-md-12 p-0 pb-4">
                    <p className="ml-0">
                        A minimum of <strong>{data?.min_players_limit} players</strong> must be added in the list, and a
                        maximum of <strong>{data?.players_limit} players</strong> can participate in this event.
                    </p>
                </div>

                {formData.team_members.map((player, index) => (
                    <div
                        key={index}
                        className="card shadow-sm mb-4 border border-primary-subtle rounded-4"
                        style={{
                            borderLeft: "6px solid #0d6efd",
                            backgroundColor: "#fdfdff",
                        }}
                    >
                        <div
                            className="card-header d-flex justify-content-between align-items-center rounded-top-4"
                            style={{
                                backgroundColor: "#e9f0fb",
                                borderBottom: "1px solid #d0e2ff",
                                padding: "1rem 1.5rem",
                            }}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <div
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <h5 className="mb-0 fw-semibold">Player {index + 1}</h5>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleRemovePlayer(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            <SingelPlayerDetails
                                index={index}
                                player={player}
                                setFormData={setFormData}
                                formData={formData}
                                authData={authData}
                                setNonVerifiedMembers={setNonVerifiedMembers}
                                nonVerifiedMembers={nonVerifiedMembers}
                                setVerifiedMembers={setVerifiedMembers}
                                verifiedMembers={verifiedMembers}
                            />
                        </div>
                    </div>
                ))}

                {/* Add/Remove Player Buttons */}
                <div className="col-md-12 mt-3">
                    {formData?.team_members.length < parseInt(data?.players_limit) && (
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    team_members: [
                                        ...prev.team_members,
                                        { name: "", email: "", gender: "", mobile: "", dob: "", chss_number: "" },
                                    ],
                                }))
                            }
                        >
                            Add Player
                        </button>
                    )}
                </div>

                {showPayButton && (
                    <Fragment>
                        <EligibleCategories
                            data={data}
                            formData={formData}
                            authData={authData}
                            verifiedMembers={verifiedMembers}
                            nonVerifiedMembers={nonVerifiedMembers}
                            handleCategorySelect={(cat) => setSelectedCategory(cat)}
                            selectedCategory={selectedCategory}
                        />

                        {selectedCategory && (
                            <Summary
                                selectedCategory={selectedCategory}
                                formData={formData}
                                calculateTotalAmount={calculateTotalAmount}
                                quantity={
                                    [...verifiedMembers, ...nonVerifiedMembers].filter((member) => member !== null)
                                        .length
                                }
                            />
                        )}

                        {totalAmountToPay > 0 && (
                            <div className="text-center cta-btn mt-3">
                                <button type="submit" className="cmn-button" onClick={() => handleInitiatePayment()}>
                                    Pay Now
                                </button>
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
        );
    });

    return renderMain;
};
