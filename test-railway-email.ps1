# Test Railway Email Configuration
# This script tests if email service is working on Railway deployment

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Railway Email Service Test" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$railwayUrl = "https://sewanagala-sugar-tour-production.up.railway.app"
$testEndpoint = "$railwayUrl/api/test-email-send"

Write-Host "Testing email service at: $testEndpoint" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Sending test request..." -ForegroundColor White
    $response = Invoke-RestMethod -Uri $testEndpoint -Method GET -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Email Service Status:" -ForegroundColor Green
        Write-Host "  ✓ Connection: OK" -ForegroundColor Green
        Write-Host "  ✓ Email sent to: $($response.details.recipient)" -ForegroundColor Green
        Write-Host "  ✓ Booking ID: $($response.details.bookingId)" -ForegroundColor Green
        Write-Host ""
        Write-Host $response.instructions -ForegroundColor Cyan
    } else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error Details:" -ForegroundColor Red
        Write-Host "  Step: $($response.step)" -ForegroundColor Yellow
        Write-Host "  Message: $($response.message)" -ForegroundColor Yellow
        Write-Host "  Error: $($response.error)" -ForegroundColor Red
        Write-Host ""
        
        if ($response.details) {
            Write-Host "Configuration:" -ForegroundColor Yellow
            Write-Host "  Host: $($response.details.host)" -ForegroundColor White
            Write-Host "  Port: $($response.details.port)" -ForegroundColor White
            Write-Host "  User: $($response.details.user)" -ForegroundColor White
            Write-Host "  Password Set: $($response.details.hasPassword)" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "FIX: Add environment variables to Railway dashboard" -ForegroundColor Cyan
        Write-Host "  1. Go to Railway dashboard" -ForegroundColor White
        Write-Host "  2. Select your project" -ForegroundColor White
        Write-Host "  3. Go to Variables tab" -ForegroundColor White
        Write-Host "  4. Add EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_APP_PASSWORD" -ForegroundColor White
        Write-Host "  5. See RAILWAY_ENV_SETUP.md for detailed instructions" -ForegroundColor White
    }
} catch {
    Write-Host "❌ REQUEST FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "  • Railway app is not deployed" -ForegroundColor White
    Write-Host "  • URL is incorrect" -ForegroundColor White
    Write-Host "  • Network connectivity issues" -ForegroundColor White
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "For more help, see:" -ForegroundColor White
Write-Host "  • RAILWAY_ENV_SETUP.md" -ForegroundColor Cyan
Write-Host "  • EMAIL_FIX_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
