# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- MySQL 8 or higher
- npm or yarn package manager

## Local Development Setup

### 1. Clone and Install

```bash
cd "D:\Sewanagala Projects\sewanagala-sugar-tour"
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=sewanagala_sugar_tour

# JWT Secret (change this to a random string)
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Application URL
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Set Up Database

Import the database schema:

```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE sewanagala_sugar_tour;
USE sewanagala_sugar_tour;
SOURCE database/schema.sql;
SOURCE database/admin_tables.sql;
```

### 4. Create Admin User

You'll need to create an admin user manually or use a script. Here's a manual method:

```sql
-- Hash a password (use bcrypt with 10 rounds)
-- For password "admin123", the hash would be generated via bcrypt
INSERT INTO admins (username, email, password, role) 
VALUES ('admin', 'admin@sewanagala.lk', '$2a$10$...your_bcrypt_hash', 'admin');
```

Or use Node.js to generate hash:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
```

### 5. Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

## Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your_repo_url
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set up MySQL Database**
   - Use a cloud MySQL service (AWS RDS, DigitalOcean, PlanetScale)
   - Update `DB_HOST` in Vercel environment variables

### Option 2: VPS/Cloud Server (Ubuntu)

1. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Deploy Application**
```bash
# Clone repository
cd /var/www
git clone your_repo_url sewanagala-sugar-tour
cd sewanagala-sugar-tour

# Install dependencies
npm install

# Create .env.local with production values
nano .env.local

# Build application
npm run build

# Start with PM2
pm2 start npm --name "sewanagala-tour" -- start
pm2 save
pm2 startup
```

3. **Set Up Nginx Reverse Proxy**
```bash
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/sewanagala-tour
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sewanagala-tour /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Set Up SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
      MYSQL_DATABASE: sewanagala_sugar_tour
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  mysql_data:
```

Deploy:
```bash
docker-compose up -d
```

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Staging
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://staging.yoursite.com
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://www.yoursite.com
```

## Post-Deployment Checklist

- [ ] Database is created and schema imported
- [ ] Admin user is created
- [ ] Environment variables are set correctly
- [ ] Application builds without errors
- [ ] All pages are accessible
- [ ] Booking system works
- [ ] Admin dashboard is functional
- [ ] SSL certificate is installed (production)
- [ ] Backups are configured
- [ ] Monitoring is set up

## Maintenance

### Database Backup
```bash
mysqldump -u root -p sewanagala_sugar_tour > backup_$(date +%Y%m%d).sql
```

### Application Updates
```bash
git pull
npm install
npm run build
pm2 restart sewanagala-tour
```

### View Logs
```bash
# PM2 logs
pm2 logs sewanagala-tour

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Issue: Database connection fails
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env.local`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue: Port 3000 already in use
- Find process: `lsof -i :3000`
- Kill process: `kill -9 PID`
- Or change port in package.json: `"start": "next start -p 3001"`

### Issue: Permission errors
```bash
sudo chown -R $USER:$USER /var/www/sewanagala-sugar-tour
chmod -R 755 /var/www/sewanagala-sugar-tour
```

## Security Recommendations

1. **Change default passwords** immediately after deployment
2. **Use strong JWT_SECRET** (at least 32 random characters)
3. **Enable HTTPS** in production
4. **Regular backups** of database
5. **Keep dependencies updated**: `npm audit fix`
6. **Use environment variables** for all sensitive data
7. **Implement rate limiting** for API routes
8. **Set up monitoring** (e.g., UptimeRobot, Sentry)

## Performance Optimization

1. **Enable caching** in Nginx
2. **Use CDN** for static assets
3. **Optimize images** (Next.js does this automatically)
4. **Database indexing** on frequently queried columns
5. **Connection pooling** for database (already implemented)

## Support

For deployment issues, check:
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- MySQL Documentation: https://dev.mysql.com/doc/
- PM2 Documentation: https://pm2.keymetrics.io/
