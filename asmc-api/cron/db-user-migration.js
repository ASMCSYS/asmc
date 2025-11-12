import Users from '../app/models/users.js';
import connectDB from '../app/config/db.config.js';

async function main() {
    await connectDB();

    const rolesObj = [
        'staff:create',
        'staff:read',
        'staff:update',
        'staff:delete',
        'staff:permissions',
        'logs:*',
        'reports:*',
        'members:read',
        'members:update',
        'activity:*',
        'events:*',
        'profile:read',
        'profile:update',
        'bookings:create',
        'bookings:read',
        'events:read',
        'activities:read',
        'payments:read',
        'payments:create',
        'staff:*',
        '*', // (for superadmin, means all permissions)
    ];

    const users = await Users.find({ roles: 'admin' });
    for (const user of users) {
        // update the userType to admin
        user.userType = 'admin';
        await user.save();
    }

    // const members = await Users.find({ roles: 'users' });
    // for (const member of members) {
    //     // update the userType to member
    //     member.userType = 'member';
    //     await member.save();
    // }

    console.log('done');
}

main();
