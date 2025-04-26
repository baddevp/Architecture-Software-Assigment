import { Router } from 'express';
import Order from '../models/Order';
import amqp from 'amqplib';

const router = Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Publish to RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('order_queue');
    channel.sendToQueue('order_queue', Buffer.from(JSON.stringify(order)));
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Cancel order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;