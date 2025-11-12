import mongoose from 'mongoose';

var activitySchema = new mongoose.Schema(
    {
        activity_id: { type: Number, default: 99000, unique: true },
        facility_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'facility',
            required: true,
        },
        name: String,
        thumbnail: String,
        images: Array,
        category: Object,
        short_description: String,
        description: String,
        location: Object,
        batch_booking_plan: Object,
        status: {
            type: Boolean,
            default: false,
        },
        show_hide: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false, timestamps: true },
);

activitySchema.pre('save', function (next) {
    var doc = this;
    Activity.findOne(
        {},
        { activity_id: 1 },
        { sort: { activity_id: -1 } },
        function (error, counter) {
            if (counter) {
                counter.activity_id++;
                doc.activity_id = counter.activity_id;
            }
            next();
        },
    );
});

const Activity = mongoose.model('activity', activitySchema);

export default Activity;
