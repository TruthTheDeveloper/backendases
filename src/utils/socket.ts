import { Server, Socket } from 'socket.io';
import http from 'http';
import {app} from '../../app';
import Post from '../models/Post';
import User from '../models/User';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Event handler for creating a new post
  socket.on('createPost', async (data) => {
    const { userId, content, imageUrl, videoUrl } = data;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return;
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

      // Emit the new post to all connected clients
      io.emit('postCreated', savedPost);
    } catch (err) {
      console.error(err);
    }
  });

  // Event handler for liking a post
  socket.on('likePost', async (data) => {
    const { postId, userId } = data;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        return;
      }

      if (post.likes.includes(userId)) {
        return;
      }

      post.likes.push(userId);
      const updatedPost = await post.save();

      // Emit the updated post to all connected clients
      io.emit('postUpdated', updatedPost);
    } catch (err) {
      console.error(err);
    }
  });

  // Add event handlers for other actions (e.g., commenting, unliking, etc.)
});

export default server;