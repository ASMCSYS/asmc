import React from "react";
import { useDispatch, useSelector } from "react-redux";

// mui components
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";

// redux store
import { set_dark_mode } from "./store/common/commonSlice";

// project imports
import SnackBarContainer from "./components/Common/Snackbar";
import DarkTheme from "./helpers/theme/DarkTheme";
import LightTheme from "./helpers/theme/LightTheme";
import NavigationScroll from "./components/layout/NavigationScroll";

// routing
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom";

// ==============================|| APP Component ||============================== //

function App() {
    const dispatch = useDispatch();
    // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: light)");      // dark here means default theme is dark
    const { dark_mode } = useSelector((state) => state.common);

    React.useEffect(() => {
        dispatch(set_dark_mode("light"));
    }, [dispatch]);

    // Suppress ResizeObserver errors globally
    React.useEffect(() => {
        const resizeObserverError = (e) => {
            if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
                e.stopImmediatePropagation();
            }
        };
        window.addEventListener("error", resizeObserverError);
        return () => window.removeEventListener("error", resizeObserverError);
    }, []);

    const theme = React.useMemo(() => createTheme(dark_mode === "dark" ? DarkTheme : LightTheme), [dark_mode]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackBarContainer />
                <BrowserRouter>
                    <NavigationScroll>
                        <Routes />
                    </NavigationScroll>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;
