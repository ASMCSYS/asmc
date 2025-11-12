import mongoose from "mongoose";

var plansSchema = new mongoose.Schema({
    plan_id: {
        type: String,
        unique: true
    },
    plan_name: String,
    plan_type: {
        type: String,
        enum: ["membership", "enrollment", "booking", "hall"],
    },
    description: String,
    amount: {
        type: Number,
        default: 0
    },
    batch_hours: {
        type: Number,
        default: 0
    },
    dependent_member_price: {
        type: Number,
        default: 0
    },
    non_dependent_member_price: {
        type: Number,
        default: 0
    },
    kids_price: {
        type: Number,
        default: 0
    },
    guest_price: {
        type: Number,
        default: 0
    },
    plan_timeline: {
        type: String,
        default: null
    },
    start_month: {
        type: Number,
        default: 0
    },
    end_month: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
}, { versionKey: false, timestamps: true });

plansSchema.pre("save", async function (next) {
    const plan = this;
    plan.plan_id = plan._id;
    next();
});

const Plans = mongoose.model("plans", plansSchema);

export default Plans;