import React, { useEffect, useState } from "react";
import {
    Box,
    Modal,
    Typography,
    IconButton,
    Divider,
    Card,
    CardMedia,
    CardContent,
    Stack,
    Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Example JSON: List of releases (latest first)
const releaseNotesData = [
    {
        version: "1.4.0",
        date: "Released on 03 August 2025",
        highlights: [
            {
                title: "👥 Complete Staff Management System",
                description:
                    "We've implemented a comprehensive staff management system that allows you to manage all staff members, their roles, permissions, and activities. The system includes biometric integration, smart office sync, and conversion capabilities to user accounts.",
                steps: [
                    "👤 **Staff Creation**: Navigate to **Staff Manager** to add new staff members",
                    "📋 **Staff Details**: Fill in complete information including name, designation, department, email, phone, and address",
                    "🔐 **Biometric Setup**: Configure biometric data (thumbprint, device ID) for smart office integration",
                    "🎯 **Permission Assignment**: Assign specific permissions to staff members",
                    "🔄 **Staff Conversion**: Convert staff members to user accounts when needed",
                    "📊 **Staff Listing**: View all staff with filtering, sorting, and search capabilities",
                    "✏️ **Staff Management**: Edit staff details, update permissions, and manage status",
                ],
                note: "This system provides complete control over staff management with role-based access control and seamless integration with existing user systems.",
                screenshots: [],
                tag: "New",
            },

            {
                title: "📊 Comprehensive Activity Logging System",
                description:
                    "We've implemented a robust logging system that tracks all user activities, providing complete audit trails for security, compliance, and monitoring purposes.",
                steps: [
                    "📝 **Automatic Logging**: All user actions are automatically logged with timestamps",
                    "🔍 **Detailed Tracking**: Logs include user ID, staff ID, action type, module, description, and metadata",
                    "🌐 **IP Tracking**: Records IP addresses and user agents for security monitoring",
                    "📋 **Log Management**: Access logs through the admin panel for monitoring and auditing",
                    "🔒 **Security Compliance**: Maintains detailed audit trails for regulatory compliance",
                    "📈 **Activity Analytics**: Monitor user behavior and system usage patterns",
                ],
                note: "The logging system ensures complete transparency and accountability for all system activities, essential for security and compliance requirements.",
                screenshots: [],
                tag: "New",
            },

            {
                title: "🔐 Advanced Permission & Role-Based Access Control",
                description:
                    "We've implemented a sophisticated permission system that provides granular control over user access to different modules and features based on roles and permissions.",
                steps: [
                    "🎭 **Role Management**: Define roles with specific permission sets",
                    "🔑 **Granular Permissions**: Assign permissions at module and action levels (e.g., 'members:create', 'staff:read')",
                    "⚡ **Wildcard Access**: Support for full admin access with '*' permission",
                    "🛡️ **Permission Middleware**: Automatic permission checking on all protected routes",
                    "👥 **User-Specific Permissions**: Override role permissions with user-specific permissions",
                    "🔍 **Permission Components**: Use HasPermission and RequirePermission components for UI control",
                    "📋 **Permission Management**: Easy permission assignment and management through admin interface",
                ],
                note: "This system ensures that users can only access features and data they're authorized to use, providing enhanced security and data protection.",
                screenshots: [],
                tag: "New",
            },

            {
                title: "📋 Enhanced FAQ System with Category Management",
                description:
                    "We've completely revamped the FAQ system to provide better organization and user experience! The new category-based FAQ system allows for dynamic categorization without requiring a separate master table.",
                steps: [
                    "🏷️ **Admin Panel**: Navigate to **FAQ Manager** to add/edit FAQs",
                    "📂 **Category Selection**: Choose from existing categories or create new ones on-the-fly",
                    "➕ **Add New Category**: Select 'Add New Category' option and enter the category name",
                    "💾 **Automatic Organization**: Categories are automatically populated from existing FAQs",
                    "",
                    "🌐 **Frontend Experience**:",
                    "➡️ Visit the **FAQ page** to see the new category-based layout",
                    "🏷️ **Category Tags**: Click on category tags to filter FAQs (similar to Amazon/Flipkart review filters)",
                    "📊 **Smart Grouping**: FAQs are automatically grouped by category with count indicators",
                    "🎨 **Modern UI**: Enhanced design with gradient backgrounds and hover effects",
                ],
                note: "This feature eliminates the need for manual category management while providing a much better user experience for both admins and end users.",
                screenshots: [],
                tag: "New",
            },

            {
                title: "🆕 Member Card Generation Improvements",
                description:
                    "We've significantly improved the member card generation system to handle edge cases and provide a more robust experience. The system now gracefully handles missing profile images and ensures successful card generation in all scenarios.",
                steps: [
                    "🖼️ **Profile Image Handling**: Cards now generate successfully even when profile images are missing",
                    "🔄 **Automatic Fallback**: Missing images are replaced with styled placeholder boxes",
                    "✅ **Error Prevention**: Eliminated DOM manipulation conflicts that could cause generation failures",
                    "🎯 **Reliable Generation**: Both front and back cards generate consistently regardless of image availability",
                    "",
                    "📋 **How to Use**:",
                    "➡️ Go to **Member Manager → Generate Card**",
                    "👤 Select the member (Primary or Secondary)",
                    "🖨️ Choose **Pre-Print** or **Normal Print** mode",
                    "⬇️ Download **Front Card** and **Back Card** images",
                ],
                note: "The card generation now works reliably even when profile images are unavailable or return 404 errors, ensuring you can always generate member cards when needed.",
                screenshots: [],
                tag: "Improved",
            },

            {
                title: "💰 Enhanced Payment Management - Difference Amount Feature",
                description:
                    "We've added a powerful new feature that allows you to add remaining or additional payments to any type of fees. This is particularly useful for handling plan upgrades, manual adjustments, or partial payments.",
                steps: [
                    "👤 Navigate to **Member Manager**",
                    "📋 Select a member and go to **View Payment History**",
                    "➕ Click on **'Add Difference Amount'** button",
                    "💰 Enter the additional amount to be added",
                    "✅ Click **Submit** to update the payment record",
                ],
                note: "This feature helps maintain accurate payment records when there are manual adjustments due to plan changes, upgrades, or other modifications.",
                screenshots: [],
                tag: "New",
            },

            {
                title: "🎯 Enhanced Booking System for Activities",
                description:
                    "We've introduced a comprehensive booking system that supports flexible scheduling with hourly and daily bookings, dynamic pricing for members vs non-members, and multi-day slot management.",
                steps: [
                    "📅 **Batch Creation**: Go to **Batch Manager → Create New Batch**",
                    "⏰ **Slot Configuration**: Add multiple time slots with specific start/end times",
                    "💰 **Pricing Setup**: Set different rates for members and non-members",
                    "📋 **Day Management**: Configure different slots for different days of the week",
                    "🔄 **Quick Copy**: Use 'Copy to Other Days' to duplicate slot structures",
                    "",
                    "📝 **Booking Process**:",
                    "➡️ Navigate to **Booking Manager → Create New Booking**",
                    "📅 Select the desired date and time slot",
                    "👥 Add members and non-members to the booking",
                    "💳 Process payments (online or offline)",
                ],
                note: "This system is perfect for facilities offering classes, events, or rentals with varied schedules and pricing structures.",
                screenshots: [],
                tag: "New",
            },
        ],
    },
    {
        version: "1.3.9",
        date: "Released on 24 June 2025",
        highlights: [
            {
                title: "🆕 Enhanced Booking Functionality for Activities",
                description:
                    "We've introduced a flexible and powerful new booking system! You can now create activity batches that support **hourly and daily bookings**, configure **different slots for each day**, and apply **member vs non-member pricing**. This allows for more dynamic scheduling and better control over capacity and revenue.",
                steps: [
                    "👉 Navigate to **Batch Manager → Create New Batch**",
                    "📝 Fill in the batch details including activity type, dates, and days",
                    "⏰ Add slots with specific **start & end times**, **member pricing**, and **non-member pricing**",
                    "📅 Use the **Copy to Other Days** feature to duplicate slot structures quickly",
                    "",
                    "🧾 To create a booking:",
                    "➡️ Go to **Booking Manager → Create New Booking**",
                    "📌 Choose the **desired date and slot**",
                    "👥 Add members and non-members to the booking",
                    "💳 Once booked, admins can accept **offline payments**, or members can pay directly through their **profile dashboard**",
                ],
                note: "This feature is ideal for facilities offering classes, events, or rentals with varied schedules. It supports better planning, optimized occupancy, and transparent pricing.",
                screenshots: [
                    "https://ik.imagekit.io/hl37bqgg7/release-screenshots/booking-image-1.png",
                    "https://ik.imagekit.io/hl37bqgg7/release-screenshots/booking-image-2.png",
                ],
                tag: "New",
            },

            {
                title: "💰 Add Difference Amount (NEW)",
                description:
                    "You can now **add a remaining or additional payment** to any type of fees using the new 'Difference Amount' feature in the payment history section.",
                steps: [
                    "Go to **Member Manager > View Payment History**",
                    "Click on **'Add Difference Amount'**",
                    "Enter the extra amount to be added",
                    "Click **Submit** to update the payment",
                ],
                note: "This helps when there's a manual adjustment in payment due to plan upgrades or changes.",
                screenshots: [
                    "https://ik.imagekit.io/hl37bqgg7/release-screenshots/screenshot-1.png",
                    "https://ik.imagekit.io/hl37bqgg7/release-screenshots/screenshot-2.png",
                    "https://ik.imagekit.io/hl37bqgg7/release-screenshots/screenshot-3.png",
                ],
                tag: "New",
            },
        ],
    },
];

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 720,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "90vh",
    overflowY: "auto",
};

