import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, required: true },
});

export default mongoose.model('Product', productSchema);