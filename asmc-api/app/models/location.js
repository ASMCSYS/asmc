import mongoose from "mongoose";

var locationSchema = new mongoose.Schema({
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'location', required: false },
    title: String,
    address: String,
    status: {
        type: Boolean,
        default: false
    },
}, { versionKey: false, timestamps: true });

const Location = mongoose.model("location", locationSchema);

export default Location;