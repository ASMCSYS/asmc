import mongoose from 'mongoose';

var testimonialsSchema = new mongoose.Schema(
    {
        name: String,
        role: String,
        profile: String,
        star: String,
        message: String,
        status: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true },
);

const Testimonials = mongoose.model('testimonials', testimonialsSchema);

export default Testimonials;
