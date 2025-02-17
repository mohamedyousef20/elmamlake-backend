import express from 'express'
import { allService, createService, deleteService, resizeImage, updateService, uploadImag } from '../controller/serviceController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';


const router = express.Router();


router.get('/', allService)

// router.get('/:id', getCompany)

// router.patch('/:id', updateCompany)

// router.delete('/:id', deleteCompany)
// router.use(verifyToken)

router.post('/', adminAuthMiddleware ,uploadImag, resizeImage, createService)
router.delete('/delete',deleteService)
router.patch('/update',updateService)


export default router;