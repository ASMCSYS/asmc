// Permission constants for better maintainability
export const PERMISSIONS = {
    DASHBOARD: {
        MEMBERS_COUNT: 'dashboard:members_count',
        AMOUNTS_COUNT: 'dashboard:amounts_count',
        BOOKINGS_COUNT: 'dashboard:bookings_count',
        ALL: 'dashboard:all',
    },
    USER: {
        READ: 'user:read',
    },
    MEMBERS: {
        CREATE: 'members:create',
        READ: 'members:read',
        UPDATE: 'members:update',
        DELETE: 'members:delete',
        CONVERT_TO_USER: 'members:convert_to_user',
        GENERATE_CARD: 'members:generate_card',
        EXPORT_DATA: 'members:export_data',
        ALL: 'members:all',
    },
    STAFF: {
        CREATE: 'staff:create',
        READ: 'staff:read',
        UPDATE: 'staff:update',
        DELETE: 'staff:delete',
        ALL: 'staff:all',
    },
    PAYMENT_MANAGER: {
        READ: 'payment_manager:read',
    },
    COMMON_MASTER: {
        BANNER: {
            READ: 'banner_master:read',
            CREATE: 'banner_master:create',
            UPDATE: 'banner_master:update',
            DELETE: 'banner_master:delete',
            ALL: 'banner_master:all',
        },
        LOCATION: {
            READ: 'location_master:read',
            CREATE: 'location_master:create',
            UPDATE: 'location_master:update',
            DELETE: 'location_master:delete',
            ALL: 'location_master:all',
        },
        CATEGORY: {
            READ: 'category_master:read',
            CREATE: 'category_master:create',
            UPDATE: 'category_master:update',
            DELETE: 'category_master:delete',
            ALL: 'category_master:all',
        },
        PHOTO_GALLERY: {
            READ: 'photo_gallery_master:read',
            CREATE: 'photo_gallery_master:create',
            UPDATE: 'photo_gallery_master:update',
            DELETE: 'photo_gallery_master:delete',
            ALL: 'photo_gallery_master:all',
        },
        VIDEO_GALLERY: {
            READ: 'video_gallery_master:read',
            CREATE: 'video_gallery_master:create',
            UPDATE: 'video_gallery_master:update',
            DELETE: 'video_gallery_master:delete',
            ALL: 'video_gallery_master:all',
        },
        PLANS: {
            READ: 'plan_master:read',
            CREATE: 'plan_master:create',
            UPDATE: 'plan_master:update',
            DELETE: 'plan_master:delete',
            ALL: 'plan_master:all',
        },
    },
    ADVANCE_MASTER: {
        ACTIVITY: {
            READ: 'activity_master:read',
            CREATE: 'activity_master:create',
            UPDATE: 'activity_master:update',
            DELETE: 'activity_master:delete',
            ALL: 'activity_master:all',
        },
        BATCH: {
            READ: 'batch_master:read',
            CREATE: 'batch_master:create',
            UPDATE: 'batch_master:update',
            DELETE: 'batch_master:delete',
            ALL: 'batch_master:all',
        },
        EVENT: {
            READ: 'event_master:read',
            CREATE: 'event_master:create',
            UPDATE: 'event_master:update',
            DELETE: 'event_master:delete',
            ALL: 'event_master:all',
        },
        HALL: {
            READ: 'hall_master:read',
            CREATE: 'hall_master:create',
            UPDATE: 'hall_master:update',
            DELETE: 'hall_master:delete',
            ALL: 'hall_master:all',
        },
    },
    ORDERS: {
        ENROLL_ACTIVITY: {
            READ: 'enroll_activity:read',
            CREATE: 'enroll_activity:create',
            UPDATE: 'enroll_activity:update',
            DELETE: 'enroll_activity:delete',
            EXPORT_DATA: 'enroll_activity:export_data',
            ALL: 'enroll_activity:all',
        },
        BOOKING: {
            READ: 'booking_manager:read',
            CREATE: 'booking_manager:create',
            UPDATE: 'booking_manager:update',
            DELETE: 'booking_manager:delete',
            ALL: 'booking_manager:all',
        },
        EVENT_BOOKING: {
            READ: 'event_booking:read',
            CREATE: 'event_booking:create',
            UPDATE: 'event_booking:update',
            DELETE: 'event_booking:delete',
            ALL: 'event_booking:all',
        },
        HALL_BOOKING: {
            READ: 'hall_booking:read',
            CREATE: 'hall_booking:create',
            UPDATE: 'hall_booking:update',
            DELETE: 'hall_booking:delete',
            ALL: 'hall_booking:all',
        },
    },
    CONTACT_LEADS: {
        READ: 'contact_lead:read',
    },
    CMS: {
        FAQ: {
            READ: 'faq_master:read',
            CREATE: 'faq_master:create',
            UPDATE: 'faq_master:update',
            DELETE: 'faq_master:delete',
            ALL: 'faq_master:all',
        },
        TESTIMONIAL: {
            READ: 'testimonial_master:read',
            CREATE: 'testimonial_master:create',
            UPDATE: 'testimonial_master:update',
            DELETE: 'testimonial_master:delete',
            ALL: 'testimonial_master:all',
        },
        TEAM: {
            READ: 'team_manager:read',
            CREATE: 'team_manager:create',
            UPDATE: 'team_manager:update',
            DELETE: 'team_manager:delete',
            ALL: 'team_manager:all',
        },
        HOME_PAGE: {
            READ: 'home_page:read',
            UPDATE: 'home_page:update',
        },
        ABOUT_US: {
            READ: 'about_us:read',
            UPDATE: 'about_us:update',
        },
    },
    REPORTS: {
        MEMBERS: {
            READ: 'members_report:read',
            EXPORT_DATA: 'members_report:export_data',
            ALL: 'members_report:all',
        },
        ENROLL_ACTIVITY: {
            READ: 'enroll_activity_report:read',
            EXPORT_DATA: 'enroll_activity_report:export_data',
            ALL: 'enroll_activity_report:all',
        },
        BATCH: {
            READ: 'batch_report:read',
            EXPORT_DATA: 'batch_report:export_data',
            ALL: 'batch_report:all',
        },
        RENEWAL: {
            READ: 'renewal_report:read',
            EXPORT_DATA: 'renewal_report:export_data',
            ALL: 'renewal_report:all',
        },
        PAYMENT: {
            READ: 'payment_report:read',
            EXPORT_DATA: 'payment_report:export_data',
            ALL: 'payment_report:all',
        },
        HALL: {
            READ: 'hall_report:read',
            EXPORT_DATA: 'hall_report:export_data',
            ALL: 'hall_report:all',
        },
        EVENT: {
            READ: 'event_report:read',
            EXPORT_DATA: 'event_report:export_data',
            ALL: 'event_report:all',
        },
    },
    NOTICE: {
        READ: 'notice:read',
        CREATE: 'notice:create',
        UPDATE: 'notice:update',
        DELETE: 'notice:delete',
        ALL: 'notice:all',
    },
    SETTINGS: {
        READ: 'settings:read',
        UPDATE: 'settings:update',
        ALL: 'settings:all',
    },
    LOGS: {
        READ: 'logs:read',
        EXPORT: 'logs:export',
        ALL: 'logs:all',
    },
    BIOMETRIC: {
        MACHINE: {
            READ: 'biometric_machine:read',
            CREATE: 'biometric_machine:create',
            UPDATE: 'biometric_machine:update',
            DELETE: 'biometric_machine:delete',
            SYNC: 'biometric_machine:sync',
            ALL: 'biometric_machine:all',
        },
        ATTENDANCE: {
            READ: 'biometric_attendance:read',
            CREATE: 'biometric_attendance:create',
            UPDATE: 'biometric_attendance:update',
            DELETE: 'biometric_attendance:delete',
            SYNC: 'biometric_attendance:sync',
            EXPORT: 'biometric_attendance:export',
            ALL: 'biometric_attendance:all',
        },
        NOTIFICATION: {
            READ: 'biometric_notification:read',
            CREATE: 'biometric_notification:create',
            UPDATE: 'biometric_notification:update',
            DELETE: 'biometric_notification:delete',
            ALL: 'biometric_notification:all',
        },
        REGULARIZATION: {
            READ: 'biometric_regularization:read',
            CREATE: 'biometric_regularization:create',
            UPDATE: 'biometric_regularization:update',
            DELETE: 'biometric_regularization:delete',
            APPROVE: 'biometric_regularization:approve',
            REJECT: 'biometric_regularization:reject',
            ALL: 'biometric_regularization:all',
        },
    },
};

