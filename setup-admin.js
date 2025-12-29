const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
  console.log('Setting up admin user...\n');

  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sewanagala_sugar_tour'
  });

  try {
    // Create admins table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin exists
    const [existing] = await connection.query('SELECT id FROM admins WHERE username = ?', ['admin']);
    
    if (existing.length > 0) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('\nIf you forgot the password, delete the admin record and run this script again.');
    } else {
      // Create default admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.query(
        'INSERT INTO admins (username, password, email, role) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin@sewanagala.com', 'admin']
      );
      
      console.log('SUCCESS: Admin user created!\n');
      console.log('Login credentials:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('\nLogin at: http://localhost:3000/admin/login');
      console.log('\nIMPORTANT: Change the password after first login!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

setupAdmin().catch(console.error);
