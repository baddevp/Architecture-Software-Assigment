import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
  customerId: { type: String, required: true },
  products: [{ productId: String, quantity: Number }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

export default mongoose.model('Order', orderSchema);