// Route-specific permission exports for easy import in route files
export const AUTH_PERMISSIONS = {
    USER_LIST: PERMISSIONS.USER.READ,
};

export const MEMBERS_PERMISSIONS = {
    CREATE: PERMISSIONS.MEMBERS.CREATE,
    READ: PERMISSIONS.MEMBERS.READ,
    UPDATE: PERMISSIONS.MEMBERS.UPDATE,
    DELETE: PERMISSIONS.MEMBERS.DELETE,
    CONVERT_TO_USER: PERMISSIONS.MEMBERS.CONVERT_TO_USER,
    GENERATE_CARD: PERMISSIONS.MEMBERS.GENERATE_CARD,
    EXPORT_DATA: PERMISSIONS.MEMBERS.EXPORT_DATA,
    ALL: PERMISSIONS.MEMBERS.ALL,
};

export const ACTIVITY_PERMISSIONS = {
    CREATE: PERMISSIONS.ADVANCE_MASTER.ACTIVITY.CREATE,
    READ: PERMISSIONS.ADVANCE_MASTER.ACTIVITY.READ,
    UPDATE: PERMISSIONS.ADVANCE_MASTER.ACTIVITY.UPDATE,
    DELETE: PERMISSIONS.ADVANCE_MASTER.ACTIVITY.DELETE,
    ALL: PERMISSIONS.ADVANCE_MASTER.ACTIVITY.ALL,
};

