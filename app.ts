import express, { Application } from 'express';
import errorHandler from './src/middleware/errorHandler';
import authRoutes from './src/routes/auth';
import postsRoutes from './src/routes/posts';
import likesRoutes from './src/routes/likes';
import commentsRoutes from './src/routes/comments';
import authMiddleware from './src/middleware/authMiddleware';
import { connectToDatabase } from './src/utils/database';

export const app: Application = express();

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts',authMiddleware, postsRoutes);
app.use('/api/posts/:postId/likes', authMiddleware, likesRoutes);
app.use('/api/posts/:postId/comments', authMiddleware, commentsRoutes);
app.use(errorHandler);

// Routes

// Database connection
connectToDatabase()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

