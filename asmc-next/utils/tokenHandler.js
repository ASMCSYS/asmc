import { addNewCookie } from "./helper";

/**
 * Extracts token from URL parameters and sets it as a cookie
 * This should be called on pages that can receive tokens from mobile app
 */
export const handleTokenFromURL = () => {
    if (typeof window === "undefined") return; // Server-side check

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const fromApp = urlParams.get("from");

    console.log("token", token);
    console.log("from", fromApp);

    if (token) {
        // Set token as cookie
        // document.cookie = `token=${token};`; // 24 hours
        addNewCookie("token", token);

        // Set from=app cookie if present
        if (fromApp === "app") {
            addNewCookie("fromMobileApp", "true");
        }

        // Also set in localStorage for consistency
        // localStorage.setItem("token", token);

        // Clean up the URL by removing the token and from parameters
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete("token");
        newUrl.searchParams.delete("from");
        window.history.replaceState({}, document.title, newUrl.pathname + newUrl.search);

        // console.log("Token set from URL parameter");
        // reload the page
        window.location.reload();
    }
};

/**
 * Gets the token from cookie or localStorage
 * @returns {string|null} The token if found
 */
export const getToken = () => {
    if (typeof window === "undefined") return null;

    // Try to get from cookie first
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("asmc_token="));

    if (tokenCookie) {
        return tokenCookie.split("=")[1];
    }

    // Fallback to localStorage
    return localStorage.getItem("token");
};

/**
 * Removes the token from cookie and localStorage
 */
export const removeToken = () => {
    if (typeof window === "undefined") return;

    // Remove from cookie
    document.cookie = "asmc_token=; path=/; domain=.asmcdae.in; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Remove from localStorage
    localStorage.removeItem("token");
};

/**
 * Checks if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
    return !!getToken();
};
