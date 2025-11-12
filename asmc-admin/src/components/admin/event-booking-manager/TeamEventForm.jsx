import { Box, Card, Grid, Switch, Typography, IconButton, CardHeader, Avatar, CardContent } from "@mui/material";
import { ParticipantForm } from "./ParticipantForm";
import { Delete } from "@mui/icons-material";
import Button from "../../Common/Button";
import { SingelPlayerDetails } from "./SinglePlayerDetails";
import { useEffect } from "react";

export const TeamEventForm = ({
    eventData,
    formData,
    setFormData,
    nonVerifiedMembers,
    setNonVerifiedMembers,
    verifiedMembers,
    setVerifiedMembers,
    disabled,
    setShowPayButton,
    selectedCategory,
}) => {
    const handleRemovePlayer = (indexToRemove) => {
        const updatedMembers = formData?.team_members.filter((_, i) => i !== indexToRemove);
        const updatedVerified = verifiedMembers.filter((_, i) => i !== indexToRemove);
        const updatedNonVerified = nonVerifiedMembers.filter((_, i) => i !== indexToRemove);

        setFormData((prev) => ({
            ...prev,
            team_members: updatedMembers,
        }));

        // remove undefined and filter the array to remove null values

        setVerifiedMembers(updatedVerified);
        setNonVerifiedMembers(updatedNonVerified);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const currentCount = formData?.team_members?.length || 0;
            const hasMinimumPlayers = currentCount >= parseInt(eventData?.min_players_limit);
            const allPlayersValid = formData?.team_members?.every(
                (member) => member?.name?.trim() && member?.dob?.trim(),
            );

            if (hasMinimumPlayers && allPlayersValid) {
                setShowPayButton(true);
            } else {
                setShowPayButton(false);
            }
        }, 100); // Wait 100ms before evaluating

        return () => clearTimeout(timeout);
    }, [formData?.team_members, eventData?.min_players_limit, selectedCategory]);

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
                        Team Event Configuration
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        A minimum of <strong>{eventData?.min_players_limit} players</strong> must be added in the list,
                        and a maximum of <strong>{eventData?.players_limit} players</strong> can participate in this
                        event.
                    </Typography>
                </Box>

                {formData?.team_members.map((player, index) => (
                    <Card
                        key={index}
                        elevation={3}
                        sx={{
                            mb: 3,
                            borderLeft: "6px solid #0d6efd",
                            backgroundColor: "#fdfdff",
                            borderRadius: 2,
                            border: "1px solid #d0e2ff",
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar
                                    sx={{
                                        bgcolor: "#0d6efd",
                                        width: 35,
                                        height: 35,
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {index + 1}
                                </Avatar>
                            }
                            title={
                                <Typography variant="h6" fontWeight={600}>
                                    Player {index + 1}
                                </Typography>
                            }
                            action={
                                <IconButton color="error" size="small" onClick={() => handleRemovePlayer(index)}>
                                    <Delete />
                                </IconButton>
                            }
                            sx={{
                                backgroundColor: "#e9f0fb",
                                borderBottom: "1px solid #d0e2ff",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                px: 3,
                                py: 2,
                            }}
                        />
                        <CardContent sx={{ px: 3, py: 2 }}>
                            <SingelPlayerDetails
                                index={index}
                                player={player}
                                formData={formData}
                                setFormData={setFormData}
                                setNonVerifiedMembers={setNonVerifiedMembers}
                                nonVerifiedMembers={nonVerifiedMembers}
                                verifiedMembers={verifiedMembers}
                                setVerifiedMembers={setVerifiedMembers}
                                disabled={disabled}
                            />
                        </CardContent>
                    </Card>
                ))}

                <Box mt={3}>
                    {formData?.team_members.length < parseInt(eventData?.players_limit) && (
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth={false}
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    team_members: [
                                        ...prev.team_members,
                                        {
                                            name: "",
                                            email: "",
                                            gender: "",
                                            mobile: "",
                                            dob: "",
                                            chss_number: "",
                                        },
                                    ],
                                }))
                            }
                            disabled={disabled}
                        >
                            Add Player
                        </Button>
                    )}
                </Box>
            </Card>
        </Grid>
    );
};
