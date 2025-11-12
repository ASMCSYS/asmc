import mongoose from 'mongoose';

var biometricAttendanceLogSchema = new mongoose.Schema(
    {
        log_id: {
            type: String,
            required: true,
            unique: true,
        },
        staff_id: {
            type: String,
            required: true,
        },
        machine_id: {
            type: String,
            required: true,
        },
        staff_name: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ['check-in', 'check-out', 'break-start', 'break-end'],
            required: true,
        },
        method: {
            type: String,
            enum: ['fingerprint', 'card', 'password', 'face'],
            default: 'fingerprint',
        },
        location: {
            type: String,
            ref: 'biometric_machines.location',
        },
        ip_address: {
            type: String,
            ref: 'biometric_machines.ip_address',
        },
        status: {
            type: String,
            enum: ['success', 'failed', 'duplicate'],
            default: 'success',
        },
        remarks: {
            type: String,
            trim: true,
        },
        raw_data: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    { versionKey: false, timestamps: true },
);

// Indexes for better query performance
biometricAttendanceLogSchema.index({ staff_id: 1, timestamp: -1 });
biometricAttendanceLogSchema.index({ machine_id: 1, timestamp: -1 });
biometricAttendanceLogSchema.index({ timestamp: -1 });
biometricAttendanceLogSchema.index({ type: 1, timestamp: -1 });

const BiometricAttendanceLog = mongoose.model(
    'biometric_attendance_logs',
    biometricAttendanceLogSchema,
);

export default BiometricAttendanceLog;
