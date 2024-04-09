import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: string;
}

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;