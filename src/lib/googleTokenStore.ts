import db from './db'

const TABLE = 'google_tokens'

async function ensureTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${TABLE} (
        id INT PRIMARY KEY DEFAULT 1,
        access_token TEXT,
        refresh_token TEXT,
        scope TEXT,
        token_type VARCHAR(50),
        expiry_date BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
  } catch (e) {
    console.error('Error ensuring google_tokens table:', e)
  }
}

export async function getTokens() {
  await ensureTable()
  const [rows] = await db.query<any[]>(`SELECT * FROM ${TABLE} WHERE id = 1`)
  return rows[0] || null
}

export async function saveTokens(tokens: any) {
  await ensureTable()
  const { access_token, refresh_token, scope, token_type, expiry_date } = tokens
  
  const [existing] = await db.query<any[]>(`SELECT id FROM ${TABLE} WHERE id = 1`)
  
  if (existing.length) {
    await db.query(
      `UPDATE ${TABLE} SET 
        access_token = ?, 
        refresh_token = COALESCE(?, refresh_token), 
        scope = ?, 
        token_type = ?, 
        expiry_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`,
      [access_token || null, refresh_token || null, scope || null, token_type || null, expiry_date || null]
    )
  } else {
    await db.query(
      `INSERT INTO ${TABLE} (id, access_token, refresh_token, scope, token_type, expiry_date) 
       VALUES (1, ?, ?, ?, ?, ?)`,
      [access_token || null, refresh_token || null, scope || null, token_type || null, expiry_date || null]
    )
  }
}
