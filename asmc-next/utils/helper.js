import { getCookie, setCookie } from "cookies-next";
import { differenceInYears, parseISO } from "date-fns";

export const getCountDependent = (data, status = true) => {
    // remvoe null values from array
    if (!data) return 0;
    data = data.filter((obj) => obj !== null);
    return data.filter((obj) => obj?.is_dependent === status && obj?.fees_paid === true).length || 0;
};
export const getNonPaidCountDependent = (data, status = true) => {
    // remvoe null values from array
    if (!data) return 0;
    data = data.filter((obj) => obj !== null);
    return data.filter((obj) => obj?.is_dependent === status && obj?.fees_paid === false).length || 0;
};

export const generateURL = ({ amount, name, upi }) => {
    return `upi://pay?pa=${upi}&pn=${name}&am=${amount}&cu=INR`;
};

export const addNewCookie = (cname, cvalue, exdays = 5) => {
    setCookie(cname, cvalue, { maxAge: exdays * 24 * 60 * 60 });
    return true;
};

export const getCookieData = (cname) => {
    return getCookie(cname);
};

export const getAuthToken = () => {
    return getCookieData("token");
};

export const removeCookie = (cname) => {
    return setCookie(cname, "", { maxAge: -1 });
};

export const getAuthUser = () => {
    try {
        const token = getAuthToken();
        const user = JSON.parse(atob(token.split(".")[1]));
        return user || null;
    } catch (error) {
        return null;
    }
};

export const signout = async (next) => {
    removeCookie("token");
    next();
};

// Mobile app integration functions
export const setMobileAppCloseSignal = () => {
    // Set a cookie to signal mobile app to close WebView
    setCookie("fromMobileApp", "close", {
        maxAge: 60, // 1 minute expiry
        path: "/",
        domain: ".asmcdae.in", // Adjust domain as needed
    });
    return true;
};

export const getMobileAppCloseSignal = () => {
    return getCookie("fromMobileApp");
};

export const clearMobileAppCloseSignal = () => {
    setCookie("fromMobileApp", "", {
        maxAge: -1,
        path: "/",
        domain: ".asmcdae.in",
    });
    return true;
};

export const calculateAge = (dob) => {
    try {
        // Parse the input date string
        const dobDate = parseISO(dob); // Accepts YYYY-MM-DD format
        const age = differenceInYears(new Date(), dobDate); // Calculate the age
        return age;
    } catch (error) {
        console.error("Invalid date format:", error);
        return null; // Return null if the input is invalid
    }
};

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