export const BOOKINGS_PERMISSIONS = {
    CREATE: PERMISSIONS.ORDERS.ENROLL_ACTIVITY.CREATE,
    READ: PERMISSIONS.ORDERS.ENROLL_ACTIVITY.READ,
    UPDATE: PERMISSIONS.ORDERS.ENROLL_ACTIVITY.UPDATE,
    DELETE: PERMISSIONS.ORDERS.ENROLL_ACTIVITY.DELETE,
    EXPORT_DATA: PERMISSIONS.ORDERS.ENROLL_ACTIVITY.EXPORT_DATA,
    ALL: PERMISSIONS.ORDERS.ENROLL_ACTIVITY.ALL,
};

export const PLANS_PERMISSIONS = {
    CREATE: PERMISSIONS.COMMON_MASTER.PLANS.CREATE,
    READ: PERMISSIONS.COMMON_MASTER.PLANS.READ,
    UPDATE: PERMISSIONS.COMMON_MASTER.PLANS.UPDATE,
    DELETE: PERMISSIONS.COMMON_MASTER.PLANS.DELETE,
    ALL: PERMISSIONS.COMMON_MASTER.PLANS.ALL,
};

export const COMMON_PERMISSIONS = {
    BANNER: {
        CREATE: PERMISSIONS.COMMON_MASTER.BANNER.CREATE,
        READ: PERMISSIONS.COMMON_MASTER.BANNER.READ,
        UPDATE: PERMISSIONS.COMMON_MASTER.BANNER.UPDATE,
        DELETE: PERMISSIONS.COMMON_MASTER.BANNER.DELETE,
        ALL: PERMISSIONS.COMMON_MASTER.BANNER.ALL,
    },
    LOCATION: {
        CREATE: PERMISSIONS.COMMON_MASTER.LOCATION.CREATE,
        READ: PERMISSIONS.COMMON_MASTER.LOCATION.READ,
        UPDATE: PERMISSIONS.COMMON_MASTER.LOCATION.UPDATE,
        DELETE: PERMISSIONS.COMMON_MASTER.LOCATION.DELETE,
        ALL: PERMISSIONS.COMMON_MASTER.LOCATION.ALL,
    },
    CATEGORY: {
        CREATE: PERMISSIONS.COMMON_MASTER.CATEGORY.CREATE,
        READ: PERMISSIONS.COMMON_MASTER.CATEGORY.READ,
        UPDATE: PERMISSIONS.COMMON_MASTER.CATEGORY.UPDATE,
        DELETE: PERMISSIONS.COMMON_MASTER.CATEGORY.DELETE,
        ALL: PERMISSIONS.COMMON_MASTER.CATEGORY.ALL,
    },
    PHOTO_GALLERY: {
        CREATE: PERMISSIONS.COMMON_MASTER.PHOTO_GALLERY.CREATE,
        READ: PERMISSIONS.COMMON_MASTER.PHOTO_GALLERY.READ,
        UPDATE: PERMISSIONS.COMMON_MASTER.PHOTO_GALLERY.UPDATE,
        DELETE: PERMISSIONS.COMMON_MASTER.PHOTO_GALLERY.DELETE,
        ALL: PERMISSIONS.COMMON_MASTER.PHOTO_GALLERY.ALL,
    },
    VIDEO_GALLERY: {
        CREATE: PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY.CREATE,
        READ: PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY.READ,
        UPDATE: PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY.UPDATE,
        DELETE: PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY.DELETE,
        ALL: PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY.ALL,
    },
};

