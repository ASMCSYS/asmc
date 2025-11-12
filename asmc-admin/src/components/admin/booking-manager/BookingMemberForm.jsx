import { Box, Card, Grid, Switch, Typography, IconButton, CardHeader, Avatar, CardContent } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Button from "../../Common/Button";
import { SingelPlayerDetails } from "./SinglePlayerDetails";
import { useEffect, useState } from "react";

export const BookingMemberForm = ({
    data,
    nonVerifiedMembers,
    setNonVerifiedMembers,
    verifiedMembers,
    setVerifiedMembers,
    selectedSlot,
    disabled,
}) => {
    const [players, setPlayers] = useState([]);

    console.log(players, "playersplayersplayers");

    useEffect(() => {
        const allMembers = [...(verifiedMembers ?? []), ...(nonVerifiedMembers ?? [])];
        if (allMembers.length === parseInt(selectedSlot?.no_of_player)) {
            setPlayers(allMembers);
        } else {
            setPlayers(
                Array.from({ length: parseInt(selectedSlot?.no_of_player) }).map(() => ({
                    is_member: "",
                })),
            );
        }
    }, [selectedSlot]);

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
                        Member Configuration
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        A minimum of <strong>{selectedSlot?.no_of_player} players</strong> must be added in the list.
                    </Typography>
                </Box>

                {Array.from({ length: selectedSlot?.no_of_player }, (_, i) => (
                    <Card
                        key={i}
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
                                    {i + 1}
                                </Avatar>
                            }
                            title={
                                <Typography variant="h6" fontWeight={600}>
                                    Player {i + 1}
                                </Typography>
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
                                index={i}
                                verifiedMembers={verifiedMembers}
                                setVerifiedMembers={setVerifiedMembers}
                                setNonVerifiedMembers={setNonVerifiedMembers}
                                nonVerifiedMembers={nonVerifiedMembers}
                                disabled={disabled}
                                player={players[i]}
                                setPlayer={(data) => {
                                    const newPlayers = [...players];
                                    newPlayers[i] = data;
                                    setPlayers(newPlayers);
                                }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </Card>
        </Grid>
    );
};
