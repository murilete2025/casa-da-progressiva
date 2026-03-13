
// src/routes/search.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AI Semantic Search
router.get('/ai', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });

    try {
        console.log(`AI Search for: "${q}"`);
        
        // 1. Generate embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: q,
        });
        const queryEmbedding = embeddingResponse.data[0].embedding;

        // 2. Search database using match_products function
        // Note: match_products must be created in Supabase SQL Editor
        const { data, error } = await supabase.rpc('match_products', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3, // Adjust for sensitivity
            match_count: 5
        });

        if (error) {
            console.error('RPC Error:', error.message);
            // Fallback to text search if RPC fails
            const { data: textData } = await supabase
                .from('products')
                .select('*')
                .ilike('name', `%${q}%`)
                .limit(5);
            return res.json(textData || []);
        }

        res.json(data);
    } catch (err) {
        console.error('AI Search Error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