export const MASTERS_PERMISSIONS = {
    ACTIVITY: ACTIVITY_PERMISSIONS,
    BATCH: {
        CREATE: PERMISSIONS.ADVANCE_MASTER.BATCH.CREATE,
        READ: PERMISSIONS.ADVANCE_MASTER.BATCH.READ,
        UPDATE: PERMISSIONS.ADVANCE_MASTER.BATCH.UPDATE,
        DELETE: PERMISSIONS.ADVANCE_MASTER.BATCH.DELETE,
        ALL: PERMISSIONS.ADVANCE_MASTER.BATCH.ALL,
    },
    EVENT: {
        CREATE: PERMISSIONS.ADVANCE_MASTER.EVENT.CREATE,
        READ: PERMISSIONS.ADVANCE_MASTER.EVENT.READ,
        UPDATE: PERMISSIONS.ADVANCE_MASTER.EVENT.UPDATE,
        DELETE: PERMISSIONS.ADVANCE_MASTER.EVENT.DELETE,
        ALL: PERMISSIONS.ADVANCE_MASTER.EVENT.ALL,
    },
    HALL: {
        CREATE: PERMISSIONS.ADVANCE_MASTER.HALL.CREATE,
        READ: PERMISSIONS.ADVANCE_MASTER.HALL.READ,
        UPDATE: PERMISSIONS.ADVANCE_MASTER.HALL.UPDATE,
        DELETE: PERMISSIONS.ADVANCE_MASTER.HALL.DELETE,
        ALL: PERMISSIONS.ADVANCE_MASTER.HALL.ALL,
    },
};

