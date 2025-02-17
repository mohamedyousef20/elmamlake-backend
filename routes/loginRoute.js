import express from 'express'
import checkAdminCredentials from '../controller/loginController.js';


const router = express.Router();


router.post('/', checkAdminCredentials)


export default router;