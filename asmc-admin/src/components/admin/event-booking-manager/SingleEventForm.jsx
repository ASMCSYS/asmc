import { Box, Card, Grid, Switch, Typography } from "@mui/material";
import { ParticipantForm } from "./ParticipantForm";

export const SingleEventForm = ({
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

        if (isMember && formData?.are_you_member === "Yes") {
            // Always pick index 0 for the main member
            return verifiedMembers?.[0] ?? null;
        }

        if (isMember && formData?.are_you_member === "No") {
            return nonVerifiedMembers?.[0] ?? null;
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
                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Event Configuration
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Configure participants for this event
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Is Member?</Typography>
                        <Switch
                            checked={formData?.are_you_member === "Yes"}
                            onChange={(e) => {
                                setFormData({
                                    yourself: "No",
                                    are_you_member: e.target.checked ? "Yes" : "No",
                                    partner_member: "",
                                    team_members: [],
                                });
                                setNonVerifiedMembers([]);
                                setVerifiedMembers([]);
                            }}
                            color={formData?.are_you_member === "Yes" ? "success" : "error"}
                            disabled={disabled}
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <ParticipantForm
                        title="Participant Details"
                        initialData={findInitialValue("member")}
                        setNonVerifiedMembers={setNonVerifiedMembers}
                        setVerifiedMembers={setVerifiedMembers}
                        verifiedMembers={verifiedMembers}
                        nonVerifiedMembers={nonVerifiedMembers}
                        setFormData={setFormData}
                        formData={formData}
                        setSelectedCategory={setSelectedCategory}
                        setTotalAmountToPay={setTotalAmountToPay}
                        setShowPayButton={setShowPayButton}
                        isMember={formData?.are_you_member === "Yes"}
                    />
                </Box>
            </Card>
        </Grid>
    );
};
