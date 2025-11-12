import mongoose from 'mongoose';

var faqsSchema = new mongoose.Schema(
    {
        question: String,
        answer: String,
        category: String,
        status: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true },
);

const Faqs = mongoose.model('faqs', faqsSchema);

export default Faqs;
