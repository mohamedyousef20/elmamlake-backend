
import expressAsyncHandler from "express-async-handler";
import Service from "../model/serviceModel.js";
import { uploadSingleImg } from "../middleware/uploadImages.js";
import sharp from "sharp";
import { deleteOne, updateOne } from "./handler.js";
export const uploadImag = uploadSingleImg("image")

//@ CREATE  IMAGE PROCESSING FUNCTION
export const resizeImage = expressAsyncHandler(async (req, res, next) => {
    const fileName = `service${Math.random(100)}-${Date.now()}.webp`;
    if (req.file) {
        await sharp(req.file.buffer).resize(500, 500).toFormat("webp").jpeg({ quality: 90 }).toFile(`${fileName}`);
        req.body.image = fileName;
    }

    next();
})

export const createService = expressAsyncHandler(async (req, res) => {

    console.log('The body send from frontend', req.body)
    const service = await Service.create(req.body);
    res.status(200).json({ message: 'Created Successfully', service});
});


export const allService = expressAsyncHandler(async (req, res) => {

    const service = await Service.find()
    const numberOfDocuments = await Service.countDocuments();

    res.status(200).json({ message: 'Success', data: service, numberOfDocument: numberOfDocuments })
});

export const deleteService = deleteOne(Service);
export const updateService = updateOne(Service);