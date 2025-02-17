import expressAsyncHandler from "express-async-handler";
import sharp from "sharp";
import Article from "../model/ArticleModel.js";
import Company from "../model/CompanyModel.js";
import ApiFeature from '../middleware/searchHandler.js';
import multer from "multer";
import errorHandler from "../middleware/errorHandler.js";
import { deleteOne, updateOne } from "./handler.js";

const storage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new errorHandler("accepting only images", 400, false));
    }
};
const upload = multer({ storage, fileFilter: multerFilter });
export const uploadArticleImages = upload.any();

export const resizeArticleImages = expressAsyncHandler(async (req, res, next) => {
    if (req.files) {
        const coverFile = req.files.find(file => file.fieldname === "coverImage");
        if (coverFile) {
            const fileName = `article-${Date.now()}-cover.jpeg`;
            await sharp(coverFile.buffer)
                .resize(1200, 1300)
                .toFormat("jpeg")
                .jpeg({ quality: 100 })
                .toFile(`${fileName}`);
            req.body.coverImage = fileName;
        } else if (req.body.coverImage && req.body.coverImage.startsWith('http')) {
            req.body.coverImage = req.body.coverImage;
        }


        const paragraphImageFiles = req.files.filter(file =>
            file.fieldname.startsWith("paragraphs[") && file.fieldname.endsWith("][image]")
        );

        if (paragraphImageFiles.length > 0) {
            if (typeof req.body.paragraphs === "string") {
                req.body.paragraphs = JSON.parse(req.body.paragraphs);
            }
            await Promise.all(paragraphImageFiles.map(async file => {
                const match = file.fieldname.match(/paragraphs\[(\d+)\]\[image\]/);
                if (match) {
                    const index = parseInt(match[1]);
                    const fileName = `article-${Date.now()}-paragraph-${index}.jpeg`;
                    await sharp(file.buffer)
                        .resize(800, 600)
                        .toFormat("jpeg")
                        .jpeg({ quality: 90 })
                        .toFile(`${fileName}`);
                    if (req.body.paragraphs[index]) {
                        req.body.paragraphs[index].image = fileName;
                    }
                }
            }));
        }
    }
    next();
});

export const createArticle = expressAsyncHandler(async (req, res) => {
    console.log('Received body:', req.body);
    const article = await Article.create({
        title: req.body.title,
        coverImage: req.body.coverImage,
        company: req.body.company,
        paragraphs: req.body.paragraphs.map(p => ({
            header: p.header,
            content: p.content,
            image: p.image || undefined
        }))
    });
    res.status(200).json({ message: 'Created Successfully', article });
});

export const getOneArticle = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    const article = await Article.findById(id);
    res.status(200).json({ message: 'Successfully', data: article });
});

export const allArticles = expressAsyncHandler(async (req, res) => {
    const numberOfDocuments = await Article.countDocuments();
    // في حال وجود فلترة
    if (Object.keys(req.query).length > 0) {
        const { service, area, province } = req.query;
        const filters = {};
        if (service) filters.service = service;
        if (area) filters.area = area;
        if (province) filters.province = province;

        const companies = await Company.find(filters).lean();
        const companyIds = companies.map((company) => company._id);
        const articles = await Article.find({
            company: { $in: companyIds },
        })
            .populate("company")
            .lean();
        return res.status(200).json({
            message: 'Success',
            data: articles,
            numberOfDocuments: numberOfDocuments
        });
    }

    const searchMiddleware = new ApiFeature(Article.find(), req.query)
        .filtering()
        .sorting()
        .searching()
        .fields()
        .pagination(numberOfDocuments);
    const { mongooseQuery, paginationResult } = searchMiddleware;
    const articles = await mongooseQuery;

    res.status(200).json({
        message: 'Success',
        data: articles,
        paginationResult: paginationResult,
        numberOfDocuments: numberOfDocuments
    });
});

export const incrementWhatsAppClicks = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(
        id,
        { $inc: { whatsappClicks: 1 } },
        { new: true }
    );
    if (!article) {
        return res.status(404).json({ error: { message: "Article not found" } });
    }
    res.status(200).json({ success: true, data: article });
});

// Increment Phone clicks
export const incrementPhoneClicks = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(
        id,
        { $inc: { phoneClicks: 1 } },
        { new: true }
    );
    if (!article) {
        return res.status(404).json({ error: { message: "Article not found" } });
    }
    res.status(200).json({ success: true, data: article });
});

export const deleteArticle = deleteOne(Article)
export const updateArticle = updateOne(Article)
