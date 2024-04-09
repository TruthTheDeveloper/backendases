import express from 'express';
import { createPost, deletePost, getPost, getUserFeed, updatePost } from '../controllers/postController';

const router = express.Router();

// Create a new post
router.post('/', createPost);

// Get a single post
router.get('/:id', getPost);

// Update a post
router.put('/:id', updatePost);

// Delete a post
router.delete('/:id', deletePost);

// Get user feed
router.get('/feed/:userId', getUserFeed);

export default router;