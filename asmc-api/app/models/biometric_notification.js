import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                'regularization_request',
                'regularization_approved',
                'regularization_rejected',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        regularization_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BiometricRegularization',
        },
        attendance_log_id: {
            type: String,
            ref: 'BiometricAttendanceLog',
        },
        requested_by: {
            type: String,
            ref: 'staff',
        },
        requested_by_name: {
            type: String,
        },
        target_user: {
            type: String,
            ref: 'staff',
        },
        is_read: {
            type: Boolean,
            default: false,
        },
        read_at: {
            type: Date,
        },
        action_taken: {
            type: Boolean,
            default: false,
        },
        action_taken_at: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

// Index for efficient queries
notificationSchema.index({ target_user: 1, is_read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ created_at: -1 });

export default mongoose.model('BiometricNotification', notificationSchema);
