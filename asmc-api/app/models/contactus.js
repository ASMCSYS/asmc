import mongoose from "mongoose";

var contactUsSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone_number: String,
    subject: String,
    message: String,
}, { versionKey: false, timestamps: true });

const ContactUsModel = mongoose.model("contactus", contactUsSchema);

export default ContactUsModel;