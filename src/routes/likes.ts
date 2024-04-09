import express from 'express';
import { createLikes, deleteLikes } from '../controllers/likesController';

const router = express.Router();

// Like a post
router.post('/:postId', createLikes);

// Unlike a post
router.delete('/:postId', deleteLikes);

export default router;