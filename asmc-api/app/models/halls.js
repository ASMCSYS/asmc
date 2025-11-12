import mongoose from 'mongoose';

var hallsSchema = new mongoose.Schema(
    {
        hall_id: { type: Number, default: 555000, unique: true },
        name: String,
        description: { type: String },
        text_content: { type: String },
        terms: { type: String },
        advance_booking_period: { type: String },
        advance_payment_amount: { type: String },
        booking_amount: { type: String },
        cleaning_charges: { type: String },
        refundable_deposit: { type: String },
        additional_charges: { type: String },
        other_charges: { type: String, default: 0 },
        time_slots: { type: Array },
        images: { type: Array },
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
        status: { type: Boolean, default: true },
    },
    { versionKey: false, timestamps: true },
);

hallsSchema.pre('save', function (next) {
    var doc = this;
    Halls.findOne(
        {},
        { hall_id: 1 },
        { sort: { hall_id: -1 } },
        function (error, counter) {
            if (counter) {
                counter.hall_id++;
                doc.hall_id = counter.hall_id;
            }
            next();
        },
    );
});

const Halls = mongoose.model('halls', hallsSchema);

export default Halls;
