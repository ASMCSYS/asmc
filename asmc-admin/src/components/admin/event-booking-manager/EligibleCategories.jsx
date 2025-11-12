import { Card, CardContent, Grid, Typography, Alert, Box, Chip, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EligibleCategories = ({
    data,
    verifiedMembers,
    nonVerifiedMembers,
    handleCategorySelect,
    selectedCategory,
    disabled,
}) => {
    const theme = useTheme();

    const checkEligibility = (cateObj) => {
        const currentYear = new Date().getFullYear();
        const participants = [...verifiedMembers, ...nonVerifiedMembers].filter((participant) => participant !== null);

        for (const participant of participants) {
            const birthYear = new Date(participant?.dob).getFullYear();
            const age = currentYear - birthYear;

            if (cateObj.start_age > age || cateObj.end_age < age) {
                return {
                    isEligible: false,
                    reason: `Age ${age} not in range ${cateObj.start_age} - ${cateObj.end_age}`,
                };
            }

            if (cateObj?.gender?.length > 0 && !cateObj.gender.includes(participant?.gender)) {
                return {
                    isEligible: false,
                    reason: `Gender ${participant?.gender} not allowed`,
                };
            }
        }

        return {
            isEligible: true,
            reason: "",
        };
    };

    return (
        <Box sx={{ width: "100%", py: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Eligible Categories
            </Typography>

            <Grid container spacing={3}>
                {data?.category_data?.map((cateObj, index) => {
                    const { isEligible: isUserEligible, reason: ineligibleReason } = checkEligibility(cateObj);
                    const isSelected = selectedCategory?._id === cateObj._id;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                onClick={() => (disabled ? null : isUserEligible && handleCategorySelect(cateObj))}
                                sx={{
                                    height: "100%",
                                    cursor: isUserEligible ? "pointer" : "not-allowed",
                                    transition: "all 0.3s ease",
                                    border: isSelected
                                        ? `2px solid ${theme.palette.success.main}`
                                        : `1px solid ${theme.palette.divider}`,
                                    boxShadow: isSelected ? theme.shadows[6] : theme.shadows[2],
                                    opacity: isUserEligible ? 1 : 0.7,
                                    "&:hover": {
                                        transform: isUserEligible ? "translateY(-4px)" : "none",
                                        boxShadow: isUserEligible ? theme.shadows[8] : theme.shadows[2],
                                    },
                                    position: "relative",
                                }}
                            >
                                <CardContent>
                                    {isSelected && (
                                        <CheckCircleIcon
                                            sx={{
                                                position: "absolute",
                                                right: 8,
                                                top: 8,
                                                color: "success.main",
                                            }}
                                        />
                                    )}

                                    <Typography variant="h6" gutterBottom>
                                        {cateObj.category_name}
                                        {cateObj.belts && (
                                            <Chip
                                                label={cateObj.belts}
                                                size="small"
                                                sx={{ ml: 1, bgcolor: "primary.light" }}
                                            />
                                        )}
                                    </Typography>

                                    {!isUserEligible && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {ineligibleReason || "Sorry, you are not eligible for this category."}
                                        </Alert>
                                    )}

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                                            gap: 1.5,
                                            mt: 1,
                                        }}
                                    >
                                        <DetailItem label="Age" value={`${cateObj.start_age} - ${cateObj.end_age}`} />
                                        <DetailItem label="Gender" value={cateObj.gender.join(", ")} />
                                        {cateObj.distance && (
                                            <DetailItem label="Distance" value={`${cateObj.distance}m`} />
                                        )}
                                        <DetailItem
                                            label="Member Fees"
                                            value={`Rs. ${
                                                data?.event_type === "Team"
                                                    ? data?.member_team_event_price
                                                    : cateObj.members_fees
                                            }`}
                                        />
                                        <DetailItem
                                            label="Non-member Fees"
                                            value={`Rs. ${
                                                data?.event_type === "Team"
                                                    ? data?.non_member_team_event_price
                                                    : cateObj.non_members_fees
                                            }`}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

const DetailItem = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
            {value}
        </Typography>
    </Box>
);

export default EligibleCategories;
