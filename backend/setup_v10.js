
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function setup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
  }

  const client = new Client({ 
    user: 'postgres.unyhkipybaocyadnfahs',
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    database: 'postgres',
    password: 'murilete2012#',
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Database');

    const sql = `
      -- 1. Users Table
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'customer',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 2. Orders Table
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          neighborhood TEXT,
          status TEXT DEFAULT 'pending', 
          total_price DECIMAL(10,2) NOT NULL,
          payment_method TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 3. Order Items Table
      CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER,
          product_name TEXT NOT NULL,
          quantity INTEGER DEFAULT 1,
          price DECIMAL(10,2) NOT NULL
      );

      -- 4. Cart Items Table
      CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          user_id INTEGER REFERENCES users(id),
          product_id INTEGER,
          quantity INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- pgvector and AI search
      DO $$ BEGIN
          CREATE EXTENSION IF NOT EXISTS vector;
      EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not create vector extension.';
      END $$;

      DO $$ BEGIN
          ALTER TABLE products ADD COLUMN IF NOT EXISTS embedding vector(1536);
      EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not add embedding column.';
      END $$;

      CREATE OR REPLACE FUNCTION match_products (
        query_embedding vector(1536),
        match_threshold float,
        match_count int
      )
      RETURNS TABLE (
        id int,
        name text,
        slug text,
        description text,
        price text,
        image text,
        similarity float
      )
      LANGUAGE plpgsql
      AS $func$
      BEGIN
        RETURN QUERY
        SELECT
          p.id,
          p.name,
          p.slug,
          p.description,
          p.price,
          p.image,
          1 - (p.embedding <=> query_embedding) AS similarity
        FROM products p
        WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
        ORDER BY similarity DESC
        LIMIT match_count;
      END;
      $func$;
    `;

    await client.query(sql);
    console.log('Database Migration v10 (Orders & Cart) successful');

  } catch (err) {
    console.error('Error in Migration v10:', err);
  } finally {
    await client.end();
  }
}

setup();
