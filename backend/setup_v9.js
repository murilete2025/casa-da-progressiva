
const { Client } = require('pg');
const dns = require('dns').promises;

async function setup() {
  try {
    const host = 'aws-0-sa-east-1.pooler.supabase.com';
    const entries = await dns.resolve4(host);
    const ip = entries[0];
    console.log(`Resolved ${host} to ${ip}`);

    const client = new Client({ 
      user: 'postgres.unyhkipybaocyadnfahs',
      host: ip, 
      database: 'postgres',
      password: 'murilete2012#',
      port: 5432,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('Connected!');
    
    const sql = `
      -- Categories Table
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          link TEXT,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Site Settings Table
      CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Fix Products Table
      ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
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
    `;

    await client.query(sql);
    console.log('DDL executed successfully');
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}
setup();
