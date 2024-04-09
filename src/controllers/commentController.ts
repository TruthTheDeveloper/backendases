// controllers/commentController.js
import { Request, Response } from "express";

import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';

// Create a new comment
export const createComment = async (req:Request, res:Response) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newComment = new Comment({
      author: userId,
      post: postId,
      content,
    });

    const savedComment = await newComment.save();
    post.comments.push(savedComment._id);
    await post.save();

    return res.status(201).json(savedComment);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a comment
export const deleteComment = async (req:Request, res:Response) => {
  const { postId, commentId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    post.comments = post.comments.filter((commentId) => commentId.toString() !== commentId.toString());
    await post.save();

    await Comment.findByIdAndDelete(commentId);

    return res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
