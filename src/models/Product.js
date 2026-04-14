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
    rating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5,
      required: false
    },
    ratingCount: { 
      type: Number, 
      default: 0,
      required: false
    },
  },
  { timestamps: true }
);

// In development, the model might be cached with an old schema.
// We delete it so it can be redefined with the new rating fields.
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
