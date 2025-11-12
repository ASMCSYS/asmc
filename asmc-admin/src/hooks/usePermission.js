import { isAuth } from "../helpers/cookies";

export const usePermission = () => {
    const { permissions = [] } = isAuth();

    // Check if user has full admin access
    const hasFullAccess = permissions.includes("*");

    const checkSinglePermission = (permission) => {
        // If user has full access, always return true
        if (hasFullAccess) return true;

        // Get the module prefix (everything before the colon)
        const modulePrefix = permission.split(":")[0];

        // Check for three levels of "all" permission:
        // 1. Exact permission match
        // 2. Module-level "all" permission (e.g., "members:all")
        // 3. The specific permission itself
        return permissions.includes(permission) || permissions.includes(`${modulePrefix}:all`);
    };

    const hasPermission = (requiredPermission) => {
        if (!requiredPermission) return false;

        // Handle array of permissions
        if (Array.isArray(requiredPermission)) {
            return requiredPermission.some((perm) => checkSinglePermission(perm));
        }

        // Handle single permission
        return checkSinglePermission(requiredPermission);
    };

    const hasAnyPermission = (requiredPermissions) => {
        if (hasFullAccess) return true;
        return requiredPermissions.some((permission) => hasPermission(permission));
    };

    const hasAllPermissions = (requiredPermissions) => {
        if (hasFullAccess) return true;
        return requiredPermissions.every((permission) => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasFullAccess,
    };
};
