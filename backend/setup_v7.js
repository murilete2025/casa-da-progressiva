
const { Client } = require('pg');

async function setup() {
  const client = new Client({ 
    user: 'postgres.unyhkipybaocyadnfahs',
    host: 'aws-0-sa-east-1.pooler.supabase.com', 
    database: 'postgres',
    password: 'murilete2012.', // Candidate 3
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });
  try {
    console.log('Connecting via pooler DNS with murilete2012. ...');
    await client.connect();
    console.log('Connected!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}
setup();
