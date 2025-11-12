import mongoose from 'mongoose';

var categorySchema = new mongoose.Schema(
    {
        category_name: String,
        belts: String,
        distance: String,
        end_age: String,
        gender: Array,
        members_fees: String,
        non_members_fees: String,
        start_age: String,
        category_description: { type: String },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false, timestamps: true },
);

var eventsSchema = new mongoose.Schema(
    {
        event_id: { type: Number, default: 888000, unique: true },
        event_name: String,
        event_type: String,
        members_type: String,
        description: { type: String },
        text_content: { type: String }, // Text content for the event
        images: { type: Array }, // Array of images

        event_start_date: { type: Date, required: true },
        event_end_date: { type: Date, required: true },
        event_start_time: { type: String },
        event_end_time: { type: String },

        broadcast_start_date: { type: Date },
        broadcast_end_date: { type: Date },
        broadcast_start_time: { type: String },
        broadcast_end_time: { type: String },

        registration_start_date: { type: Date },
        registration_end_date: { type: Date },
        registration_start_time: { type: String },
        registration_end_time: { type: String },

        players_limit: { type: String },
        min_players_limit: { type: String },
        member_team_event_price: { type: String },
        non_member_team_event_price: { type: String },

        category_data: [categorySchema],

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

        status: { type: Boolean, default: true }, // Active or inactive
    },
    { versionKey: false, timestamps: true },
);

eventsSchema.pre('save', function (next) {
    var doc = this;
    Events.findOne(
        {},
        { event_id: 1 },
        { sort: { event_id: -1 } },
        function (error, counter) {
            if (counter) {
                counter.event_id++;
                doc.event_id = counter.event_id;
            }
            next();
        },
    );
});

const Events = mongoose.model('events', eventsSchema);

export default Events;
