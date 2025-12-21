# Start Relayer WebSocket Server

Write-Host "Starting relayer-ws server..." -ForegroundColor Green
Write-Host "Server will run on http://localhost:8081" -ForegroundColor Cyan
Write-Host "Socket.IO endpoint: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location -Path $PSScriptRoot
npm run dev