export const CMS_PERMISSIONS = {
    TEAM: {
        CREATE: PERMISSIONS.CMS.TEAM.CREATE,
        READ: PERMISSIONS.CMS.TEAM.READ,
        UPDATE: PERMISSIONS.CMS.TEAM.UPDATE,
        DELETE: PERMISSIONS.CMS.TEAM.DELETE,
        ALL: PERMISSIONS.CMS.TEAM.ALL,
    },
    FAQ: {
        CREATE: PERMISSIONS.CMS.FAQ.CREATE,
        READ: PERMISSIONS.CMS.FAQ.READ,
        UPDATE: PERMISSIONS.CMS.FAQ.UPDATE,
        DELETE: PERMISSIONS.CMS.FAQ.DELETE,
        ALL: PERMISSIONS.CMS.FAQ.ALL,
    },
    TESTIMONIAL: {
        CREATE: PERMISSIONS.CMS.TESTIMONIAL.CREATE,
        READ: PERMISSIONS.CMS.TESTIMONIAL.READ,
        UPDATE: PERMISSIONS.CMS.TESTIMONIAL.UPDATE,
        DELETE: PERMISSIONS.CMS.TESTIMONIAL.DELETE,
        ALL: PERMISSIONS.CMS.TESTIMONIAL.ALL,
    },
    HOME_PAGE: {
        READ: PERMISSIONS.CMS.HOME_PAGE.READ,
        UPDATE: PERMISSIONS.CMS.HOME_PAGE.UPDATE,
    },
    ABOUT_US: {
        READ: PERMISSIONS.CMS.ABOUT_US.READ,
        UPDATE: PERMISSIONS.CMS.ABOUT_US.UPDATE,
    },
    NOTICE: {
        READ: PERMISSIONS.NOTICE.READ,
        CREATE: PERMISSIONS.NOTICE.CREATE,
        UPDATE: PERMISSIONS.NOTICE.UPDATE,
        DELETE: PERMISSIONS.NOTICE.DELETE,
        ALL: PERMISSIONS.NOTICE.ALL,
    },
    SETTINGS: {
        READ: PERMISSIONS.SETTINGS.READ,
        UPDATE: PERMISSIONS.SETTINGS.UPDATE,
    },
};

export const PAYMENT_PERMISSIONS = {
    READ: PERMISSIONS.PAYMENT_MANAGER.READ,
};

export const EVENTS_PERMISSIONS = {
    CREATE: PERMISSIONS.ORDERS.EVENT_BOOKING.CREATE,
    READ: PERMISSIONS.ORDERS.EVENT_BOOKING.READ,
    UPDATE: PERMISSIONS.ORDERS.EVENT_BOOKING.UPDATE,
    DELETE: PERMISSIONS.ORDERS.EVENT_BOOKING.DELETE,
    ALL: PERMISSIONS.ORDERS.EVENT_BOOKING.ALL,
};

export const REPORTS_PERMISSIONS = {
    MEMBERS: {
        READ: PERMISSIONS.REPORTS.MEMBERS.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.MEMBERS.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.MEMBERS.ALL,
    },
    ENROLL_ACTIVITY: {
        READ: PERMISSIONS.REPORTS.ENROLL_ACTIVITY.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.ENROLL_ACTIVITY.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.ENROLL_ACTIVITY.ALL,
    },
    BATCH: {
        READ: PERMISSIONS.REPORTS.BATCH.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.BATCH.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.BATCH.ALL,
    },
    RENEWAL: {
        READ: PERMISSIONS.REPORTS.RENEWAL.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.RENEWAL.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.RENEWAL.ALL,
    },
    PAYMENT: {
        READ: PERMISSIONS.REPORTS.PAYMENT.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.PAYMENT.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.PAYMENT.ALL,
    },
    HALL: {
        READ: PERMISSIONS.REPORTS.HALL.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.HALL.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.HALL.ALL,
    },
    EVENT: {
        READ: PERMISSIONS.REPORTS.EVENT.READ,
        EXPORT_DATA: PERMISSIONS.REPORTS.EVENT.EXPORT_DATA,
        ALL: PERMISSIONS.REPORTS.EVENT.ALL,
    },
};

export const HALLS_PERMISSIONS = {
    CREATE: PERMISSIONS.ORDERS.HALL_BOOKING.CREATE,
    READ: PERMISSIONS.ORDERS.HALL_BOOKING.READ,
    UPDATE: PERMISSIONS.ORDERS.HALL_BOOKING.UPDATE,
    DELETE: PERMISSIONS.ORDERS.HALL_BOOKING.DELETE,
    ALL: PERMISSIONS.ORDERS.HALL_BOOKING.ALL,
};

export const STAFF_PERMISSIONS = {
    CREATE: PERMISSIONS.STAFF.CREATE,
    READ: PERMISSIONS.STAFF.READ,
    UPDATE: PERMISSIONS.STAFF.UPDATE,
    DELETE: PERMISSIONS.STAFF.DELETE,
    ALL: PERMISSIONS.STAFF.ALL,
};

