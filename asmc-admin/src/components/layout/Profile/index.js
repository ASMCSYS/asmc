import PropTypes from "prop-types";
import { useRef, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Avatar,
    Box,
    ButtonBase,
    Card,
    CardContent,
    ClickAwayListener,
    Grid,
    IconButton,
    Paper,
    Popper,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";

// project import
import ProfileTab from "./ProfileTab";
import SettingTab from "./SettingTab";

// assets
// import avatar1 from 'assets/images/users/avatar-1.png';
// import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Transitions from "../../Common/Transition";
import { LogoutOutlined, Person, SettingsOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { isAuth, signout } from "../../../helpers/cookies";
import { useNavigate } from "react-router-dom";

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const Profile = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const authData = isAuth();

    const handleLogout = async () => {
        signout(() => navigate(0));
    };

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "secondary.lighter" },
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? "profile-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                    <AccountCircle sx={{ color: "#bdbdbd", width: "32px", height: "32px" }} />
                    <Typography variant="subtitle1">{authData?.name}</Typography>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, 9],
                            },
                        },
                    ],
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        {open && (
                            <Paper
                                sx={{
                                    boxShadow: theme.shadows,
                                    width: 290,
                                    minWidth: 240,
                                    maxWidth: 290,
                                    [theme.breakpoints.down("md")]: {
                                        maxWidth: 250,
                                    },
                                }}
                            >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <Card elevation={0} border={false} content={false}>
                                        <CardContent sx={{ px: 2.5, pt: 3 }}>
                                            <Grid container justifyContent="space-between" alignItems="center">
                                                <Grid item>
                                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                                        <AccountCircle
                                                            sx={{ color: "#bdbdbd", width: "32px", height: "32px" }}
                                                        />
                                                        <Stack>
                                                            <Typography variant="subtitle2">
                                                                {authData?.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {authData?.roles}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton size="large" onClick={handleLogout}>
                                                        <LogoutOutlined />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                            <ProfileTab handleLogout={handleLogout} navigate={navigate} />
                                        </CardContent>
                                    </Card>
                                </ClickAwayListener>
                            </Paper>
                        )}
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Profile;
