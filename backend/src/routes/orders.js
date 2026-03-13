
// src/routes/orders.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET all orders (admin only - simplified here)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Get orders error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new order
router.post('/', async (req, res) => {
    const { 
        user_id, 
        customer_name, 
        customer_email, 
        customer_phone, 
        address, 
        city, 
        neighborhood, 
        items, 
        payment_method,
        total_price
    } = req.body;

    try {
        // 1. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id,
                customer_name,
                customer_email,
                customer_phone,
                address,
                city,
                neighborhood,
                payment_method,
                total_price,
                status: 'pending'
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        res.json({ message: 'Order created successfully', order_id: order.id });
    } catch (err) {
        console.error('Create order error:', err.message);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// PATCH order status
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Update status error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
