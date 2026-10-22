@echo off
where node >nul 2>nul || (echo Node.js 18+ is required: https://nodejs.org & pause & exit /b 1)
start "" http://localhost:3000
node src\server.js
