import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { get, set } from '../utils/cache';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const { userId, content, imageUrl, videoUrl } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPost = new Post({
      author: userId,
      content,
      imageUrl,
      videoUrl,
      likes: [],
      comments: [],
    });

    const savedPost = await newPost.save();

    // Cache the post
    await set(`post:${savedPost._id}`, savedPost.toObject());

    return res.status(201).json(savedPost);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single post
export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if the post is cached
    const cachedPost = await get(`post:${id}`);
    if (cachedPost) {
      return res.json(cachedPost);
    }

    const post = await Post.findById(id)
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Cache the post
    await set(`post:${post._id}`, post.toObject());

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, imageUrl, videoUrl } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, imageUrl, videoUrl },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Cache the updated post
    await set(`post:${updatedPost._id}`, updatedPost.toObject());

    return res.json(updatedPost);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Remove the deleted post from cache
    await set(`post:${id}`, null);

    return res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user feed
export const getUserFeed = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('followingUsers');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followingUserIds = user.followingUsers.map((user) => user._id);
    const posts = await Post.find({ author: { $in: [...followingUserIds, userId] } })
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

    // Cache the user feed
    await set(`feed:${userId}`, posts);

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};