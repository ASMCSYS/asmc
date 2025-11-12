import mongoose from 'mongoose';

var paymentHistorySchema = new mongoose.Schema(
    {
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'members',
            required: false,
        },
        booking_id: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'bookings', required: false },
        ],
        event_booking_id: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: false },
        ],
        hall_booking_id: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'halls', required: false },
        ],
        secondary_member_id: { type: String, required: false },
        payment_file: String,
        payment_id: String,
        amount_paid: Number,
        difference_amount_paid: Number,
        plan_id: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'plans', required: false },
        ],
        payment_status: {
            type: String,
            default: 'Initiated',
        },
        payment_verified: {
            type: Boolean,
            default: false,
        },
        remarks: String,
        payment_mode: String,
        verifiedAt: String,
        payment_response: String,
        order_id: String,
        booking_type: {
            type: String,
            default: 'enrollment',
        },
        membership_amount: Number,
        booking_amount: Number,
    },
    { versionKey: false, timestamps: true },
);

const PaymentHistory = mongoose.model('payment_history', paymentHistorySchema);

export default PaymentHistory;
