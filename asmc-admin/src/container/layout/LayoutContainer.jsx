import React from "react";
import BaseLayout from "../../components/layout/BaseLayout";
import AdminRoutes from "../../routes/AdminRoutes";
import HomeIcon from "@mui/icons-material/Home";
import UserIcon from "@mui/icons-material/Person2Outlined";
import MembersIcon from "@mui/icons-material/Groups3";
import RupeeIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import SportsIcon from "@mui/icons-material/Sports";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CategoryIcon from "@mui/icons-material/Category";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import GradingIcon from "@mui/icons-material/Grading";
import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import QuizIcon from "@mui/icons-material/Quiz";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InsertPageBreakIcon from "@mui/icons-material/InsertPageBreak";
import BackupIcon from "@mui/icons-material/Backup";
import ChaletIcon from "@mui/icons-material/Chalet";
import { isAuth } from "../../helpers/cookies";
import {
    DashboardPermission,
    UserPermission,
    MemberPermission,
    StaffPermission,
    PaymentManagerPermission,
    CommonMasterPermission,
    AdvanceMasterPermission,
    OrderPermission,
    ContactLeadsPermission,
    CMSPermission,
    ReportsPermission,
    NoticePermission,
    SettingsPermission,
    BiometricMachinePermission,
    BiometricAttendancePermission,
    BiometricStaffPermission,
    DocumentationPermission,
} from "../../helpers/constants";

import { withTheme } from "@emotion/react";
import {
    Assessment,
    Collections,
    Event,
    EventAvailableSharp,
    Feedback,
    HomeMaxOutlined,
    MoneyOffCsredRounded,
    OndemandVideo,
    Person,
    SettingsApplications,
    SettingsCellOutlined,
    ViewCarousel,
    Computer,
    AccessTime,
    People,
    MenuBook,
} from "@mui/icons-material";

const LayoutContainer = (props) => {
    const { permissions = [] } = isAuth();

    // Check if user has full admin access
    const hasFullAccess = permissions.includes("*");

    const hasPermission = (requiredPermissions) => {
        // If user has full access, show everything
        if (hasFullAccess) return true;

        if (!Array.isArray(requiredPermissions)) return false;
        // Check if user has any of the required permissions
        // This includes checking for both specific permissions and "all" permission
        return requiredPermissions.some((permission) => {
            const modulePrefix = permission.split(":")[0];
            const hasAllPermission = permissions.includes(`${modulePrefix}:all`);
            return hasAllPermission || permissions.includes(permission);
        });
    };

    const filterModulesByPermission = (modules) => {
        // If user has full access, return all modules without filtering
        if (hasFullAccess) return modules;

        return modules.filter((module) => {
            // Check if module has any of its required permissions
            if (hasPermission(module.permissions)) {
                // If module has items, filter them as well
                if (module.items) {
                    module.items = module.items.filter((item) => hasPermission(item.permissions));
                    // Only include module if it has items after filtering
                    return module.items.length > 0;
                }
                return true;
            }
            return false;
        });
    };

    const filteredModules = filterModulesByPermission(adminModules);

    return <BaseLayout params={props.params} modules={filteredModules} ChildComponent={AdminRoutes} />;
};

export default withTheme(LayoutContainer);

