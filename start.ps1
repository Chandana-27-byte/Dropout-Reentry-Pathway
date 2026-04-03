# start.ps1
# This script starts both the Node.js backend and the React frontend in separate windows.

Write-Host "Starting the Dropout Re-entry Pathway System..." -ForegroundColor Cyan

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm is not installed or not in your PATH. Please install Node.js first." -ForegroundColor Red
    Exit
}

# 1. Start the Backend Server
Write-Host "Starting backend server (port 5000)..." -ForegroundColor Yellow
$serverPath = Join-Path -Path $PSScriptRoot -ChildPath "server"
if (Test-Path $serverPath) {
    Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit -Command `"cd '$serverPath'; npm.cmd run dev`""
} else {
    Write-Host "Server directory not found at $serverPath!" -ForegroundColor Red
}

# 2. Start the Frontend Client
Write-Host "Starting frontend client (port 3000)..." -ForegroundColor Yellow
$clientPath = Join-Path -Path $PSScriptRoot -ChildPath "client"
if (Test-Path $clientPath) {
    Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit -Command `"cd '$clientPath'; npm.cmd run dev`""
} else {
    Write-Host "Client directory not found at $clientPath!" -ForegroundColor Red
}

Write-Host "Startup commands issued successfully!" -ForegroundColor Green
Write-Host "The application servers should be booting up." -ForegroundColor Gray
