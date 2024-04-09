import mongoose from 'mongoose';

let database: mongoose.Connection;

export const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect('mongodb://localhost:27017/social-media', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    database = connection.connection;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await database.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};