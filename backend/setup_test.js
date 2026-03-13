
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function setup() {
  // Use the exact same string from .env
  const connectionString = process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'options=project%3Dunyhkipybaocyadnfahs';
  console.log('Connecting with options...');

  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Database');
    // ... rest of the script ...
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'customer',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER,
          product_name TEXT NOT NULL,
          quantity INTEGER DEFAULT 1,
          price DECIMAL(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          user_id INTEGER REFERENCES users(id),
          product_id INTEGER,
          quantity INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(sql);
    console.log('Tables created');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

setup();
