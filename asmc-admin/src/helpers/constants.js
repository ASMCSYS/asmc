export const baseUrl = process.env.REACT_APP_API_URL || "https://api.asmcdae.in";

export const loginUrl = "/auth/admin-login";

export const drawerWidth = 60;
export const expandDrawerWidth = 260;

export const fileTypes = ["jpeg", "jpg", "png", "gif"];
export const videoTypes = ["mp4"];

export const defaultPaginate = {
    pageNo: 0,
    limit: 10,
    sortBy: -1,
    sortField: "createdAt",
    keywords: "",
};

export const daysArray = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
];

export const eventSampleContent = `
<h3>Event Overview</h3>
<p>Welcome to the <strong>[Event Name]</strong>! Join us for an unforgettable experience filled with excitement, learning, and connection. This event is designed to cater to enthusiasts of all levels and provides an opportunity to engage with like-minded individuals.</p>

<hr />

<h3>Key Highlights</h3>
<ul>
    <li><strong>Engaging Activities:</strong> Participate in a variety of activities ranging from <em>[Activity 1]</em> to <em>[Activity 2]</em>, designed to keep you entertained and inspired.</li>
    <li><strong>Expert Sessions:</strong> Hear from industry experts, including <em>[Speaker Name(s)]</em>, who will share their knowledge and insights on <em>[Topics of Discussion]</em>.</li>
    <li><strong>Networking Opportunities:</strong> Meet and connect with fellow participants, professionals, and enthusiasts in the <em>[Field/Interest]</em>.</li>
    <li><strong>Exclusive Benefits:</strong> Enjoy access to <em>[Exclusive Perks, e.g., early entry, complimentary goodies, etc.]</em>.</li>
</ul>

<hr />

<h3>Event Schedule</h3>
<p><strong>Day 1:</strong></p>
<ul>
    <li>Registration: 9:00 AM</li>
    <li>Welcome Speech: 10:00 AM</li>
    <li>Session 1: <em>[Topic Name]</em> - 11:00 AM</li>
</ul>
<p><strong>Day 2:</strong></p>
<ul>
    <li>Workshops: <em>[Time Range]</em></li>
    <li>Networking Lunch: <em>[Time]</em></li>
    <li>Closing Remarks: <em>[Time]</em></li>
</ul>
<p><em>Note: A detailed schedule will be provided upon registration.</em></p>

<hr />

<h3>Venue Information</h3>
<p>📍 <strong>Location:</strong> [Venue Name], [Address, City, State]</p>
<p>🗓️ <strong>Date:</strong> [Event Date(s)]</p>
<p>🕒 <strong>Time:</strong> [Start Time] - [End Time]</p>

<hr />

<h3>Participation Guidelines</h3>
<ol>
    <li>Ensure you bring a valid ID for registration.</li>
    <li>Maintain a respectful and collaborative attitude throughout the event.</li>
    <li>Follow the event dress code: <em>[Dress Code]</em>.</li>
    <li>Pre-register for workshops to secure your spot.</li>
</ol>

<hr />

<h3>Contact Us</h3>
<p>For any queries, please contact us at:</p>
<p>📧 <strong>Email:</strong> [Event Email Address]</p>
<p>📞 <strong>Phone:</strong> [Contact Number]</p>

<p>We look forward to welcoming you to the <strong>[Event Name]</strong>!</p>
`;

export const sizeValues = [
    "5X-Small",
    "4X-Small",
    "3X-Small",
    "2X-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "2X-Large",
    "3X-Large",
    "4X-Large",
    "5X-Large",
    "6X-Large",
    "7X-Large",
];

