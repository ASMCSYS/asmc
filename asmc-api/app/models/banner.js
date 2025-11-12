import mongoose from 'mongoose';

var bannerSchema = new mongoose.Schema(
    {
        url: String,
        type: String,
        status: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false, timestamps: true },
);

const Banner = mongoose.model('banner', bannerSchema);

export default Banner;
