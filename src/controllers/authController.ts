import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// User registration
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
      // Check if the username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();
  
      // Return the user information without the password
      const userInfo = savedUser.toObject();
      delete userInfo?.password;
  
      return res.status(201).json(userInfo);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// User login
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1d' });
  
      // Return the user information and the token
      const userInfo = user.toObject();
      delete  userInfo?.password;
  
      return res.json({ user: userInfo, token });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};