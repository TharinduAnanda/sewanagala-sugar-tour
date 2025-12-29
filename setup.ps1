# Sewanagala Sugar Tour - Setup Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Sewanagala Sugar Tour Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check MySQL
Write-Host "Checking MySQL..." -ForegroundColor Yellow
$mysqlVersion = mysql --version 2>$null
if ($mysqlVersion) {
    Write-Host "✓ MySQL found" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL not found in PATH. Make sure MySQL is installed" -ForegroundColor Yellow
}

Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local file found" -ForegroundColor Green
} else {
    Write-Host "⚠ .env.local file not found" -ForegroundColor Yellow
    Write-Host "  Creating from template..." -ForegroundColor Yellow
    
    $envContent = @"
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sewanagala_sugar_tour

# JWT
JWT_SECRET=your_jwt_secret_here_change_in_production

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
NODE_ENV=development
"@
    
    Set-Content -Path ".env.local" -Value $envContent
    Write-Host "✓ .env.local created. Please update with your actual values!" -ForegroundColor Green
}

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.local with your database credentials"
Write-Host "2. Import database schema:"
Write-Host "   mysql -u root -p sewanagala_sugar_tour < database/schema.sql"
Write-Host "3. Run development server:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
