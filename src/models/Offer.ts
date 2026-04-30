import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  title: string;
  description: string;
  iconName: string;
  image?: string;
  features: string[];
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true, default: "Zap" },
    image: { type: String },
    features: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
