import express from 'express'
import { createCompany, allCompanies, deleteCompany, updateCompany } from '../controller/companyController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';


const router = express.Router();
console.log('route')
router.get('/', allCompanies)


// router.patch('/:id', updateCompany)

// router.delete('/:id', deleteCompany)
// router.use(verifyToken)

router.post('/', createCompany)
router.delete('/delete',deleteCompany)
router.patch('/update', updateCompany)


export default router;