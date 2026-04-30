import mongoose, { Schema, Document } from "mongoose";

export interface IWork extends Document {
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  tags: string[];
  iconName: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    iconName: { type: String, required: true, default: "Layout" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Work || mongoose.model<IWork>("Work", WorkSchema);