const imagePreviewStyle = {
    maxWidth: "90vw",
    maxHeight: "90vh",
    objectFit: "contain",
    margin: "auto",
    display: "block",
};

const ReleaseNotesModal = ({ forceOpen = false, onForceClose }) => {
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [expandedItems, setExpandedItems] = useState({ 0: true });

    const latestRelease = releaseNotesData?.[0];
    const STORAGE_KEY = `release-notes-dismissed-${latestRelease.version}`;

    useEffect(() => {
        const isDismissed = localStorage.getItem(STORAGE_KEY);
        if (!isDismissed) setOpen(true);
    }, [STORAGE_KEY]);

    useEffect(() => {
        if (forceOpen) setOpen(true);
    }, [forceOpen]);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setOpen(false);
        if (onForceClose) onForceClose();
    };

    const handleImageClick = (src) => {
        setImagePreview(src);
    };

    const handleImageClose = () => {
        setImagePreview(null);
    };

    const toggleExpand = (index) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">
                            🎉 <strong>IMP</strong> What's New - v{latestRelease.version} ({latestRelease.date})
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={3}>
                        {latestRelease.highlights.map((item, index) => {
                            const isExpanded = expandedItems[index];
                            const collapsedHeight = 180;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        border: "1px solid #eee",
                                        borderRadius: 2,
                                        p: 2,
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        maxHeight: isExpanded ? "1000px" : `${collapsedHeight}px`,
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {item.title}
                                        </Typography>
                                        {item.tag && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    bgcolor:
                                                        item.tag === "New"
                                                            ? "#4caf50"
                                                            : item.tag === "Improved"
                                                            ? "#2196f3"
                                                            : "#ff9800",
                                                    color: "#fff",
                                                    px: 1,
                                                    borderRadius: 1,
                                                }}
                                            >
                                                {item.tag}
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {item.description}
                                        </Typography>

                                        {item.steps && (
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                                                    Steps to use:
                                                </Typography>
                                                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                                                    {item.steps.map((step, i) => (
                                                        <li key={i}>
                                                            <Typography variant="body2" component="span">
                                                                {step}
                                                            </Typography>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        )}

                                        {item.note && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    backgroundColor: "#fff3cd",
                                                    padding: "8px 12px",
                                                    borderRadius: 1,
                                                    color: "#856404",
                                                    mb: 2,
                                                }}
                                            >
                                                ⚠️ {item.note}
                                            </Typography>
                                        )}

                                        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                                            {item.screenshots.map((src, i) => (
                                                <Card
                                                    key={i}
                                                    sx={{ maxWidth: 160, cursor: "pointer" }}
                                                    onClick={() => handleImageClick(src)}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="100"
                                                        image={src}
                                                        alt={`screenshot-${i}`}
                                                    />
                                                    <CardContent sx={{ padding: "4px 8px" }}>
                                                        <Typography variant="caption">Screenshot {i + 1}</Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Gradient overlay */}
                                    {!isExpanded && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: "100px",
                                                background: "linear-gradient(to top, white, transparent)",
                                                zIndex: 1,
                                            }}
                                        />
                                    )}

                                    {/* Toggle Button */}
                                    <Box
                                        textAlign="center"
                                        mt={2}
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            padding: "8px 0",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            onClick={() => toggleExpand(index)}
                                            sx={{
                                                cursor: "pointer",
                                                fontWeight: 600,
                                                color: "primary.main",
                                                zIndex: 2,
                                                position: "relative",
                                                "&:hover": { textDecoration: "underline" },
                                            }}
                                        >
                                            {isExpanded ? "Show Less ▲" : "Show Full Details ▼"}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </Modal>

            {/* Image Preview Modal */}
            <Dialog open={!!imagePreview} onClose={handleImageClose} maxWidth="lg">
                {imagePreview && <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />}
            </Dialog>
        </>
    );
};

export default ReleaseNotesModal;
