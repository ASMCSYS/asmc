@echo off
echo Starting ASMC Admin Build Process...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Run the build script
echo Running build script...
node build.js

REM Check if build was successful
if %errorlevel% equ 0 (
    echo.
    echo Build completed successfully!
    echo Build output is in: asmc-admin-build
) else (
    echo.
    echo Build failed with error code: %errorlevel%
)

pause 