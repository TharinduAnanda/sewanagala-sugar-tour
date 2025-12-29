// Test Database Connection for XAMPP MySQL
require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')

async function testConnection() {
  console.log('\n========================================')
  console.log('Testing Database Connection...')
  console.log('========================================\n')

  console.log('Configuration:')
  console.log('  Host:', process.env.DB_HOST || '127.0.0.1')
  console.log('  Port:', process.env.DB_PORT || '3306')
  console.log('  User:', process.env.DB_USER || 'root')
  console.log('  Password:', process.env.DB_PASSWORD ? '****' : '(empty)')
  console.log('  Database:', process.env.DB_NAME || 'sewanagala_sugar_tour')
  console.log('')

  try {
    // Test connection
    console.log('Attempting to connect...')
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    })

    console.log('✓ Connected to MySQL server!\n')

    // Check if database exists
    console.log('Checking if database exists...')
    const [databases] = await connection.query('SHOW DATABASES')
    const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'sewanagala_sugar_tour'))

    if (dbExists) {
      console.log('✓ Database exists!\n')

      // Select database
      await connection.query(`USE ${process.env.DB_NAME || 'sewanagala_sugar_tour'}`)

      // Check tables
      console.log('Checking tables...')
      const [tables] = await connection.query('SHOW TABLES')
      
      if (tables.length > 0) {
        console.log('✓ Found tables:')
        tables.forEach(table => {
          const tableName = Object.values(table)[0]
          console.log('  -', tableName)
        })
      } else {
        console.log('⚠ No tables found. You need to import the schema!')
        console.log('\nRun this command:')
        console.log('  mysql -u root -p sewanagala_sugar_tour < database/schema.sql')
      }
    } else {
      console.log('✗ Database does NOT exist!\n')
      console.log('Create the database first:')
      console.log('  1. Open phpMyAdmin (http://localhost/phpmyadmin)')
      console.log('  2. Click "New" to create database')
      console.log('  3. Name it: sewanagala_sugar_tour')
      console.log('  4. Import database/schema.sql')
      console.log('\nOr use MySQL command:')
      console.log('  mysql -u root -p -e "CREATE DATABASE sewanagala_sugar_tour"')
      console.log('  mysql -u root -p sewanagala_sugar_tour < database/schema.sql')
    }

    await connection.end()
    console.log('\n✓ Connection test completed!')
    console.log('========================================\n')

  } catch (error) {
    console.error('\n✗ Connection failed!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('  1. Make sure MySQL is running in XAMPP Control Panel')
    console.error('  2. Check if port 3306 is correct')
    console.error('  3. Verify username/password')
    console.error('  4. Try accessing phpMyAdmin: http://localhost/phpmyadmin')
    console.error('\n========================================\n')
    process.exit(1)
  }
}

testConnection()
