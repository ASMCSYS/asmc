import React from "react";
import { usePermission } from "../../hooks/usePermission";

const HasPermission = ({ permission, permissions, requireAll = false, fallback = null, children }) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions, hasFullAccess } = usePermission();

    // If user has full access (*), always render children
    if (hasFullAccess) {
        return children;
    }

    // Handle single permission case
    if (permission) {
        return hasPermission(permission) ? children : fallback;
    }

    // Handle multiple permissions case
    if (permissions) {
        const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

        return hasAccess ? children : fallback;
    }

    return fallback;
};

export default HasPermission;
