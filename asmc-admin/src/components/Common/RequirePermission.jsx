import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Utility to check if user has permission
const hasPermission = (userPermissions, required) => {
    if (!required) return true;
    if (userPermissions.includes("*")) return true;
    if (Array.isArray(required)) {
        return required.some((perm) => userPermissions.includes(perm));
    }
    return userPermissions.includes(required);
};

const RequirePermission = ({ permission, children, redirectTo = "/unauthorized" }) => {
    const user = useSelector((state) => state.auth.user);
    const userPermissions = user?.permissions || [];

    if (!hasPermission(userPermissions, permission)) {
        return <Navigate to={redirectTo} replace />;
    }
    return children;
};

export default RequirePermission;
