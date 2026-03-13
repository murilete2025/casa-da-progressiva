
// src/routes/categories.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get categories error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST save category
router.post('/save', async (req, res) => {
  const { id, name, slug, link, active } = req.body;
  try {
    let result;
    if (id) {
        const { data, error } = await supabase
            .from('categories')
            .update({ name, slug, link, active })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        result = data;
    } else {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, slug, link, active }])
            .select()
            .single();
        if (error) throw error;
        result = data;
    }
    res.json(result);
  } catch (err) {
    console.error('Save category error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
