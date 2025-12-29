// Setup Database for XAMPP MySQL
require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function setupDatabase() {
  console.log('\n========================================')
  console.log('Database Setup for XAMPP MySQL')
  console.log('========================================\n')

  let connection

  try {
    // Connect to MySQL (without selecting database)
    console.log('Connecting to MySQL...')
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    })
    console.log('✓ Connected!\n')

    // Create database
    const dbName = process.env.DB_NAME || 'sewanagala_sugar_tour'
    console.log(`Creating database: ${dbName}...`)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log('✓ Database created!\n')

    // Select database
    await connection.query(`USE ${dbName}`)

    // Check if tables exist
    const [existingTables] = await connection.query('SHOW TABLES')
    
    if (existingTables.length > 0) {
      console.log('ℹ Database already has tables, skipping schema import...')
      console.log('  (Drop database manually if you want to reimport)\n')
    } else {
      // Read and execute schema.sql
      const schemaPath = path.join(__dirname, 'database', 'schema.sql')
      if (fs.existsSync(schemaPath)) {
        console.log('Importing schema.sql...')
        const schema = fs.readFileSync(schemaPath, 'utf8')
        await connection.query(schema)
        console.log('✓ Schema imported!\n')
      } else {
        console.log('⚠ schema.sql not found, skipping...\n')
      }
    }

    // Read and execute admin_tables.sql (with error handling)
    const adminTablesPath = path.join(__dirname, 'database', 'admin_tables.sql')
    if (fs.existsSync(adminTablesPath)) {
      console.log('Importing admin_tables.sql...')
      try {
        const adminTables = fs.readFileSync(adminTablesPath, 'utf8')
        // Execute each statement separately to handle errors better
        const statements = adminTables.split(';').filter(s => s.trim())
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await connection.query(statement)
            } catch (err) {
              // Ignore "already exists" or "duplicate column" errors
              if (!err.message.includes('already exists') && 
                  !err.message.includes('Duplicate column') &&
                  !err.message.includes("doesn't exist")) {
                console.log(`⚠ Warning: ${err.message}`)
              }
            }
          }
        }
        console.log('✓ Admin tables imported!\n')
      } catch (err) {
        console.log(`⚠ Admin tables warning: ${err.message}\n`)
      }
    } else {
      console.log('⚠ admin_tables.sql not found, skipping...\n')
    }

    // Verify tables
    console.log('Verifying tables...')
    const [tables] = await connection.query('SHOW TABLES')
    
    if (tables.length > 0) {
      console.log('✓ Tables created successfully:')
      tables.forEach(table => {
        const tableName = Object.values(table)[0]
        console.log('  ✓', tableName)
      })
    } else {
      console.log('⚠ No tables found')
    }

    console.log('\n========================================')
    console.log('✅ Database setup completed successfully!')
    console.log('========================================\n')

    console.log('Next steps:')
    console.log('1. Restart the dev server: npm run dev')
    console.log('2. Open: http://localhost:3000')
    console.log('')

  } catch (error) {
    console.error('\n✗ Setup failed!')
    console.error('Error:', error.message)
    console.error('\nPlease check:')
    console.error('1. XAMPP MySQL is running')
    console.error('2. Username and password are correct in .env.local')
    console.error('3. database/schema.sql exists')
    console.error('')
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

setupDatabase()
