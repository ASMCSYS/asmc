// assets
import { useNavigate } from "react-router-dom";

// mui components
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Logout, NewReleases } from "@mui/icons-material";
import IconMenu from "@mui/icons-material/Menu";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";

// helpers
import { isAuth, signout } from "../../helpers/cookies";
import { useTheme } from "@emotion/react";
import { drawerWidth } from "../../helpers/constants";
import Notification from "./Notification";
import Profile from "./Profile";
import ReleaseNotesModal from "./ReleaseNotesModal";
import { useState } from "react";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [openReleaseNotes, setOpenReleaseNotes] = useState(false);
    const handleSignOut = () => {
        signout(() => navigate(0));
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    [theme.breakpoints.down("md")]: {
                        width: "auto",
                    },
                }}
            >
                <Box
                    component="span"
                    sx={{ display: { xs: "none", md: "block" }, flexGrow: 1, textAlign: "left", paddingLeft: 2 }}
                >
                    <img
                        style={{
                            width: "25%",
                            verticalAlign: "middle",
                        }}
                        src={"assets/images/logo-name.png"}
                        alt="logo"
                    />
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
                <IconButton sx={{ borderRadius: "12px", overflow: "hidden" }} onClick={handleLeftDrawerToggle}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            transition: "all .2s ease-in-out",
                            background: theme.palette.background.default,
                            color: theme.palette.text.primary,
                        }}
                        color="inherit"
                    >
                        <IconMenu stroke={1.5} size="1.3rem" />
                    </Avatar>
                </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <IconButton onClick={() => setOpenReleaseNotes(true)} title="What's New">
                    <NewReleases color="primary" />
                </IconButton>
                <Notification />
                <Profile />
            </Stack>

            <ReleaseNotesModal forceOpen={openReleaseNotes} onForceClose={() => setOpenReleaseNotes(false)} />
        </>
    );
};

export default Header;
