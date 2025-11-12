import mongoose from 'mongoose';

var biometricMachineSchema = new mongoose.Schema(
    {
        machine_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        ip_address: {
            type: String,
            required: true,
            trim: true,
        },
        port: {
            type: Number,
            required: true,
            default: 4370,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'unknown'],
            default: 'unknown',
        },
        last_seen: {
            type: Date,
            default: Date.now,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
            trim: true,
        },
        firmware_version: {
            type: String,
            trim: true,
        },
        serial_number: {
            type: String,
            trim: true,
        },
        total_users: {
            type: Number,
            default: 0,
        },
        total_logs: {
            type: Number,
            default: 0,
        },
        added_by: Object,
    },
    { versionKey: false, timestamps: true },
);

// Index for better query performance
biometricMachineSchema.index({ machine_id: 1 });
biometricMachineSchema.index({ ip_address: 1 });
biometricMachineSchema.index({ status: 1 });

const BiometricMachine = mongoose.model('biometric_machines', biometricMachineSchema);

export default BiometricMachine;
