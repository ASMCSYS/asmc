import { Box, Card, Grid, Switch, Typography, IconButton } from "@mui/material";
import { ParticipantForm } from "./ParticipantForm";

export const DoubleEventForm = ({
    formData,
    setFormData,
    nonVerifiedMembers,
    setNonVerifiedMembers,
    verifiedMembers,
    setVerifiedMembers,
    disabled,
    setSelectedCategory,
    setTotalAmountToPay,
    setShowPayButton,
}) => {
    const findInitialValue = (type) => {
        const isMember = type === "member";
        const isPartner = type === "partner";

        const memberIsYes = formData?.are_you_member === "Yes";
        const partnerIsYes = formData?.partner_member === "Yes";

        // Both are members – pull from verifiedMembers
        if (memberIsYes && partnerIsYes) {
            return isMember ? verifiedMembers?.[0] ?? null : verifiedMembers?.[1] ?? null;
        }

        // Member is Yes, Partner is No
        if (memberIsYes && !partnerIsYes) {
            if (isMember) return verifiedMembers?.[0] ?? null;
            if (isPartner) return nonVerifiedMembers?.[0] ?? null;
        }

        // Member is No, Partner is Yes
        if (!memberIsYes && partnerIsYes) {
            if (isMember) return nonVerifiedMembers?.[0] ?? null;
            if (isPartner) return verifiedMembers?.[0] ?? null;
        }

        // Both are not members – pick from nonVerifiedMembers
        if (!memberIsYes && !partnerIsYes) {
            return isMember ? nonVerifiedMembers?.[0] ?? null : nonVerifiedMembers?.[1] ?? null;
        }

        return null;
    };

    return (
        <Grid item xs={12}>
            <Card
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    mx: "auto",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Double Event Configuration
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Configure 2 participants for this event
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">First Player ASMC Member?</Typography>
                    <Switch
                        checked={formData?.are_you_member === "Yes"}
                        onChange={(e) => {
                            setFormData((props) => ({
                                ...props,
                                are_you_member: e.target.checked ? "Yes" : "No",
                            }));
                            if (e.target.checked) {
                                // remove first non verifeid member
                                if (
                                    nonVerifiedMembers &&
                                    nonVerifiedMembers.filter((member) => member !== null).length > 0
                                )
                                    setNonVerifiedMembers((prev) =>
                                        prev.filter((member) => member !== null).filter((_, index) => index !== 0),
                                    );
                            } else {
                                // remove first verified member
                                if (verifiedMembers && verifiedMembers.filter((member) => member !== null).length > 0)
                                    setVerifiedMembers((prev) =>
                                        prev.filter((member) => member !== null).filter((_, index) => index !== 0),
                                    );
                            }
                        }}
                        color={formData?.are_you_member === "Yes" ? "success" : "error"}
                    />
                </Box>

                <Box sx={{ mt: 2, mb: 2 }}>
                    <ParticipantForm
                        title="Participant Details"
                        setNonVerifiedMembers={setNonVerifiedMembers}
                        setVerifiedMembers={setVerifiedMembers}
                        verifiedMembers={verifiedMembers}
                        nonVerifiedMembers={nonVerifiedMembers}
                        isMember={formData?.are_you_member === "Yes"}
                        initialData={findInitialValue("member")}
                        setFormData={setFormData}
                        formData={formData}
                        setSelectedCategory={setSelectedCategory}
                        setTotalAmountToPay={setTotalAmountToPay}
                        setShowPayButton={setShowPayButton}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">Is player partner ASMC member?</Typography>
                    <Switch
                        checked={formData?.partner_member === "Yes"}
                        onChange={(e) => {
                            setFormData((props) => ({
                                ...props,
                                partner_member: e.target.checked ? "Yes" : "No",
                            }));
                        }}
                        color={formData?.partner_member === "Yes" ? "success" : "error"}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <ParticipantForm
                        title="Participant Details"
                        setNonVerifiedMembers={setNonVerifiedMembers}
                        setVerifiedMembers={setVerifiedMembers}
                        verifiedMembers={verifiedMembers}
                        nonVerifiedMembers={nonVerifiedMembers}
                        formData={formData}
                        isMember={formData?.partner_member === "Yes"}
                        initialData={findInitialValue("partner")}
                        setFormData={setFormData}
                        setSelectedCategory={setSelectedCategory}
                        setTotalAmountToPay={setTotalAmountToPay}
                        setShowPayButton={setShowPayButton}
                    />
                </Box>
            </Card>
        </Grid>
    );
};
