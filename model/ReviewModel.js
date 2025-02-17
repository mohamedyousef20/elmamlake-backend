// Schema for company reviews
import mongoose from "mongoose";
const { Schema } = mongoose;



const ReviewSchema = new Schema(
    {
        reviewer: { type: String, required: true }, // Name or identifier of the reviewer
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema)