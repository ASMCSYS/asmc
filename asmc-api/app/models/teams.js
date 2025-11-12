import mongoose from "mongoose";

var teamsSchema = new mongoose.Schema({
    name: String,
    profile: String,
    activity_name: String,
    role: String,
    display_order: String,
    status: {
        type: Boolean,
        default: false
    },
}, { versionKey: false, timestamps: true });

const Teams = mongoose.model("teams", teamsSchema);

export default Teams;