import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';
import amqp from 'amqplib';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/products', productRoutes);

async function connectDB() {
  try {
    await mongoose.connect('mongodb://mongodb:27017/product_db', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log('Product Service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('product_queue');
    console.log('Product Service connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}

connectDB();
connectRabbitMQ();

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});