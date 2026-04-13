# Clean Start Script for ORBIT Project
# Run this anytime you have issues starting the dev server

Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan

# Kill all node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Remove .next cache
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host "🚀 Starting dev server..." -ForegroundColor Cyan

# Start dev server
npm run dev

