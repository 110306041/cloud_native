import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { handleRequest } from '../controllers/submissionController.js';

const router = express.Router();

// Route that triggers the dynamic WebSocket operation
router.post('/send-websocket',authenticateToken, handleRequest);

export default router;
