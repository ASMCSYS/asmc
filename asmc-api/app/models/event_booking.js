import mongoose from 'mongoose';

var eventBookingSchema = new mongoose.Schema(
    {
        booking_id: { type: Number, default: 111000, unique: true },
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events',
            required: true,
        },
        category_id: mongoose.Schema.Types.ObjectId,
        booking_form_data: {
            type: Object,
            default: {},
        },
        member_data: {
            type: Array,
            default: [],
        },
        non_member_data: {
            type: Array,
            default: [],
        },
        category_data: {
            type: Object,
            default: {},
        },
        amount_paid: Number,
        payment_status: {
            type: String,
            default: 'Pending',
        },
        payment_verified_at: {
            type: Date,
            default: null,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false, timestamps: true },
);

eventBookingSchema.pre('save', function (next) {
    var doc = this;
    EventBookings.findOne(
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

const EventBookings = mongoose.model('event_bookings', eventBookingSchema);

export default EventBookings;
