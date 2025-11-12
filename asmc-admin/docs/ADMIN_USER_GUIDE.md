# ASMC Admin Panel - User Guide

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Application:** ASMC Admin Panel  
**Technology:** React.js with Material-UI  

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication & Login](#authentication--login)
3. [Dashboard Overview](#dashboard-overview)
4. [Member Management](#member-management)
5. [Booking Management](#booking-management)
6. [Event Management](#event-management)
7. [Payment Management](#payment-management)
8. [Content Management](#content-management)
9. [Reports & Analytics](#reports--analytics)
10. [System Configuration](#system-configuration)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Screen Resolution**: Minimum 1366x768 (Recommended: 1920x1080)
- **Internet Connection**: Stable broadband connection
- **JavaScript**: Must be enabled

### Accessing the Admin Panel

1. **URL**: Navigate to your admin panel URL
2. **Login**: Use your admin credentials
3. **Dashboard**: You'll be redirected to the main dashboard

### First-Time Setup

1. **Profile Configuration**: Update your admin profile
2. **System Settings**: Configure basic system parameters
3. **User Permissions**: Set up role-based access control

---

## Authentication & Login

### Login Process

1. **Access Login Page**
   - Navigate to the admin panel URL
   - You'll be redirected to the login page

2. **Enter Credentials**
   - **Username/Email**: Your admin email address
   - **Password**: Your secure password

3. **Authentication**
   - Click "Login" button
   - System validates credentials
   - Redirects to dashboard on success

### Password Management

#### Changing Password
1. Navigate to **Profile Settings**
2. Click **"Change Password"**
3. Enter current password
4. Enter new password (minimum 8 characters)
5. Confirm new password
6. Click **"Update Password"**

#### Password Reset
1. On login page, click **"Forgot Password?"**
2. Enter your email address
3. Check email for reset link
4. Click reset link and set new password

### Session Management

- **Session Timeout**: 24 hours (configurable)
- **Auto Logout**: Automatic logout after inactivity
- **Multiple Sessions**: Limited to prevent conflicts

---

## Dashboard Overview

### Main Dashboard Components

#### 1. Navigation Sidebar
- **Collapsible Menu**: Click hamburger icon to expand/collapse
- **Module Access**: Quick access to all system modules
- **User Profile**: Access to profile and logout

#### 2. Header Bar
- **Breadcrumbs**: Shows current page location
- **Notifications**: System alerts and messages
- **User Menu**: Profile, settings, logout options

#### 3. Dashboard Widgets
- **Member Statistics**: Total members, active members, active plan members
- **Revenue Summary**: Membership and enrollment revenue by payment mode
- **Charts**: Member registration trends and payment received trends
- **Permission-Based Views**: Different data based on user permissions

#### 4. Quick Actions
- **Member Management**: Quick access to member functions
- **Booking Management**: Direct booking management
- **Reports**: Quick report generation
- **System Alerts**: Important notifications

### Dashboard Features

#### Member Statistics
- **Total Members**: Complete member count
- **Active Members**: Currently active members
- **Active Plan Members**: Members with active plans

#### Revenue Analytics
- **Membership Revenue**: Revenue from membership fees
- **Enrollment Revenue**: Revenue from activity enrollments
- **Payment Mode Breakdown**: Revenue by payment method
- **Monthly Trends**: Revenue trends over time

#### Charts and Visualizations
- **Member Registration Chart**: Monthly member registration trends
- **Payment Received Chart**: Monthly payment trends
- **Interactive Charts**: Hover for detailed information

---

## Member Management

### Member List View

#### Accessing Member List
1. Navigate to **Members** → **Member Manager**
2. View all registered members in tabular format

#### Member List Features
- **Search**: Search by name, email, phone, or member ID
- **Filter**: Filter by status, membership plan, registration date
- **Sort**: Sort by any column (name, date, status)
- **Pagination**: Navigate through large datasets
- **Export**: Export member data to Excel/CSV

#### Member Status Indicators
- **Active**: Green dot - Member can access facilities
- **Inactive**: Gray dot - Member access suspended
- **Pending**: Yellow dot - Awaiting approval
- **Expired**: Red dot - Membership expired

### Adding New Members

#### Single Member Registration
1. Click **"Add Member"** button
2. Fill in required information:
   - **Personal Details**: Name, email, phone, address
   - **Membership Details**: Plan selection, start date
   - **Family Members**: Add family members (optional)
   - **Profile Image**: Upload member photo
3. Click **"Save Member"**

#### Bulk Member Import
1. Navigate to **Members** → **Bulk Import**
2. Download template file
3. Fill in member data
4. Upload completed file
5. Review and confirm import

### Member Profile Management

#### Viewing Member Details
1. Click on member name in the list
2. View comprehensive member information:
   - **Personal Information**
   - **Membership Details**
   - **Booking History**
   - **Payment History**
   - **Family Members**

#### Editing Member Information
1. Open member profile
2. Click **"Edit"** button
3. Modify required fields
4. Click **"Save Changes"**

#### Member Actions
- **Suspend Member**: Temporarily disable access
- **Activate Member**: Restore access
- **Delete Member**: Remove from system (with confirmation)
- **Send Message**: Send email/SMS notification

---

## Booking Management

### Hall Bookings

#### Accessing Hall Bookings
1. Navigate to **Bookings** → **Hall Bookings**
2. View all hall bookings in chronological order

#### Booking Status Types
- **Confirmed**: Green - Booking is active
- **Pending**: Yellow - Awaiting confirmation
- **Cancelled**: Red - Booking cancelled
- **Completed**: Blue - Booking finished

### Event Bookings

#### Accessing Event Bookings
1. Navigate to **Bookings** → **Event Bookings**
2. View all event bookings and registrations

#### Event Booking Management
- **View Registrations**: List of registered participants
- **Approve/Reject**: Manage registration requests
- **Send Notifications**: Communicate with participants
- **Generate Reports**: Participant statistics

### Booking Management Actions

#### Viewing Booking Details
1. Click on booking in the list
2. View comprehensive information:
   - **Booking Information**
   - **Member Details**
   - **Payment Status**
   - **Activity Log**

#### Modifying Bookings
1. Open booking details
2. Click **"Edit Booking"**
3. Modify required fields
4. Save changes

#### Cancelling Bookings
1. Open booking details
2. Click **"Cancel Booking"**
3. Select cancellation reason
4. Confirm cancellation
5. Process refund if applicable

---

## Event Management

### Event Overview

#### Accessing Events
1. Navigate to **Events** → **Event Manager**
2. View all events in chronological order

#### Event Status Types
- **Upcoming**: Blue - Event scheduled
- **Ongoing**: Green - Event in progress
- **Completed**: Gray - Event finished
- **Cancelled**: Red - Event cancelled

### Creating Events

#### Event Creation Process
1. Click **"Create Event"**
2. Fill event details:
   - **Basic Information**: Title, description, category
   - **Schedule**: Start date, end date, time
   - **Location**: Venue, address
   - **Capacity**: Maximum participants
   - **Pricing**: Event cost, payment options
   - **Images**: Event photos and banners
3. Click **"Save Event"**

#### Event Configuration
- **Registration**: Enable/disable registration
- **Waitlist**: Enable waitlist for full events
- **Notifications**: Email/SMS notifications
- **Reminders**: Automated reminders

### Event Management

#### Event Details View
1. Click on event in the list
2. View comprehensive information:
   - **Event Information**
   - **Participant List**
   - **Registration Status**
   - **Revenue Summary**

#### Managing Participants
- **View Registrations**: List of registered participants
- **Approve/Reject**: Manage registration requests
- **Send Notifications**: Communicate with participants
- **Generate Reports**: Participant statistics

#### Event Modifications
- **Edit Event**: Modify event details
- **Cancel Event**: Cancel with participant notification
- **Reschedule**: Change date/time with notifications
- **Update Capacity**: Modify participant limits

---

## Payment Management

### Payment Overview

#### Accessing Payments
1. Navigate to **Payments** → **Payment Manager**
2. View all payment transactions

#### Payment Status Types
- **Success**: Green - Payment completed
- **Pending**: Yellow - Payment processing
- **Failed**: Red - Payment failed
- **Refunded**: Blue - Payment refunded

### Payment Processing

#### Manual Payment Entry
1. Click **"Add Payment"**
2. Select payment type:
   - **Membership Fee**: Monthly/annual fees
   - **Booking Payment**: Hall/event payments
   - **Enrollment Fee**: Activity enrollment fees
3. Fill payment details:
   - **Member Selection**: Choose member
   - **Amount**: Payment amount
   - **Payment Method**: Cash, card, online
   - **Transaction ID**: Reference number
4. Click **"Process Payment"**

#### Payment Verification
- **Amount Validation**: Verify correct amount
- **Member Verification**: Confirm member eligibility
- **Duplicate Check**: Prevent duplicate payments
- **Receipt Generation**: Automatic receipt creation

### Payment Management

#### Payment Details View
1. Click on payment in the list
2. View comprehensive information:
   - **Payment Information**
   - **Member Details**
   - **Transaction History**
   - **Receipt Details**

#### Payment Actions
- **View Receipt**: Generate payment receipt
- **Process Refund**: Initiate refund process
- **Update Status**: Modify payment status
- **Send Receipt**: Email receipt to member

---

## Content Management

### Banner Management

#### Accessing Banners
1. Navigate to **Content** → **Banner Master**
2. Manage website banners and promotional content

#### Banner Features
- **Upload Banners**: Add new banner images
- **Banner Settings**: Configure display settings
- **Banner Order**: Arrange banner sequence
- **Banner Status**: Enable/disable banners

### Gallery Management

#### Photo Gallery
1. Navigate to **Content** → **Photo Gallery Master**
2. Manage club event photos and images

#### Video Gallery
1. Navigate to **Content** → **Video Gallery Master**
2. Manage club videos and media content

### CMS Pages

#### Home Page CMS
1. Navigate to **Content** → **Home Page CMS**
2. Manage homepage content and layout

#### About Page CMS
1. Navigate to **Content** → **About Page CMS**
2. Manage about page content and information

### Other Content

#### FAQs Management
1. Navigate to **Content** → **FAQs Master**
2. Manage frequently asked questions

#### Notices Management
1. Navigate to **Content** → **Notices Master**
2. Manage club notices and announcements

#### Testimonials
1. Navigate to **Content** → **Testimonials Master**
2. Manage member testimonials and reviews

---

## Reports & Analytics

### Dashboard Analytics

#### Key Performance Indicators
- **Member Growth**: New member registrations
- **Revenue Trends**: Monthly revenue analysis
- **Booking Utilization**: Facility usage statistics
- **Event Participation**: Event attendance rates

#### Real-Time Metrics
- **Active Members**: Currently active members
- **Today's Bookings**: Current day bookings
- **Pending Payments**: Outstanding payments
- **System Alerts**: Important notifications

### Report Generation

#### Available Reports
1. **Member Reports**
   - Member registration trends
   - Membership plan distribution
   - Member activity analysis
   - Family member statistics

2. **Booking Reports**
   - Booking frequency analysis
   - Facility utilization rates
   - Peak usage times
   - Cancellation rates

3. **Financial Reports**
   - Revenue analysis
   - Payment method distribution
   - Outstanding payments
   - Refund statistics

4. **Event Reports**
   - Event participation rates
   - Event revenue analysis
   - Participant demographics
   - Event feedback analysis

#### Report Customization
- **Date Range**: Select custom date periods
- **Filters**: Apply multiple filters
- **Grouping**: Group data by various criteria
- **Sorting**: Sort by any column

#### Export Options
- **Excel Export**: Detailed spreadsheet format
- **PDF Export**: Formatted document
- **CSV Export**: Simple data format
- **Email Reports**: Automated email delivery

---

## System Configuration

### General Settings

#### Accessing Settings
1. Navigate to **Settings** → **Settings Default**
2. Configure system-wide parameters

#### Basic Configuration
- **Organization Details**: Name, address, contact information
- **System Preferences**: Default settings, timezone
- **Notification Settings**: Email/SMS preferences
- **Security Settings**: Password policies, session timeouts

### User Management

#### Admin User Management
1. Navigate to **Settings** → **User Manager**
2. Manage admin users and permissions

#### Staff Management
1. Navigate to **Settings** → **Staff Manager**
2. Manage staff members and their roles

#### User Roles
- **Super Admin**: Full system access
- **Admin**: Most administrative functions
- **Staff**: Limited administrative access
- **Viewer**: Read-only access

#### Permission Management
- **Module Access**: Control access to system modules
- **Function Permissions**: Specific function permissions
- **Data Access**: Control data visibility
- **Action Permissions**: Create, edit, delete permissions

### System Maintenance

#### Database Management
1. Navigate to **Settings** → **Database Backup**
2. Manage database backups and maintenance

#### Backup Features
- **Manual Backup**: Create backup on demand
- **Scheduled Backup**: Automated backup configuration
- **Backup Restoration**: Restore from backup files
- **Backup History**: View backup logs

#### System Monitoring
- **Performance Monitoring**: System performance metrics
- **Error Logging**: System error tracking
- **User Activity**: User action logging
- **Security Monitoring**: Security event tracking

### Master Data Management

#### Plans Management
1. Navigate to **Masters** → **Plans Master**
2. Manage membership plans and pricing

#### Categories Management
1. Navigate to **Masters** → **Category Manager**
2. Manage event and activity categories

#### Facilities Management
1. Navigate to **Masters** → **Facility Manager**
2. Manage sports facilities and halls

#### Activity Management
1. Navigate to **Masters** → **Activity Manager**
2. Manage sports activities and programs

#### Hall Management
1. Navigate to **Masters** → **Hall Manager**
2. Manage booking halls and facilities

#### Location Management
1. Navigate to **Masters** → **Location Manager**
2. Manage club locations and addresses

#### Teams Management
1. Navigate to **Masters** → **Teams Manager**
2. Manage sports teams and groups

#### Batch Management
1. Navigate to **Masters** → **Batch Manager**
2. Manage activity batches and schedules

#### Fees Categories
1. Navigate to **Masters** → **Fees Categories**
2. Manage fee categories and structures

---

## Troubleshooting

### Common Issues

#### Login Problems
**Issue**: Cannot log in to admin panel
**Solutions**:
1. Check username and password
2. Clear browser cache and cookies
3. Try different browser
4. Contact system administrator

#### Slow Performance
**Issue**: Admin panel is slow or unresponsive
**Solutions**:
1. Check internet connection
2. Clear browser cache
3. Close unnecessary browser tabs
4. Restart browser

#### Data Not Loading
**Issue**: Data not displaying in lists or reports
**Solutions**:
1. Refresh the page
2. Check date range filters
3. Clear search filters
4. Check internet connection

#### Export Issues
**Issue**: Cannot export reports or data
**Solutions**:
1. Check file permissions
2. Try different export format
3. Reduce data size
4. Contact system administrator

### Error Messages

#### Common Error Messages
- **"Session Expired"**: Re-login required
- **"Access Denied"**: Insufficient permissions
- **"Data Not Found"**: No data matching criteria
- **"System Error"**: Contact administrator

#### Error Resolution
1. **Note Error Details**: Record error message and time
2. **Check Context**: Note what you were doing
3. **Try Again**: Attempt the action again
4. **Contact Support**: Report persistent issues

### Support Contact

#### Getting Help
- **Email Support**: admin-support@asmc.com
- **Phone Support**: +1-555-0123 (Business hours)
- **Online Chat**: Available during business hours
- **Documentation**: Check this user guide

#### Information to Provide
- **Error Message**: Exact error text
- **Steps to Reproduce**: How to recreate the issue
- **Browser Information**: Browser type and version
- **Time of Issue**: When the problem occurred

---

## Appendix

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + S | Save current form |
| Ctrl + F | Search in current page |
| Ctrl + P | Print current page |
| Ctrl + E | Export data |
| Esc | Close modal/dialog |

### Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

### File Upload Limits

| File Type | Maximum Size | Supported Formats |
|-----------|--------------|-------------------|
| Images | 5MB | jpg, jpeg, png, gif |
| Documents | 10MB | pdf, doc, docx |
| Spreadsheets | 5MB | xls, xlsx, csv |

### Session Management

- **Session Timeout**: 24 hours of inactivity
- **Auto Logout**: Automatic logout after timeout
- **Remember Me**: Extends session to 7 days
- **Multiple Sessions**: Limited to 2 concurrent sessions

---

**Document Version**: 1.0.0  
**Last Updated**: January 2025  
**Next Review**: February 2025  

---

*This user guide provides comprehensive instructions for using the ASMC Admin Panel. For technical support or additional questions, please contact the system administrator.* 