export const LOGS_PERMISSIONS = {
    READ: PERMISSIONS.LOGS.READ,
    EXPORT: PERMISSIONS.LOGS.EXPORT,
    ALL: PERMISSIONS.LOGS.ALL,
};

export const BIOMETRIC_MACHINE_PERMISSIONS = {
    CREATE: PERMISSIONS.BIOMETRIC.MACHINE.CREATE,
    READ: PERMISSIONS.BIOMETRIC.MACHINE.READ,
    UPDATE: PERMISSIONS.BIOMETRIC.MACHINE.UPDATE,
    DELETE: PERMISSIONS.BIOMETRIC.MACHINE.DELETE,
    SYNC: PERMISSIONS.BIOMETRIC.MACHINE.SYNC,
    ALL: PERMISSIONS.BIOMETRIC.MACHINE.ALL,
};

export const BIOMETRIC_ATTENDANCE_PERMISSIONS = {
    CREATE: PERMISSIONS.BIOMETRIC.ATTENDANCE.CREATE,
    READ: PERMISSIONS.BIOMETRIC.ATTENDANCE.READ,
    UPDATE: PERMISSIONS.BIOMETRIC.ATTENDANCE.UPDATE,
    DELETE: PERMISSIONS.BIOMETRIC.ATTENDANCE.DELETE,
    SYNC: PERMISSIONS.BIOMETRIC.ATTENDANCE.SYNC,
    EXPORT: PERMISSIONS.BIOMETRIC.ATTENDANCE.EXPORT,
    ALL: PERMISSIONS.BIOMETRIC.ATTENDANCE.ALL,
};

export const BIOMETRIC_NOTIFICATION_PERMISSIONS = {
    CREATE: PERMISSIONS.BIOMETRIC.NOTIFICATION.CREATE,
    READ: PERMISSIONS.BIOMETRIC.NOTIFICATION.READ,
    UPDATE: PERMISSIONS.BIOMETRIC.NOTIFICATION.UPDATE,
    DELETE: PERMISSIONS.BIOMETRIC.NOTIFICATION.DELETE,
    ALL: PERMISSIONS.BIOMETRIC.NOTIFICATION.ALL,
};

export const BIOMETRIC_REGULARIZATION_PERMISSIONS = {
    CREATE: PERMISSIONS.BIOMETRIC.REGULARIZATION.CREATE,
    READ: PERMISSIONS.BIOMETRIC.REGULARIZATION.READ,
    UPDATE: PERMISSIONS.BIOMETRIC.REGULARIZATION.UPDATE,
    DELETE: PERMISSIONS.BIOMETRIC.REGULARIZATION.DELETE,
    APPROVE: PERMISSIONS.BIOMETRIC.REGULARIZATION.APPROVE,
    REJECT: PERMISSIONS.BIOMETRIC.REGULARIZATION.REJECT,
    ALL: PERMISSIONS.BIOMETRIC.REGULARIZATION.ALL,
};

