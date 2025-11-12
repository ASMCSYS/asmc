import "@/styles/style.scss";
import "@/styles/glyphter/css/asmc.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { getCookieData } from "@/utils/helper";
import { useRouter } from "next/router";
// import { getAuthUser } from "@/utils/helper";

library.add(fas);

export default function App({ Component, pageProps }) {
    const router = useRouter();

    console.log(router.pathname, "router.pathname");

    useEffect(() => {
        AOS.init();
    }, []);

    // Mobile app browser auto-close functionality
    useEffect(() => {
        const fromMobileApp = getCookieData("fromMobileApp");

        if (fromMobileApp === "true" || fromMobileApp === "close") {
            // Check if current path is dashboard
            const currentPath = router.pathname;
            const pathAllowed = [
                "/booking/sports-booking/[activity_id]",
                "/events/booking/[event_id]",
                "/booking/hall-booking/[hall_id]",
            ];
            if (!pathAllowed.includes(currentPath)) {
                window.location.href = "asmc-mobile-app:/callback";
                // window.location.href = "exp://192.168.31.195:8081/--/callback";
            }
        }
    }, [router.pathname]);

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}
