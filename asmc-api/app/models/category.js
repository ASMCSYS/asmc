import mongoose from "mongoose";

var categorySchema = new mongoose.Schema({
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: false },
    title: String,
    status: {
        type: Boolean,
        default: false
    },
}, { versionKey: false, timestamps: true });

const Category = mongoose.model("category", categorySchema);

export default Category;