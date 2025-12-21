#!/usr/bin/env pwsh
# Quick Start Script for Cavlo Video Conferencing

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cavlo Video Conferencing Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if already running
$backend = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "relayer" }
$frontend = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "vite" }

if ($backend) {
    Write-Host "✓ Backend already running" -ForegroundColor Green
} else {
    Write-Host "Starting Backend (relayer-ws)..." -ForegroundColor Yellow
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\relayer-ws'; npm run dev"
    Start-Sleep -Seconds 3
}

if ($frontend) {
    Write-Host "✓ Frontend already running" -ForegroundColor Green
} else {
    Write-Host "Starting Frontend (chat-app)..." -ForegroundColor Yellow
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\chat-app'; npm run dev"
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8081" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "To test video conferencing:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Click 'Start Room'" -ForegroundColor White
Write-Host "3. Copy the URL" -ForegroundColor White
Write-Host "4. Open the URL in another browser/tab" -ForegroundColor White
Write-Host "5. Click 'Join'" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
