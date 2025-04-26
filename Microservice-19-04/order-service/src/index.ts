import express from 'express';
import mongoose from 'mongoose';
import orderRoutes from './routes/orderRoutes';
import amqp from 'amqplib';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/orders', orderRoutes);

async function connectDB() {
  try {
    await mongoose.connect('mongodb://mongodb:27017/order_db', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('Order Service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('order_queue');
    channel.consume('order_queue', (msg) => {
      if (msg) {
        console.log('Order created:', msg.content.toString());
        channel.ack(msg);
      }
    });
    console.log('Order Service connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}

connectDB();
connectRabbitMQ();

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});