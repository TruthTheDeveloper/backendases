// routes/commentRoutes.js

import express from 'express';
import { createComment, deleteComment } from '../controllers/commentController';

const router = express.Router();

// Create a new comment
router.post('/:postId', createComment);

// Delete a comment
router.delete('/:postId/:commentId', deleteComment);

export default router;
