import mongoose from 'mongoose';
import { hasOverlap, isTimeOverlap } from '../utils/helper.js';

var slotsSchema = new mongoose.Schema(
    {
        day: { type: String },
        time_slots: [Object],
    },
    { timestamps: false, _id: false },
);

var feesSchema = new mongoose.Schema(
    {
        plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'plans', required: true },
        plan_name: String,
        plan_type: String,
        member_price: {
            type: Number,
            default: 0,
        },
        dependent_member_price: {
            type: Number,
            default: 0,
        },
        non_member_price: {
            type: Number,
            default: 0,
        },
        member_price_with_ac: {
            type: Number,
            default: 0,
        },
        non_member_price_with_ac: {
            type: Number,
            default: 0,
        },
        batch_hours: {
            type: Number,
            default: 0,
        },
        end_month: {
            type: Number,
            default: 0,
        },
        start_month: {
            type: Number,
            default: 0,
        },
        plan_timeline: {
            type: String,
            default: '',
        },
    },
    { timestamps: true },
);

var batchSchema = new mongoose.Schema(
    {
        activity_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'activity',
            required: true,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: true,
        },
        subcategory_name: { type: String, required: false },
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'location',
            required: true,
        },
        sublocation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'location',
            required: false,
        },
        court: { type: String, required: false },
        batch_type: { type: String, required: true },
        batch_code: { type: String, required: true, unique: true },
        batch_name: { type: String, required: true },
        batch_limit: { type: String, required: true },
        no_of_player: { type: String, required: false },
        type: {
            type: String,
            default: 'enrollment',
            enum: ['enrollment', 'booking'],
        },
        days: { type: Array, required: true },
        days_prices: { type: Object, required: false },
        member_days_prices: { type: Object, required: false },
        start_time: { type: String },
        end_time: { type: String },
        advance_booking_period: { type: String },
        fees: [feesSchema],
        slots: [slotsSchema],
        status: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true },
);

// Static method to check for duplicate slots
batchSchema.statics.hasDuplicateSlots = async function (
    days,
    start_time,
    end_time,
    locationId,
    sublocationId,
    court,
    activityId,
    excludeBatchId = null,
) {
    // Fetch existing batches with the same location, sublocation, secondary sublocation, and activity
    const existingBatches = await this.find({
        location_id: locationId,
        sublocation_id: sublocationId,
        court: court,
        activity_id: activityId,
        _id: { $ne: excludeBatchId },
    });

    // console.log(existingBatches, "existingBatches");
    for (let batch of existingBatches) {
        if (
            hasOverlap(batch.days, days) &&
            isTimeOverlap(batch.start_time, batch.end_time, start_time, end_time)
        ) {
            return true;
        }
    }
    return false;
};

// Pre-save middleware to check for duplicate slots
batchSchema.pre('save', async function (next) {
    try {
        const days = this.days;
        const start_time = this.start_time;
        const end_time = this.end_time;
        const locationId = this.location_id;
        const sublocationId = this.sublocation_id;
        const court = this.court;
        const activityId = this.activity_id;

        // Check for duplicate slots
        if (
            await this.constructor.hasDuplicateSlots(
                days,
                start_time,
                end_time,
                locationId,
                sublocationId,
                court,
                activityId,
            )
        ) {
            return next(
                new Error(
                    'Duplicate slots found within the same location, sublocation, court, and activity',
                ),
            );
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Batch = mongoose.model('batch', batchSchema);

export default Batch;
