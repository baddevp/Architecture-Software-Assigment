import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
});

export default mongoose.model('Customer', customerSchema);