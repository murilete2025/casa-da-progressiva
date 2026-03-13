
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const regions = [
  'sa-east-1',
  'us-east-1'
];

async function tryConnect(region, port) {
  console.log(`Trying region ${region} on port ${port}...`);
  const client = new Client({ 
    user: 'postgres.unyhkipybaocyadnfahs',
    host: `aws-0-${region}.pooler.supabase.com`,
    database: 'postgres',
    password: 'murilete2012#',
    port: port,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log(`Connected to PostgreSQL via ${region}:${port}`);
    return client;
  } catch (err) {
    console.warn(`Failed ${region}:${port}: ${err.message}`);
    return null;
  }
}

async function setup() {
  let client = null;
  for (const region of regions) {
    for (const port of [5432, 6543]) {
        client = await tryConnect(region, port);
        if (client) break;
    }
    if (client) break;
  }

  if (!client) {
    console.error("Could not connect to any pooler region.");
    process.exit(1);
  }

  try {
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

      -- Products Table
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          price TEXT,
          original_price TEXT,
          badge TEXT,
          badge_class TEXT,
          category TEXT,
          stars INTEGER DEFAULT 5,
          image TEXT,
          image_base64 TEXT,
          image2 TEXT,
          image2_base64 TEXT,
          link TEXT,
          description TEXT,
          featured BOOLEAN DEFAULT false,
          visible BOOLEAN DEFAULT true,
          order_index INTEGER DEFAULT 0,
          offers JSONB DEFAULT '[]'::jsonb,
          details JSONB DEFAULT '{}'::jsonb,
          cta_link TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Site Settings Table
      CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Default Home Data
      INSERT INTO site_settings (key, value)
      VALUES ('home_data', '{
          "announcementBar": "Frete grátis para todo o Brasil &nbsp;·&nbsp; Pagamento somente na entrega &nbsp;·&nbsp; Sem cartão antecipado",
          "heroBanners": [],
          "catBanners": [],
          "sectionTitle": "Todos os nossos",
          "sectionTitleEm": "produtos",
          "sectionSubtitle": "Frete grátis para todo o Brasil. Pagamento somente na entrega."
      }')
      ON CONFLICT (key) DO NOTHING;
    `;

    await client.query(sql);
    console.log('Tables created or updated successfully');

  } catch (err) {
    console.error('Error setting up tables:', err);
  } finally {
    if (client) await client.end();
  }
}

setup();
