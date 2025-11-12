import Users from '../models/users.js';

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req?.session?._id;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Get user with roles and permissions
            const user = await Users.findById({ _id: userId });
            if (!user || !user.status) {
                return res.status(403).json({ message: 'User account is inactive' });
            }

            // Get user's permissions and role
            const userPermissions = user.permissions || [];
            const userRole = user.roles;

            // Check for wildcard "*" permission first - full admin access
            if (userPermissions.includes('*')) {
                return next();
            }

            // Special case for members accessing their own data
            if (
                userRole === 'users' || userRole === 'member'
            ) {
                // For members, check if they're accessing their own data
                const memberId = req.query._id || req.body._id;
                if (
                    memberId &&
                    user.member_id &&
                    user.member_id.toString &&
                    memberId === user.member_id.toString()
                ) {
                    return next();
                }
            }

            // If requiredPermission is an array, check if user has any of them
            if (Array.isArray(requiredPermission)) {
                const hasPermission = requiredPermission.some((permission) => {
                    const modulePrefix = permission.split(':')[0];
                    return (
                        userPermissions.includes(permission) ||
                        userPermissions.includes(`${modulePrefix}:all`)
                    );
                });

                if (hasPermission) {
                    return next();
                }
            } else {
                // Check for specific permission or module-level "all" permission
                const modulePrefix = requiredPermission.split(':')[0];
                if (
                    userPermissions.includes(requiredPermission) ||
                    userPermissions.includes(`${modulePrefix}:all`)
                ) {
                    return next();
                }
            }

            return res
                .status(403)
                .json({ message: "You don't have permission to access this module" });
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({ message: 'Permission check failed' });
        }
    };
};
