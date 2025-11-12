import mongoose from "mongoose";

var memberOldPlansSchema = new mongoose.Schema({
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'members', required: false },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'bookings', required: false },
    old_plan: Object,
    type: String,
}, { versionKey: false, timestamps: true });

const MemberOldPlans = mongoose.model("member_old_plans", memberOldPlansSchema);

export default MemberOldPlans;