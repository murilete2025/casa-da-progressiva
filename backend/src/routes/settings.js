
// src/routes/settings.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET settings by key
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data ? data.value : {});
  } catch (err) {
    console.error('Get settings error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST save settings
router.post('/:key', async (req, res) => {
  const { key } = req.params;
  const value = req.body;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date() })
      .select()
      .single();
    if (error) throw error;
    res.json(data.value);
  } catch (err) {
    console.error('Save settings error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
