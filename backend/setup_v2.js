
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

async function setup() {
  console.log('Connecting to:', connectionString.replace(/:[^:@]+@/, ':****@'));
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const sql = `
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          link TEXT,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Check if products needs updating
      DO $$ 
      BEGIN 
          BEGIN
              ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
          EXCEPTION WHEN others THEN RAISE NOTICE 'slug already exists or error';
          END;
          
          ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_class TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 5;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS image_base64 TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS image2 TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS image2_base64 TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS link TEXT;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS offers JSONB DEFAULT '[]'::jsonb;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
          ALTER TABLE products ADD COLUMN IF NOT EXISTS cta_link TEXT;
      END $$;
    `;

    await client.query(sql);
    console.log('Tables updated successfully');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

setup();
