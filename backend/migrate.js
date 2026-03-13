// migrate.js - run database migrations
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Running ${file}...`);
    try {
      await pool.query(sql);
      console.log(`${file} executed successfully`);
    } catch (err) {
      console.error(`Error executing ${file}:`, err);
      process.exit(1);
    }
  }
  await pool.end();
  console.log('All migrations completed');
}

runMigrations();
