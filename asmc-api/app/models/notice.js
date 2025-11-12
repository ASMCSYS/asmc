import mongoose from 'mongoose';

var noticeSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['public', 'specific_activity', 'specific_batch', 'specific_member'], // Define specific types
            default: 'public',
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'members', // Reference to the Member schema
            },
        ],
        activities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'activity', // Reference to the Activity schema
            },
        ],
        batches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'batch', // Reference to the Batch schema
            },
        ],
        title: String,
        pdf_url: String,
        content: String,
        status: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true },
);

const Notice = mongoose.model('notice', noticeSchema);

export default Notice;
