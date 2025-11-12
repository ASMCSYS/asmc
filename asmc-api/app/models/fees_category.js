import mongoose from 'mongoose';

var VariationSchema = new mongoose.Schema({
    name: String,
    values: Array,
});

var feesCategorySchema = new mongoose.Schema(
    {
        category_type: {
            type: String,
            required: true,
            enum: ['events', 'hall'], // Define specific types
            default: 'events',
        },
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events', // Reference to the Member schema
        },
        members_type: String,
        event_type: String,
        category_name: String,
        variations: [VariationSchema],
        members_fees: String,
        non_members_fees: String,
        status: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true },
);

const FeesCategory = mongoose.model('feesCategory', feesCategorySchema);

export default FeesCategory;
