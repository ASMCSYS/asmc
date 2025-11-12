import mongoose from 'mongoose';

const biometricSchema = new mongoose.Schema(
    {
        thumbprint: { type: String }, // base64 or device id
        deviceId: { type: String },
        deviceUserId: { type: String }, // User ID on the biometric device
        registeredAt: { type: Date },

        // Enrollment status tracking
        enrollment: {
            status: {
                type: String,
                enum: ['pending', 'in_progress', 'completed', 'failed'],
                default: 'pending',
            },
            fingerprint: {
                enrolled: { type: Boolean, default: false },
                enrolledAt: { type: Date },
                attempts: { type: Number, default: 0 },
                maxAttempts: { type: Number, default: 3 },
            },
            face: {
                enrolled: { type: Boolean, default: false },
                enrolledAt: { type: Date },
                attempts: { type: Number, default: 0 },
                maxAttempts: { type: Number, default: 3 },
            },
            startedAt: { type: Date },
            completedAt: { type: Date },
            lastAttemptAt: { type: Date },
            enrollmentToken: { type: String }, // For tracking enrollment session
            instructions: { type: String }, // Current instruction for user
        },
    },
    { _id: false },
);

const staffSchema = new mongoose.Schema(
    {
        // Additional fields
        staff_id: { type: String, default: '00001', unique: true },
        // Basic information
        name: { type: String, required: true },
        designation: { type: String, required: true },
        department: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: { type: String },

        // Biometric and Smart Office
        biometric: biometricSchema,
        smartOfficeId: { type: String }, // for Smart Office sync

        // Status and activity
        status: {
            type: Boolean,
            default: true,
        },
        permissions: [{ type: String }], // Direct permissions (overrides role permissions)

        joiningDate: { type: Date },
        reportingTo: { type: String }, // Manager
        team: { type: String }, // Team assignment

        // Converted fields
        converted: { type: Boolean, default: false },
        convertedAt: { type: Date },
    },
    { timestamps: true },
);

// Indexes for efficient queries
staffSchema.index({ email: 1 });
staffSchema.index({ status: 1 });
staffSchema.index({ department: 1 });

staffSchema.pre('save', function (next) {
    var doc = this;
    Staff.findOne(
        {},
        { staff_id: 1 },
        { sort: { staff_id: -1 } },
        function (error, counter) {
            if (error) return next(error);
            if (counter && counter.staff_id) {
                const newId = String(parseInt(counter.staff_id) + 1).padStart(5, '0');
                doc.staff_id = newId;
            } else {
                doc.staff_id = '00001';
            }
            next();
        },
    );
});

const Staff = mongoose.model('staff', staffSchema);
export default Staff;
