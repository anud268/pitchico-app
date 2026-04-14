import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    hasOffer: { type: Boolean, default: false },
    category: { type: String, required: true },
    longDescription: { type: String, required: true },
    images: [{ type: String }],
    features: [{ type: String }],
    advantages: [{ type: String }],
    showOnFrontPage: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
