# 🚀 Quick Start Guide

## Get Started in 5 Minutes!

### Step 1: Install Dependencies
```powershell
cd "D:\Sewanagala Projects\sewanagala-sugar-tour"
npm install
```

### Step 2: Configure Database
1. Open `.env.local` file
2. Update database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sewanagala_sugar_tour
```

### Step 3: Import Database
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

### Step 4: Run Development Server
```powershell
npm run dev
```

### Step 5: Open in Browser
Visit: **http://localhost:3000**

## 🎉 That's It!

Your application is now running with:
- ✅ Next.js 15
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion
- ✅ shadcn/ui
- ✅ MySQL Database

## 📋 Quick Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔑 Admin Access

To create an admin user, run this SQL:
```sql
-- First, generate password hash in Node.js:
-- const bcrypt = require('bcryptjs');
-- console.log(bcrypt.hashSync('your_password', 10));

INSERT INTO admins (username, email, password, role) 
VALUES ('admin', 'admin@sewanagala.lk', 'YOUR_BCRYPT_HASH', 'admin');
```

Then login at: **http://localhost:3000/admin/login**

## 🎯 Key URLs

- **Home**: http://localhost:3000
- **Virtual Tour**: http://localhost:3000/tour
- **Book Tour**: http://localhost:3000/booking
- **About**: http://localhost:3000/about
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 🆘 Need Help?

Check these files:
- `README.md` - Full documentation
- `MIGRATION_GUIDE.md` - Migration details
- `DEPLOYMENT.md` - Deployment options
- `CONVERSION_COMPLETE.md` - What was done

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Type Safety**: TypeScript catches errors before runtime
3. **Tailwind**: Use utility classes for styling
4. **API Routes**: Backend at `src/app/api/*`
5. **Components**: Reusable UI in `src/components/*`

Happy coding! 🎨
