import { Router } from 'express';
import uploadRoutes from './uploadRoutes.js';
// Import other route files here if you have more in the future

const router = Router();

// Mount the upload routes
router.use('/upload', uploadRoutes);



export default router;