export const PERMISSIONS = {
    DASHBOARD: {
        MEMBERS_COUNT: "dashboard:members_count",
        AMOUNTS_COUNT: "dashboard:amounts_count",
        BOOKINGS_COUNT: "dashboard:bookings_count",
        ALL: "dashboard:all",
    },
    USER: {
        READ: "user:read",
    },
    MEMBERS: {
        CREATE: "members:create",
        READ: "members:read",
        UPDATE: "members:update",
        DELETE: "members:delete",
        CONVERT_TO_USER: "members:convert_to_user",
        GENERATE_CARD: "members:generate_card",
        EXPORT_DATA: "members:export_data",
        ALL: "members:all",
    },
    STAFF: {
        CREATE: "staff:create",
        READ: "staff:read",
        UPDATE: "staff:update",
        DELETE: "staff:delete",
        ALL: "staff:all",
    },
    PAYMENT_MANAGER: {
        READ: "payment_manager:read",
    },
    COMMON_MASTER: {
        BANNER: {
            READ: "banner_master:read",
            CREATE: "banner_master:create",
            UPDATE: "banner_master:update",
            DELETE: "banner_master:delete",
            ALL: "banner_master:all",
        },
        LOCATION: {
            READ: "location_master:read",
            CREATE: "location_master:create",
            UPDATE: "location_master:update",
            DELETE: "location_master:delete",
            ALL: "location_master:all",
        },
        CATEGORY: {
            READ: "category_master:read",
            CREATE: "category_master:create",
            UPDATE: "category_master:update",
            DELETE: "category_master:delete",
            ALL: "category_master:all",
        },
        PHOTO_GALLERY: {
            READ: "photo_gallery_master:read",
            CREATE: "photo_gallery_master:create",
            UPDATE: "photo_gallery_master:update",
            DELETE: "photo_gallery_master:delete",
            ALL: "photo_gallery_master:all",
        },
        VIDEO_GALLERY: {
            READ: "video_gallery_master:read",
            CREATE: "video_gallery_master:create",
            UPDATE: "video_gallery_master:update",
            DELETE: "video_gallery_master:delete",
            ALL: "video_gallery_master:all",
        },
        PLANS: {
            READ: "plan_master:read",
            CREATE: "plan_master:create",
            UPDATE: "plan_master:update",
            DELETE: "plan_master:delete",
            ALL: "plan_master:all",
        },
    },
    ADVANCE_MASTER: {
        ACTIVITY: {
            READ: "activity_master:read",
            CREATE: "activity_master:create",
            UPDATE: "activity_master:update",
            DELETE: "activity_master:delete",
            ALL: "activity_master:all",
        },
        BATCH: {
            READ: "batch_master:read",
            CREATE: "batch_master:create",
            UPDATE: "batch_master:update",
            DELETE: "batch_master:delete",
            ALL: "batch_master:all",
        },
        EVENT: {
            READ: "event_master:read",
            CREATE: "event_master:create",
            UPDATE: "event_master:update",
            DELETE: "event_master:delete",
            ALL: "event_master:all",
        },
        HALL: {
            READ: "hall_master:read",
            CREATE: "hall_master:create",
            UPDATE: "hall_master:update",
            DELETE: "hall_master:delete",
            ALL: "hall_master:all",
        },
    },
    ORDERS: {
        ENROLL_ACTIVITY: {
            READ: "enroll_activity:read",
            CREATE: "enroll_activity:create",
            UPDATE: "enroll_activity:update",
            DELETE: "enroll_activity:delete",
            EXPORT_DATA: "enroll_activity:export_data",
            ALL: "enroll_activity:all",
        },
        BOOKING: {
            READ: "booking_manager:read",
            CREATE: "booking_manager:create",
            UPDATE: "booking_manager:update",
            DELETE: "booking_manager:delete",
            ALL: "booking_manager:all",
        },
        EVENT_BOOKING: {
            READ: "event_booking:read",
            CREATE: "event_booking:create",
            UPDATE: "event_booking:update",
            DELETE: "event_booking:delete",
            ALL: "event_booking:all",
        },
        HALL_BOOKING: {
            READ: "hall_booking:read",
            CREATE: "hall_booking:create",
            UPDATE: "hall_booking:update",
            DELETE: "hall_booking:delete",
            ALL: "hall_booking:all",
        },
    },
    CONTACT_LEADS: {
        READ: "contact_lead:read",
    },
    CMS: {
        FAQ: {
            READ: "faq_master:read",
            CREATE: "faq_master:create",
            UPDATE: "faq_master:update",
            DELETE: "faq_master:delete",
            ALL: "faq_master:all",
        },
        TESTIMONIAL: {
            READ: "testimonial_master:read",
            CREATE: "testimonial_master:create",
            UPDATE: "testimonial_master:update",
            DELETE: "testimonial_master:delete",
            ALL: "testimonial_master:all",
        },
        TEAM: {
            READ: "team_manager:read",
            CREATE: "team_manager:create",
            UPDATE: "team_manager:update",
            DELETE: "team_manager:delete",
            ALL: "team_manager:all",
        },
        HOME_PAGE: {
            READ: "home_page:read",
            UPDATE: "home_page:update",
        },
        ABOUT_US: {
            READ: "about_us:read",
            UPDATE: "about_us:update",
        },
    },
    REPORTS: {
        MEMBERS: {
            READ: "members_report:read",
            EXPORT_DATA: "members_report:export_data",
            ALL: "members_report:all",
        },
        ENROLL_ACTIVITY: {
            READ: "enroll_activity_report:read",
            EXPORT_DATA: "enroll_activity_report:export_data",
            ALL: "enroll_activity_report:all",
        },
        BATCH: {
            READ: "batch_report:read",
            EXPORT_DATA: "batch_report:export_data",
            ALL: "batch_report:all",
        },
        RENEWAL: {
            READ: "renewal_report:read",
            EXPORT_DATA: "renewal_report:export_data",
            ALL: "renewal_report:all",
        },
        PAYMENT: {
            READ: "payment_report:read",
            EXPORT_DATA: "payment_report:export_data",
            ALL: "payment_report:all",
        },
        HALL: {
            READ: "hall_report:read",
            EXPORT_DATA: "hall_report:export_data",
            ALL: "hall_report:all",
        },
        EVENT: {
            READ: "event_report:read",
            EXPORT_DATA: "event_report:export_data",
            ALL: "event_report:all",
        },
    },
    NOTICE: {
        READ: "notice:read",
        CREATE: "notice:create",
        UPDATE: "notice:update",
        DELETE: "notice:delete",
        ALL: "notice:all",
    },
    SETTINGS: {
        READ: "settings:read",
        UPDATE: "settings:update",
        ALL: "settings:all",
    },
    LOGS: {
        READ: "logs:read",
        EXPORT: "logs:export",
        ALL: "logs:all",
    },
    BIOMETRIC: {
        MACHINE: {
            READ: "biometric_machine:read",
            CREATE: "biometric_machine:create",
            UPDATE: "biometric_machine:update",
            DELETE: "biometric_machine:delete",
            SYNC: "biometric_machine:sync",
            ALL: "biometric_machine:all",
        },
        ATTENDANCE: {
            READ: "biometric_attendance:read",
            CREATE: "biometric_attendance:create",
            UPDATE: "biometric_attendance:update",
            DELETE: "biometric_attendance:delete",
            SYNC: "biometric_attendance:sync",
            EXPORT: "biometric_attendance:export",
            ALL: "biometric_attendance:all",
        },
        STAFF: {
            READ: "staff:read",
            CREATE: "staff:create",
            UPDATE: "staff:update",
            DELETE: "staff:delete",
            ALL: "staff:all",
        },
        NOTIFICATION: {
            READ: "biometric_notification:read",
            CREATE: "biometric_notification:create",
            UPDATE: "biometric_notification:update",
            DELETE: "biometric_notification:delete",
            ALL: "biometric_notification:all",
        },
        REGULARIZATION: {
            READ: "biometric_regularization:read",
            CREATE: "biometric_regularization:create",
            UPDATE: "biometric_regularization:update",
            DELETE: "biometric_regularization:delete",
            APPROVE: "biometric_regularization:approve",
            REJECT: "biometric_regularization:reject",
            ALL: "biometric_regularization:all",
        },
    },
    DOCUMENTATION: {
        READ: "documentation:read",
        DOWNLOAD: "documentation:download",
        ALL: "documentation:all",
    },
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
export const BiometricAttendancePermission = Object.values(PERMISSIONS.BIOMETRIC.ATTENDANCE);
export const BiometricStaffPermission = Object.values(PERMISSIONS.BIOMETRIC.STAFF);
export const BiometricNotificationPermission = Object.values(PERMISSIONS.BIOMETRIC.NOTIFICATION);
export const BiometricRegularizationPermission = Object.values(PERMISSIONS.BIOMETRIC.REGULARIZATION);
export const DocumentationPermission = Object.values(PERMISSIONS.DOCUMENTATION);

export const PERMISSION_GROUPS = [
    {
        label: "Dashboard",
        permissions: DashboardPermission,
    },
    {
        label: "Users",
        permissions: UserPermission,
    },
    {
        label: "Members",
        permissions: MemberPermission,
    },
    {
        label: "Staff",
        permissions: StaffPermission,
    },
    {
        label: "Payment Manager",
        permissions: PaymentManagerPermission,
    },
    {
        label: "Common Master",
        permissions: CommonMasterPermission,
    },
    {
        label: "Advance Master",
        permissions: AdvanceMasterPermission,
    },
    {
        label: "Order",
        permissions: OrderPermission,
    },
    {
        label: "Contact Leads",
        permissions: ContactLeadsPermission,
    },
    {
        label: "CMS",
        permissions: CMSPermission,
    },
    {
        label: "Reports",
        permissions: ReportsPermission,
    },
    {
        label: "Notice",
        permissions: NoticePermission,
    },
    {
        label: "Settings",
        permissions: SettingsPermission,
    },
    {
        label: "Logs",
        permissions: LogsPermission,
    },
    {
        label: "Biometric Machines",
        permissions: BiometricMachinePermission,
    },
    {
        label: "Biometric Attendance",
        permissions: BiometricAttendancePermission,
    },
    {
        label: "Biometric Staff",
        permissions: BiometricStaffPermission,
    },
    {
        label: "Biometric Notifications",
        permissions: BiometricNotificationPermission,
    },
    {
        label: "Biometric Regularization",
        permissions: BiometricRegularizationPermission,
    },
    {
        label: "Documentation",
        permissions: DocumentationPermission,
    },
];