export const DashboardPermission = Object.values(PERMISSIONS.DASHBOARD);
export const UserPermission = Object.values(PERMISSIONS.USER);
export const MemberPermission = Object.values(PERMISSIONS.MEMBERS);
export const StaffPermission = Object.values(PERMISSIONS.STAFF);
export const PaymentManagerPermission = Object.values(PERMISSIONS.PAYMENT_MANAGER);
export const CommonMasterPermission = [
    ...Object.values(PERMISSIONS.COMMON_MASTER.BANNER),
    ...Object.values(PERMISSIONS.COMMON_MASTER.LOCATION),
    ...Object.values(PERMISSIONS.COMMON_MASTER.CATEGORY),
    ...Object.values(PERMISSIONS.COMMON_MASTER.PHOTO_GALLERY),
    ...Object.values(PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY),
    ...Object.values(PERMISSIONS.COMMON_MASTER.PLANS),
];
export const AdvanceMasterPermission = [
    ...Object.values(PERMISSIONS.ADVANCE_MASTER.ACTIVITY),
    ...Object.values(PERMISSIONS.ADVANCE_MASTER.BATCH),
    ...Object.values(PERMISSIONS.ADVANCE_MASTER.EVENT),
    ...Object.values(PERMISSIONS.ADVANCE_MASTER.HALL),
];
export const OrderPermission = [
    ...Object.values(PERMISSIONS.ORDERS.ENROLL_ACTIVITY),
    ...Object.values(PERMISSIONS.ORDERS.BOOKING),
    ...Object.values(PERMISSIONS.ORDERS.EVENT_BOOKING),
    ...Object.values(PERMISSIONS.ORDERS.HALL_BOOKING),
];
export const ContactLeadsPermission = Object.values(PERMISSIONS.CONTACT_LEADS);
export const CMSPermission = [
    ...Object.values(PERMISSIONS.CMS.FAQ),
    ...Object.values(PERMISSIONS.CMS.TESTIMONIAL),
    ...Object.values(PERMISSIONS.CMS.TEAM),
    ...Object.values(PERMISSIONS.CMS.HOME_PAGE),
    ...Object.values(PERMISSIONS.CMS.ABOUT_US),
];
export const ReportsPermission = [
    ...Object.values(PERMISSIONS.REPORTS.MEMBERS),
    ...Object.values(PERMISSIONS.REPORTS.ENROLL_ACTIVITY),
    ...Object.values(PERMISSIONS.REPORTS.BATCH),
    ...Object.values(PERMISSIONS.REPORTS.RENEWAL),
    ...Object.values(PERMISSIONS.REPORTS.PAYMENT),
    ...Object.values(PERMISSIONS.REPORTS.HALL),
    ...Object.values(PERMISSIONS.REPORTS.EVENT),
];
export const NoticePermission = Object.values(PERMISSIONS.NOTICE);
export const SettingsPermission = Object.values(PERMISSIONS.SETTINGS);
export const LogsPermission = Object.values(PERMISSIONS.LOGS);
export const BiometricMachinePermission = Object.values(PERMISSIONS.BIOMETRIC.MACHINE);
export const BiometricAttendancePermission = Object.values(
    PERMISSIONS.BIOMETRIC.ATTENDANCE,
);
export const BiometricNotificationPermission = Object.values(
    PERMISSIONS.BIOMETRIC.NOTIFICATION,
);
export const BiometricRegularizationPermission = Object.values(
    PERMISSIONS.BIOMETRIC.REGULARIZATION,
);

export const PERMISSION_GROUPS = [
    {
        label: 'Dashboard',
        permissions: DashboardPermission,
    },
    {
        label: 'Users',
        permissions: UserPermission,
    },
    {
        label: 'Members',
        permissions: MemberPermission,
    },
    {
        label: 'Staff',
        permissions: StaffPermission,
    },
    {
        label: 'Payment Manager',
        permissions: PaymentManagerPermission,
    },
    {
        label: 'Common Master',
        permissions: CommonMasterPermission,
    },
    {
        label: 'Advance Master',
        permissions: AdvanceMasterPermission,
    },
    {
        label: 'Order',
        permissions: OrderPermission,
    },
    {
        label: 'Contact Leads',
        permissions: ContactLeadsPermission,
    },
    {
        label: 'CMS',
        permissions: CMSPermission,
    },
    {
        label: 'Reports',
        permissions: ReportsPermission,
    },
    {
        label: 'Notice',
        permissions: NoticePermission,
    },
    {
        label: 'Settings',
        permissions: SettingsPermission,
    },
    {
        label: 'Logs',
        permissions: LogsPermission,
    },
    {
        label: 'Biometric Machines',
        permissions: BiometricMachinePermission,
    },
    {
        label: 'Biometric Attendance',
        permissions: BiometricAttendancePermission,
    },
    {
        label: 'Biometric Notifications',
        permissions: BiometricNotificationPermission,
    },
    {
        label: 'Biometric Regularization',
        permissions: BiometricRegularizationPermission,
    },
];
