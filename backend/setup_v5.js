
const { Client } = require('pg');

async function setup() {
  const client = new Client({ 
    user: 'postgres',
    host: 'db.unyhkipybaocyadnfahs.supabase.co',
    database: 'postgres',
    password: 'murilete2012', // Trying without #
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });
  try {
    console.log('Connecting to Supabase direct host (no #)...');
    await client.connect();
    console.log('Connected!');
    // ... rest of DDL
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}
setup();
