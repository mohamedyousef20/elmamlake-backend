// models/Company.js

import mongoose from "mongoose";
const { Schema } = mongoose;



// Main company schema
const CompanySchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        whatsapp: { type: String, required: true },
        area: { type: String },
        province: { type: String },

        // Array of reviews
        reviews: {
            type: mongoose.Schema.ObjectId,
            ref: "Review"
        },
    },
    { timestamps: true }
);


export default mongoose.model('Company', CompanySchema)