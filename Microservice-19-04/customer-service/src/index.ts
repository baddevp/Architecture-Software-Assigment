import express from 'express';
import mongoose from 'mongoose';
import customerRoutes from './routes/customerRoutes';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/customers', customerRoutes);

async function connectDB() {
  try {
    await mongoose.connect('mongodb://mongodb:27017/customer_db', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('Customer Service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
});