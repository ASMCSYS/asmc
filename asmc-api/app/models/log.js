import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'staff' },
        action: { type: String, required: true },
        module: { type: String, required: true },
        description: { type: String },
        metadata: { type: Object },
        ip: { type: String },
        userAgent: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: false },
);

const Log = mongoose.model('log', logSchema);
export default Log;
