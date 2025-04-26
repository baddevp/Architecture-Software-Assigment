import { Router } from 'express';
import Customer from '../models/Customer';

const router = Router();

// Create customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;