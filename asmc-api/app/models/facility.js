import mongoose from "mongoose";

var facilitySchema = new mongoose.Schema({
    title: String,
    permalink: {
        type: String,
        unique: true
    },
    banner_url: String,
    status: {
        type: Boolean,
        default: false
    },
}, { versionKey: false, timestamps: true });

const Facility = mongoose.model("facilities", facilitySchema);

export default Facility;