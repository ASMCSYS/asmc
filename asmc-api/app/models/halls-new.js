import mongoose from "mongoose";

var feesSchema = new mongoose.Schema({
    fees_type: {
        type: String,
        enum: ["member", "non_member", "dae_activities", "non_dae_activities"],
        required: true
    },
    slot_type: {
        type: String,
        enum: ["time", "hourly", "full_day",],
        required: true
    },
    start_time: String,
    end_time: String,
    amount: Number,
    deposit: Number,
    cleaning_charge: Number,
    extra_charge: Number,
    extra_charge_remarks: String,
    remarks: String,
    max_hours: Number,
});

var hallsSchema = new mongoose.Schema({
    hall_id: { type: Number, default: 555000, unique: true },
    type: {
        type: String,
        enum: ["personal_booking", "dae_booking", "official_booking"],
    },
    name: String,
    thumbnail: String,
    images: Array,
    short_description: String,
    description: String,
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'location', required: true },
    hall_capacity: String,
    fees: [feesSchema],
    advance_booking_period: Number,
    status: {
        type: Boolean,
        default: false
    },
}, { versionKey: false, timestamps: true });

hallsSchema.pre('save', function (next) {
    var doc = this;
    Halls.findOne({}, { hall_id: 1 }, { sort: { 'hall_id': -1 } }, function (error, counter) {
        if (counter) {
            counter.hall_id++;
            doc.hall_id = counter.hall_id;
        }
        next();
    });
});

const Halls = mongoose.model("halls", hallsSchema);

export default Halls;