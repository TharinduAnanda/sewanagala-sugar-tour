# Sewanagala Sugar Factory Tour - Next.js Application

A modern, fully-featured virtual and physical tour booking system built with Next.js, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, and MySQL.

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MySQL
- **Authentication**: JWT
- **File Upload**: Cloudinary

## Features

- 🎨 Modern, responsive UI with Tailwind CSS and shadcn/ui
- ✨ Smooth animations with Framer Motion
- 🗺️ Interactive virtual tour with 14 stations
- 📅 Real-time booking system with slot management
- 👨‍💼 Admin dashboard for managing bookings
- 🔐 Secure authentication with JWT
- 📱 Fully responsive design
- 🎯 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
cd "D:\\Sewanagala Projects\\sewanagala-sugar-tour"
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env.local\` file in the root directory with:

\`\`\`env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sewanagala_sugar_tour

# JWT
JWT_SECRET=your_jwt_secret_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

4. Set up the database:
Import the SQL schema from \`database/schema.sql\` and \`database/admin_tables.sql\`

\`\`\`bash
mysql -u root -p sewanagala_sugar_tour < database/schema.sql
mysql -u root -p sewanagala_sugar_tour < database/admin_tables.sql
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
src/
├── app/
│   ├── api/              # API routes
│   │   ├── admin/        # Admin endpoints
│   │   ├── bookings/     # Booking endpoints
│   │   ├── media/        # Media endpoints
│   │   ├── slots/        # Slot management
│   │   └── stations/     # Station endpoints
│   ├── admin/            # Admin pages
│   ├── booking/          # Booking page
│   ├── station/          # Station detail pages
│   ├── tour/             # Tour page
│   ├── about/            # About page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── StationCard.tsx
│   └── LoadingSpinner.tsx
├── context/
│   └── TourContext.tsx   # Tour state management
├── lib/
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication utilities
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript types
\`\`\`

## API Routes

### Public Routes
- \`GET /api/stations\` - Get all stations
- \`GET /api/stations/[id]\` - Get station by ID
- \`GET /api/media/[stationId]\` - Get station media
- \`GET /api/slots?date=YYYY-MM-DD\` - Get available slots
- \`POST /api/bookings\` - Create booking
- \`GET /api/bookings/[id]\` - Get booking by ID

### Admin Routes (Protected)
- \`POST /api/admin/login\` - Admin login
- \`GET /api/admin/dashboard\` - Dashboard stats
- \`PATCH /api/bookings/[id]\` - Update booking status

## Admin Access

Default admin credentials (change after first login):
- Username: admin
- Password: (set via setupAdmin.js script)

To create an admin user, you'll need to run the setup script from the old server folder or create one manually in the database.

## Database

The application uses MySQL with the following main tables:
- \`stations\` - Tour stations
- \`station_media\` - Media for stations
- \`bookings\` - Tour bookings
- \`tour_slots\` - Available time slots
- \`admins\` - Admin users
- \`factory_closures\` - Holidays and closures

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Migration Notes

This project has been completely migrated from:
- Create React App → Next.js 15
- JavaScript → TypeScript
- CSS → Tailwind CSS
- Custom components → shadcn/ui
- Express server → Next.js API Routes
- React Router → Next.js App Router

All functionality from the original application has been preserved and enhanced with modern best practices.

## License

© 2025 Sewanagala Sugar Factory. All rights reserved.
