
import expressAsyncHandler from "express-async-handler";
import Company from "../model/CompanyModel.js";
import { deleteOne, updateOne } from "./handler.js";

export const createCompany = expressAsyncHandler(async (req, res) => {

    console.log('2')
    const company = await Company.create(req.body);
    res.status(200).json({ message: 'Created Successfully', company });
});


export const allCompanies = expressAsyncHandler(async (req, res) => {

    const companies = await Company.find()
    const numberOfDocuments = await Company.countDocuments();

    res.status(200).json({ message: 'Success', data: companies, numberOfDocument: numberOfDocuments })
});

export const deleteCompany = deleteOne(Company);
export const updateCompany = updateOne(Company);