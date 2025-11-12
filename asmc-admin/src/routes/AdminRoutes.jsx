import { Routes, Route } from "react-router-dom";
import DashboardView from "../pages/admin/Dashboard";
import UserManager from "../pages/admin/UserManager";
import MembersManager from "../pages/admin/MembersManager";
import StaffManager from "../pages/admin/StaffManager";
import PaymentManager from "../pages/admin/PaymentManager";

// common masters
import LocationManager from "../pages/admin/LocationManager";
import CategoryManager from "../pages/admin/CategoryManager";
import TeamsManager from "../pages/admin/TeamsManager";
import PhotoGalleryMaster from "../pages/admin/PhotoGalleryMaster";
import VideoGalleryMaster from "../pages/admin/VideoGalleryMaster";
import BannerMaster from "../pages/admin/BannerMaster";
import PlansMaster from "../pages/admin/PlansMaster";

// advance masters
import FacilityManager from "../pages/admin/FacilityManager";
import ActivityManager from "../pages/admin/ActivityManager";
import BatchManager from "../pages/admin/BatchManager";
import EventManager from "../pages/admin/EventManager";
import HallManager from "../pages/admin/HallManager";
import FeesCategories from "../pages/admin/FeesCategories";

// bookings
import EnrollActivityManager from "../pages/admin/EnrollActivityManager";
import BookingManager from "../pages/admin/BookingManager";
import EventBookings from "../pages/admin/EventBookings";
import HallBookings from "../pages/admin/HallBookings";

// leads
import ContactLeads from "../pages/admin/ContactLeadsContainer";

// CMS Routes
import Faqs from "../pages/admin/Faqs";
import Testimonials from "../pages/admin/Testimonials";
import HomePageCms from "../pages/admin/HomePageCms";
import AboutPageCms from "../pages/admin/AboutPageCms";

import DatabaseBackup from "../pages/admin/DatabaseBackup";
import SettingsDefault from "../pages/admin/SettingsDefault";
import ProfileEdit from "../pages/admin/ProfileEdit";

// Reports Routes
import Reports from "../pages/admin/Reports";
import Notices from "../pages/admin/Notices";
import Logs from "../pages/admin/Logs";

// Biometric Routes
import BiometricMachineManager from "../pages/admin/BiometricMachineManager";
import BiometricAttendanceLogs from "../pages/admin/BiometricAttendanceLogs";
import BiometricStaffManager from "../pages/admin/BiometricStaffManager";

// Documentation Routes
import DocumentationManager from "../pages/admin/DocumentationManager";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/user-manager" element={<UserManager />} />
            <Route path="/members-manager" element={<MembersManager />} />
            <Route path="/staff-manager" element={<StaffManager />} />
            <Route path="/payment-manager" element={<PaymentManager />} />

            {/* Common Masters */}
            <Route path="/location-manager" element={<LocationManager />} />
            <Route path="/category-manager" element={<CategoryManager />} />
            <Route path="/teams-manager" element={<TeamsManager />} />
            <Route path="/photo-gallery-master" element={<PhotoGalleryMaster />} />
            <Route path="/video-gallery-master" element={<VideoGalleryMaster />} />
            <Route path="/banner-master" element={<BannerMaster />} />
            <Route path="/plans-master" element={<PlansMaster />} />

            {/* Advance Masters */}
            <Route path="/facility-manager" element={<FacilityManager />} />
            <Route path="/activity-master" element={<ActivityManager />} />
            <Route path="/batch-master" element={<BatchManager />} />

            <Route path="/event-manager" element={<EventManager />} />
            <Route path="/halls-manager" element={<HallManager />} />
            <Route path="/fees-categories" element={<FeesCategories />} />

            {/* bookings */}
            <Route path="/enroll-activity" element={<EnrollActivityManager />} />
            <Route path="/bookings-manager" element={<BookingManager />} />
            <Route path="/event-bookings" element={<EventBookings />} />
            <Route path="/hall-bookings" element={<HallBookings />} />

            <Route path="/contact-leads" element={<ContactLeads />} />
            <Route path="/notice" element={<Notices />} />

            {/* CMS Routes */}
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/home-page" element={<HomePageCms />} />
            <Route path="/about-page" element={<AboutPageCms />} />

            <Route path="/database-backup" element={<DatabaseBackup />} />
            <Route path="/settings-default" element={<SettingsDefault />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />

            {/* Reports Routes */}
            <Route path="/members-reports" element={<Reports type="members" />} />
            <Route path="/enrollment-reports" element={<Reports type="enrollment" />} />
            <Route path="/batch-wise-reports" element={<Reports type="batch-wise" />} />
            <Route path="/renewal-reports" element={<Reports type="renewal" />} />
            <Route path="/payment-summary-reports" element={<Reports type="payment-summary" />} />
            <Route path="/event-bookings-reports" element={<Reports type="event-bookings" />} />
            <Route path="/hall-bookings-reports" element={<Reports type="hall-bookings" />} />
            <Route path="/logs" element={<Logs />} />

            {/* Biometric Routes */}
            <Route path="/biometric-machines" element={<BiometricMachineManager />} />
            <Route path="/biometric-attendance" element={<BiometricAttendanceLogs />} />
            <Route path="/biometric-staff" element={<BiometricStaffManager />} />

            {/* Documentation Routes */}
            <Route path="/documentation" element={<DocumentationManager />} />
        </Routes>
    );
};

export default AdminRoutes;
