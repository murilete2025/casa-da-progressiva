
// src/routes/products.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single product by slug or id
router.get('/:identifier', async (req, res) => {
  const { identifier } = req.params;
  try {
    let query = supabase.from('products').select('*');
    if (identifier.startsWith('p_') || !isNaN(identifier)) {
        query = query.eq('id', identifier);
    } else {
        query = query.eq('slug', identifier);
    }
    
    const { data, error } = await query.single();
    if (error) return res.status(404).json({ error: 'Product not found' });
    res.json(data);
  } catch (err) {
    console.error('Get product error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create/update product (handles both)
router.post('/save', async (req, res) => {
  const product = req.body;
  const { id, slug, name, price, original_price, badge, badge_class, category, stars, image1, image_base64, image2, image2_base64, link, description, featured, visible, order_index, offers, details, cta_link } = product;
  
  try {
    let result;
    if (id && (typeof id === 'number' || id.toString().includes('p_'))) {
        // Update
        const { data, error } = await supabase
            .from('products')
            .update({
                slug, name, price, original_price, badge, badge_class, category, stars, image1, image_base64, image2, image2_base64, link, description, featured, visible, order_index, offers, details, cta_link
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        result = data;
    } else {
        // Insert
        const { data, error } = await supabase
            .from('products')
            .insert([{
                slug, name, price, original_price, badge, badge_class, category, stars, image1, image_base64, image2, image2_base64, link, description, featured, visible, order_index, offers, details, cta_link
            }])
            .select()
            .single();
        if (error) throw error;
        result = data;
    }
    
    // If this product is featured, un-feature others
    if (featured) {
        await supabase.from('products').update({ featured: false }).neq('id', result.id);
    }

    res.json(result);
  } catch (err) {
    console.error('Save product error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
