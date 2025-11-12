import cookie from "js-cookie";

// Set in Cookie
export const setCookie = (key, value) => {
    if (window !== "undefiend") {
        cookie.set(key, value, {
            // 1 Day
            expires: 1,
        });
    }
};
// remove from cookie
export const removeCookie = (key) => {
    if (window !== "undefined") {
        cookie.remove(key, {
            expires: 1,
        });
    }
};

// Get from cookie such as stored token
// Will be useful when we need to make request to server with token
export const getCookie = (key) => {
    if (window !== "undefined") {
        return cookie.get(key);
    }
};

// Set in localstorage
export const setLocalStorage = (key, value) => {
    if (window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Remove from localstorage
export const removeLocalStorage = (key) => {
    if (window !== "undefined") {
        localStorage.removeItem(key);
    }
};

// Auth enticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
    if (response.token) {
        setCookie("asmc_token", response.token);
        setLocalStorage("user", response.user);
        next(true);
    }
};

export const updateLocalStorage = (data) => {
    const user_data = isAuth();
    setLocalStorage("user", { ...user_data, ...data });
};

// Access user info from localstorage
export const isAuth = () => {
    if (window !== "undefined") {
        const cookieChecked = getCookie("asmc_token");
        if (cookieChecked) {
            const userData = localStorage.getItem("user");
            if (userData) {
                return JSON.parse(userData);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

export const hasPermission = (permission) => {
    const user = isAuth();
    if (user && user.permissions && (user.permissions.includes(permission) || user.permissions.includes("*"))) {
        return true;
    } else {
        return false;
    }
};

export const checkAuthToken = (token) => {
    if (token) {
        return JSON.parse(atob(token.split(".")[1]));
    } else {
        return false;
    }
};

export const signout = async (next) => {
    removeCookie("asmc_token");
    removeLocalStorage("user");
    next();
};
