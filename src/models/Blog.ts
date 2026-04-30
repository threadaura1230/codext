import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  readTime: string;
  isFeatured: boolean;
  isActive: boolean;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: "General" },
    image: { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    author: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
