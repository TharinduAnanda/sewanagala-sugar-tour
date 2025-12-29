# Kill Process on Port 3000

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Kill Port 3000 Process" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking for process on port 3000..." -ForegroundColor Yellow

$port3000 = netstat -ano | findstr :3000 | findstr LISTENING

if ($port3000) {
    Write-Host "Found process on port 3000:" -ForegroundColor Red
    Write-Host $port3000
    Write-Host ""
    
    # Extract PID using a different variable name
    $processId = ($port3000 -split '\s+')[-1]
    
    Write-Host "Killing process ID: $processId" -ForegroundColor Yellow
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    
    Start-Sleep -Seconds 2
    
    # Verify it's killed
    $check = netstat -ano | findstr :3000 | findstr LISTENING
    if ($check) {
        Write-Host "⚠ Failed to kill process" -ForegroundColor Red
        Write-Host "Try running as Administrator" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Port 3000 is now free!" -ForegroundColor Green
    }
} else {
    Write-Host "✓ No process running on port 3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
