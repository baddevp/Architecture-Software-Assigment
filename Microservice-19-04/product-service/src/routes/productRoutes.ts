import { Router } from 'express';
import Product from '../models/Product';

const productRoutes = Router();

// Create product
productRoutes.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get product by ID
productRoutes.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update product
productRoutes.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
productRoutes.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default productRoutes;