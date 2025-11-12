
import { useNavigate } from "react-router-dom";

// mui component
import { useTheme } from "@emotion/react";
import { Box, Drawer, useMediaQuery } from "@mui/material";

// constants
import { drawerWidth, expandDrawerWidth } from "../../helpers/constants";

// third-party
import { BrowserView, MobileView } from "react-device-detect";
import PerfectScrollbar from 'react-perfect-scrollbar';

// custom component
import LogoSection from "./LogoSection";
import MenuList from "./MenuList";
import { useState } from "react";


const Sidebar = ({ drawerOpen, drawerToggle, modules }) => {
    const [currentDrawerWidth, setCurrentDrawerWidth] = useState(drawerWidth);

    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const path_url = window.location.pathname;

    const navigate = useNavigate();


    return (
        <Box
            onMouseEnter={() => setCurrentDrawerWidth(expandDrawerWidth)}
            onMouseLeave={() => setCurrentDrawerWidth(drawerWidth)}
            component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? currentDrawerWidth : 'auto' }} aria-label="mailbox folders">
            <Drawer
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: matchUpMd ? currentDrawerWidth : expandDrawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        [theme.breakpoints.up('md')]: {
                            top: '88px'
                        },
                        transitionDuration: "250ms",
                        transitionProperty: "all",
                        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Box sx={{ display: 'flex', p: 2, mx: 'auto', width: "100%" }}>
                        <LogoSection theme={theme} />
                    </Box>
                </Box>
                <BrowserView>
                    <PerfectScrollbar
                        component="div"
                        style={{
                            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                        }}
                    >
                        <MenuList modules={modules} navigate={navigate} path_url={path_url} theme={theme} opened={currentDrawerWidth === expandDrawerWidth} />
                    </PerfectScrollbar>
                </BrowserView>
                <MobileView>
                    <PerfectScrollbar
                        component="div"
                        style={{
                            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                        }}
                    >
                        <MenuList modules={modules} navigate={navigate} path_url={path_url} theme={theme} opened={currentDrawerWidth === expandDrawerWidth} />
                    </PerfectScrollbar>
                </MobileView>
            </Drawer>
        </Box >
    );
}

export default Sidebar;
