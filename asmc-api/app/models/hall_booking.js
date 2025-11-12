import mongoose from 'mongoose';

const hallBookingSchema = new mongoose.Schema(
    {
        booking_id: { type: Number, default: 111000, unique: true },
        hall_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'halls',
            required: true,
        },
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'members',
            required: true,
        },

        // Booking date & slot
        booking_date: {
            type: Date,
            required: true,
        },
        slot_from: {
            type: Date,
            required: true,
        },
        slot_to: {
            type: Date,
            required: true,
        },

        // Purpose of booking
        purpose: {
            type: String,
            required: true,
            trim: true,
        },

        // Payment Info
        is_full_payment: {
            type: Boolean,
            default: false, // false => advance only
        },
        total_amount: {
            type: Number,
            required: true,
        },
        amount_paid: {
            type: Number,
            required: true,
        },
        advance_amount: {
            type: Number,
        },
        refundable_deposit: {
            type: Number,
        },

        payment_status: {
            type: String,
            enum: ['Pending', 'Success', 'Partial Paid', 'Failed', 'Cancel'],
            default: 'Pending',
        },
        payment_verified_at: {
            type: Date,
            default: null,
        },
        partial_payment_verified_at: {
            type: Date,
            default: null,
        },

        // Cancellation
        is_cancelled: {
            type: Boolean,
            default: false,
        },
        cancellation_date: {
            type: Date,
        },
        cancellation_charges: {
            type: Number,
            default: 0,
        },
        cancellation_reason: {
            type: String,
        },

        // Refunded
        is_refunded: {
            type: Boolean,
            default: false,
        },
        refunded_at: {
            type: Date,
        },
        refund_remarks: {
            type: String,
        },
        refund_amount: {
            type: String,
        },

        // Admin Remarks or Status Flags
        admin_remark: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

// Auto-increment booking_id logic
hallBookingSchema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
        const lastBooking = await HallBookings.findOne({}, { booking_id: 1 }).sort({
            booking_id: -1,
        });
        doc.booking_id = lastBooking ? lastBooking.booking_id + 1 : 111000;
    }
    next();
});

const HallBookings = mongoose.model('hall_bookings', hallBookingSchema);

export default HallBookings;
