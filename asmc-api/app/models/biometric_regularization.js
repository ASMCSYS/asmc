import mongoose from 'mongoose';

const regularizationSchema = new mongoose.Schema(
    {
        attendance_log_id: {
            type: String,
            required: true,
            ref: 'BiometricAttendanceLog',
        },
        requested_by: {
            type: String,
            required: true,
            ref: 'staff',
        },
        requested_by_name: {
            type: String,
            required: true,
        },
        request_type: {
            type: String,
            enum: ['time_change', 'status_change', 'add_log', 'delete_log'],
            required: true,
        },
        original_data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        requested_data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approved_by: {
            type: String,
            ref: 'staff',
        },
        approved_by_name: {
            type: String,
        },
        approval_reason: {
            type: String,
        },
        approved_at: {
            type: Date,
        },
        notification_sent: {
            type: Boolean,
            default: false,
        },
        notification_read: {
            type: Boolean,
            default: false,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

// Index for efficient queries
regularizationSchema.index({ attendance_log_id: 1 });
regularizationSchema.index({ requested_by: 1 });
regularizationSchema.index({ status: 1 });
regularizationSchema.index({ created_at: -1 });

export default mongoose.model('BiometricRegularization', regularizationSchema);
