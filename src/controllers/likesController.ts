import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";

export const createLikes = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User has already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    return res.json({ message: "Post liked successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLikes = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "User has not liked this post" });
    }

    post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
    await post.save();

    return res.json({ message: "Post unliked successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
