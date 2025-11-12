import { AppBar, Box, Toolbar, styled, useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarMenu } from "../../store/common/commonSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { drawerWidth } from "../../helpers/constants";
import Breadcrumbs from "./Breadcrumbs";
import ReleaseNotesModal from "./ReleaseNotesModal";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    backgroundColor: theme?.palette?.background?.secondary,
    width: "calc(100% - 260px)",
    minHeight: "calc(100vh - 88px)",
    flexGrow: 1,
    padding: 20,
    marginTop: 88,
    marginRight: 20,
    borderRadius: "8px 8px 0px 0px",
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    [theme.breakpoints.up("md")]: {
        marginLeft: open ? 0 : -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
    },
    [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "16px",
    },
    [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "16px",
        marginRight: "10px",
    },
}));

const BaseLayout = (props) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
    const leftDrawerOpened = useSelector((state) => state.common.sidebar_open);

    const handleLeftDrawerToggle = () => {
        dispatch(setSidebarMenu(!leftDrawerOpened));
    };

    const { ChildComponent } = props;

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                open={true}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened ? theme.transitions.create("width") : "none",
                    padding: "10px 0 10px 0",
                }}
                enableColorOnDark
            >
                <Toolbar
                    sx={{
                        paddingLeft: "0px !important",
                    }}
                >
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            <Sidebar
                {...props}
                drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
                drawerToggle={handleLeftDrawerToggle}
            />
            <Main theme={theme} open={leftDrawerOpened}>
                <ChildComponent />
            </Main>
        </Box>
    );
};

export default BaseLayout;
