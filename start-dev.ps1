# Sewanagala Sugar Tour - Development Server Starter
# This script ensures a clean start and avoids permission issues

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Sewanagala Sugar Tour - Dev Server" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Stop any running node processes
Write-Host "1. Stopping existing node processes..." -ForegroundColor Yellow

# First, try to kill process on port 3000 specifically
$port3000 = netstat -ano | findstr :3000 | findstr LISTENING
if ($port3000) {
    $pid = ($port3000 -split '\s+')[-1]
    Write-Host "   Found process on port 3000 (PID: $pid)" -ForegroundColor Cyan
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

# Then stop all node processes
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✓ Processes stopped" -ForegroundColor Green

# Clean .next folder if it exists
Write-Host "2. Cleaning build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    try {
        Remove-Item -Path ".next" -Recurse -Force -ErrorAction Stop
        Write-Host "   ✓ Cache cleaned" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠ Cache cleanup skipped (folder may be locked)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✓ No cache to clean" -ForegroundColor Green
}

Start-Sleep -Seconds 1

# Start the development server
Write-Host "3. Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

npm run dev

# This line will only run if npm run dev exits
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Server stopped." -ForegroundColor Yellow
