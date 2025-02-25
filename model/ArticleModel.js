import mongoose from "mongoose";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import fs from 'fs'
const { Schema } = mongoose;

const ArticleSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "title required"],
        },
        coverImage: {
            type: String,
        },
        cloudinaryId: {
            type: String,
            // required: true
        },
        paragraphs: [
            {
                header: { type: String, required: true },
                content: { type: String, required: true },
                image: { type: String },
            },
        ],
        whatsappClicks: { type: Number, default: 0 },
        phoneClicks: { type: Number, default: 0 },
        // Reference to the Company model
        company: {
            type: mongoose.Schema.ObjectId,
            ref: "Company",
        },
    },
    { timestamps: true }
);

// Populate the company field when querying articles
ArticleSchema.pre(/^find/, function (next) {
    this.populate({
        path: "company",
        select: "name phone whatsapp area province",
    });
    next();
});
ArticleSchema.pre('save', async function (next) {
    try {
        // Validate coverImage
        if (this.coverImage && typeof this.coverImage === 'string') {
            console.log(this.coverImage.includes('https'), 'is image cover uploaded to cloud');

            // Check if the image is already a Cloudinary URL
            if (!this.coverImage.includes('https')) {
                console.log('Image is not a Cloudinary URL, uploading to Cloudinary...');

                // Delete old coverImage from Cloudinary if it exists
                if (this.cloudinaryId) {
                    await deleteImageFromCloudinary(this.cloudinaryId);
                }

                // Upload new coverImage to Cloudinary
                const uploadResult = await uploadImageToCloudinary(this.coverImage);
                await fs.promises.unlink(this.coverImage)

                if (uploadResult && uploadResult.public_id && uploadResult.secure_url) {
                    this.cloudinaryId = uploadResult.public_id;
                    this.coverImage = uploadResult.secure_url;

                    // Delete the local file after uploading to Cloudinary
                    if (fs.existsSync(this.coverImage)) {
                        await fs.promises.unlink(this.coverImage);
                    }
                } else {
                    throw new Error('Failed to upload coverImage to Cloudinary');
                }
            } else {
                console.log('Image is already a Cloudinary URL, skipping upload.');
            }
        }

        // Validate paragraphs images 

        if (this.paragraphs && Array.isArray(this.paragraphs)) {
            for (let i = 0; i < this.paragraphs.length; i++) {
                const paragraph = this.paragraphs[i];
                if (paragraph.image && typeof paragraph.image === 'string' && !paragraph.image.includes('https')) {
                    console.log('Uploading paragraph image to Cloudinary:', paragraph.image);
                    const uploadResult = await uploadImageToCloudinary(paragraph.image);
                    if (uploadResult && uploadResult.public_id && uploadResult.secure_url) {
                        // Update the paragraph's image URL and optionally store Cloudinary ID
                        paragraph.image = uploadResult.secure_url;
                        if (fs.existsSync(this.coverImage)) {
                            await fs.promises.unlink(this.coverImage);
                        }
                    } else {
                        throw new Error('Failed to upload a paragraph image to Cloudinary');
                    }
                }
            }
        }

        next();
    } catch (err) {
        console.error('Error in pre-save middleware:', err);
        next(err);
    }
});


export default mongoose.model("Article", ArticleSchema);