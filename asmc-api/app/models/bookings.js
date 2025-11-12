import mongoose from 'mongoose';

var bookingSchema = new mongoose.Schema(
    {
        booking_id: { type: Number, default: 555000, unique: true },
        activity_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'activity',
            required: true,
        },
        member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'members',
            required: true,
        },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: 'batch', required: true },
        family_member: Array,
        players: Array,
        chss_number: Array,
        fees_breakup: Object,
        total_amount: Number,
        primary_eligible: {
            type: Boolean,
            default: true,
        },
        payment_status: {
            type: String,
            default: 'Pending',
        },
        feesPaidAt: {
            type: Date,
            default: null,
        },
        payment_verified_at: {
            type: Date,
            default: null,
        },
        status: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'enrollment',
            enum: ['enrollment', 'booking'],
        },
        show_renew_button: {
            type: Boolean,
            default: false,
        },
        booking_date: {
            type: String,
            required: false,
        },
        booking_time: {
            type: String,
            required: false,
        },
    },
    { versionKey: false, timestamps: true },
);

bookingSchema.pre('save', function (next) {
    var doc = this;
    Bookings.findOne(
        {},
        { booking_id: 1 },
        { sort: { booking_id: -1 } },
        function (error, counter) {
            if (counter) {
                counter.booking_id++;
                doc.booking_id = counter.booking_id;
            }
            next();
        },
    );
});

const Bookings = mongoose.model('bookings', bookingSchema);

export default Bookings;
