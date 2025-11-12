import mongoose from 'mongoose';

var cmsSchema = new mongoose.Schema(
    {
        key: String,
        json: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    { versionKey: false, timestamps: true },
);

const cmsModel = mongoose.model('cms', cmsSchema);

export default cmsModel;
