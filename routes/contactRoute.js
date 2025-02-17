import express from 'express'
import sendEmailHandler from '../middleware/email.js';


const router = express.Router();

router.post('/', sendEmailHandler)

export default router;