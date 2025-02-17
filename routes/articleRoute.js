import express from 'express'
import { allArticles, createArticle, deleteArticle, getOneArticle, incrementPhoneClicks, incrementWhatsAppClicks, resizeArticleImages, updateArticle, uploadArticleImages } from '../controller/articleController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';


const router = express.Router();
console.log('route')
router.get('/', allArticles)


// router.patch('/:id', updateCompany)

// router.delete('/:id', deleteCompany)
// router.use(verifyToken)

router.get('/:id', getOneArticle)
router.patch('/:id/whatsapp-click', incrementWhatsAppClicks);
router.patch('/:id/phone-click', incrementPhoneClicks);
router.post('/', uploadArticleImages, resizeArticleImages, createArticle)
router.delete('/delete',deleteArticle)
router.patch('/update',updateArticle)



export default router;