const adminModules = [
    {
        id: "dashboard",
        title: "Dashboard",
        link: "/dashboard",
        logo: <HomeIcon />,
        permissions: DashboardPermission,
    },
    {
        id: "user-manager",
        title: "User Manager",
        link: "/user-manager",
        logo: <UserIcon />,
        permissions: UserPermission,
    },
    {
        id: "members-manager",
        title: "Member Manager",
        link: "/members-manager",
        logo: <MembersIcon />,
        permissions: MemberPermission,
    },
    {
        id: "staff-manager",
        title: "Staff Manager",
        link: "/staff-manager",
        logo: <Person />,
        permissions: StaffPermission,
    },
    {
        id: "biometric-system",
        title: "Biometric System",
        logo: <Computer />,
        permissions: [...BiometricMachinePermission, ...BiometricAttendancePermission, ...BiometricStaffPermission],
        items: [
            {
                logo: <Computer />,
                id: "biometric-machines",
                title: "Machine Manager",
                link: "/biometric-machines",
                permissions: ["biometric_machine:read", "biometric_machine:all"],
            },
            {
                logo: <AccessTime />,
                id: "biometric-attendance",
                title: "Attendance Logs",
                link: "/biometric-attendance",
                permissions: ["biometric_attendance:read", "biometric_attendance:all"],
            },
            {
                logo: <People />,
                id: "biometric-staff",
                title: "Staff Enrollment",
                link: "/biometric-staff",
                permissions: ["staff:read", "staff:all"],
            },
        ],
    },
    {
        id: "payment-manager",
        title: "Payment Manager",
        link: "/payment-manager",
        logo: <RupeeIcon />,
        permissions: PaymentManagerPermission,
    },
    {
        id: "common-master",
        title: "Common Masters",
        logo: <ViewModuleIcon />,
        permissions: CommonMasterPermission,
        items: [
            {
                logo: <ViewCarousel />,
                id: "banner-master",
                title: "Banner Master",
                link: "/banner-master",
                permissions: ["banner_master:read", "banner_master:all"],
            },
            {
                id: "location-manager",
                title: "Location",
                link: "/location-manager",
                logo: <AddLocationAltIcon />,
                permissions: ["location_master:read", "location_master:all"],
            },
            {
                id: "category-manager",
                title: "Category Manager",
                link: "/category-manager",
                logo: <CategoryIcon />,
                permissions: ["category_master:read", "category_master:all"],
            },
            {
                logo: <Collections />,
                id: "photo-gallery-master",
                title: "Photo Gallery Master",
                link: "/photo-gallery-master",
                permissions: ["photo_gallery_master:read", "photo_gallery_master:all"],
            },
            {
                logo: <OndemandVideo />,
                id: "video-gallery-master",
                title: "Video Gallery Master",
                link: "/video-gallery-master",
                permissions: ["video_gallery_master:read", "video_gallery_master:all"],
            },
            {
                logo: <LocalAtmIcon />,
                id: "plans-master",
                title: "Plans Master",
                link: "/plans-master",
                permissions: ["plan_master:read", "plan_master:all"],
            },
        ],
    },
    {
        id: "advance-master",
        title: "Advance Masters",
        logo: <ViewModuleIcon />,
        permissions: AdvanceMasterPermission,
        items: [
            {
                logo: <SportsIcon />,
                id: "activity-master",
                title: "Activity Manager",
                link: "/activity-master",
                permissions: ["activity_master:read", "activity_master:all"],
            },
            {
                logo: <BatchPredictionIcon />,
                id: "batch-master",
                title: "Batch Manager",
                link: "/batch-master",
                permissions: ["batch_master:read", "batch_master:all"],
            },
            {
                id: "event-manager",
                title: "Event Manager",
                link: "/event-manager",
                logo: <Event />,
                permissions: ["event_master:read", "event_master:all"],
            },
            {
                id: "halls-manager",
                title: "Halls Manager",
                link: "/halls-manager",
                logo: <HomeMaxOutlined />,
                permissions: ["hall_master:read", "hall_master:all"],
            },
        ],
    },
    {
        id: "orders-master",
        title: "Orders",
        logo: <MoneyOffCsredRounded />,
        permissions: OrderPermission,
        items: [
            {
                id: "enroll-activity",
                title: "Enroll Activity",
                link: "/enroll-activity",
                logo: <GradingIcon />,
                permissions: ["enroll_activity:read", "enroll_activity:all"],
            },
            {
                id: "booking-manager",
                title: "Bookings Manager",
                link: "/bookings-manager",
                logo: <GradingIcon />,
                permissions: ["booking_manager:read", "booking_manager:all"],
            },
            {
                id: "event-bookings",
                title: "Event Bookings",
                link: "/event-bookings",
                logo: <EventAvailableSharp />,
                permissions: ["event_booking:read", "event_booking:all"],
            },
            {
                id: "hall-bookings",
                title: "Hall Bookings",
                link: "/hall-bookings",
                logo: <ChaletIcon />,
                permissions: ["hall_booking:read", "hall_booking:all"],
            },
        ],
    },
    {
        id: "contact-leads",
        title: "Contact Leads",
        link: "/contact-leads",
        logo: <Assessment />,
        permissions: ContactLeadsPermission,
    },
    {
        id: "cms",
        title: "CMS",
        logo: <DynamicFeedIcon />,
        permissions: CMSPermission,
        items: [
            {
                logo: <QuizIcon />,
                id: "faqs",
                title: "FAQs",
                link: "/faqs",
                permissions: ["faq_master:read", "faq_master:all"],
            },
            {
                logo: <Feedback />,
                id: "testimonials",
                title: "Testimonials",
                link: "/testimonials",
                permissions: ["testimonial_master:read", "testimonial_master:all"],
            },
            {
                logo: <ManageAccountsIcon />,
                id: "teams-manager",
                title: "Teams Manager",
                link: "/teams-manager",
                permissions: ["team_manager:read", "team_manager:all"],
            },
            {
                logo: <InsertPageBreakIcon />,
                id: "home-page",
                title: "Home Page",
                link: "/home-page",
                permissions: ["home_page:read"],
            },
            {
                logo: <InsertPageBreakIcon />,
                id: "about-page",
                title: "About Page",
                link: "/about-page",
                permissions: ["about_us:read"],
            },
        ],
    },
    {
        id: "reports",
        title: "Reports",
        logo: <DynamicFeedIcon />,
        permissions: ReportsPermission,
        items: [
            {
                logo: <UserIcon />,
                id: "members-reports",
                title: "Members Reports",
                link: "/members-reports",
                permissions: ["members_report:read", "members_report:all"],
            },
            {
                logo: <AssessmentIcon />,
                id: "enrollment-reports",
                title: "Enrollment Reports",
                link: "/enrollment-reports",
                permissions: ["enroll_activity_report:read", "enroll_activity_report:all"],
            },
            {
                logo: <AssessmentIcon />,
                id: "batch-wise-reports",
                title: "Batch Wise Reports",
                link: "/batch-wise-reports",
                permissions: ["batch_report:read", "batch_report:all"],
            },
            {
                logo: <AssessmentIcon />,
                id: "renewal-reports",
                title: "Renewal Reports",
                link: "/renewal-reports",
                permissions: ["renewal_report:read", "renewal_report:all"],
            },
            {
                logo: <RupeeIcon />,
                id: "payment-summary-reports",
                title: "Payment Summary",
                link: "/payment-summary-reports",
                permissions: ["payment_report:read", "payment_report:all"],
            },
            {
                logo: <AssessmentIcon />,
                id: "event-bookings-reports",
                title: "Event Bookings Reports",
                link: "/event-bookings-reports",
                permissions: ["event_report:read", "event_report:all"],
            },
            {
                logo: <AssessmentIcon />,
                id: "hall-bookings-reports",
                title: "Hall Bookings Reports",
                link: "/hall-bookings-reports",
                permissions: ["hall_report:read", "hall_report:all"],
            },
            {
                logo: <AssessmentIcon />,
                id: "logs",
                title: "Logs",
                link: "/logs",
                permissions: ["logs:read", "logs:all"],
            },
        ],
    },
    {
        id: "notice",
        title: "Notices",
        link: "/notice",
        logo: <BatchPredictionIcon />,
        permissions: NoticePermission,
    },
    {
        id: "settings",
        title: "Settings",
        logo: <SettingsApplications />,
        permissions: SettingsPermission,
        items: [
            {
                logo: <BackupIcon />,
                id: "database-backup",
                title: "DB Backup",
                link: "/database-backup",
                permissions: ["settings:read", "settings:all"],
            },
            {
                logo: <SettingsCellOutlined />,
                id: "settings-default",
                title: "Settings Default",
                link: "/settings-default",
                permissions: ["settings:read", "settings:all"],
            },
        ],
    },
    {
        id: "documentation",
        title: "Documentation",
        link: "/documentation",
        logo: <MenuBook />,
        permissions: DocumentationPermission,
    },
];
