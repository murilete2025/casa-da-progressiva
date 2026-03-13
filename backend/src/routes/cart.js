
// src/routes/cart.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET cart by session or user
router.get('/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const { user_id } = req.query;
    
    try {
        let query = supabase.from('cart_items').select('*, products(*)');
        if (user_id) {
            query = query.eq('user_id', user_id);
        } else {
            query = query.eq('session_id', session_id);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add/update item
router.post('/', async (req, res) => {
    const { session_id, user_id, product_id, quantity } = req.body;
    try {
        // Check if item exists
        let query = supabase.from('cart_items').select('*').eq('product_id', product_id);
        if (user_id) query = query.eq('user_id', user_id);
        else query = query.eq('session_id', session_id);

        const { data: existing } = await query.single();

        if (existing) {
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + (quantity || 1), updated_at: new Date() })
                .eq('id', existing.id)
                .select();
            if (error) throw error;
            return res.json(data[0]);
        } else {
            const { data, error } = await supabase
                .from('cart_items')
                .insert([{ session_id, user_id, product_id, quantity: quantity || 1 }])
                .select();
            if (error) throw error;
            return res.json(data[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('cart_items').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
