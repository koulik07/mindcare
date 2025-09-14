@echo off
echo Starting MindCare Development Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python found. Starting server on http://localhost:8000
    echo.
    echo Open your browser and go to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    REM Check if Node.js is available
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Node.js found. Installing serve if needed...
        npm list -g serve >nul 2>&1
        if %errorlevel% neq 0 (
            echo Installing serve globally...
            npm install -g serve
        )
        echo Starting server on http://localhost:3000
        echo.
        echo Open your browser and go to: http://localhost:3000
        echo Press Ctrl+C to stop the server
        echo.
        start http://localhost:3000
        serve -s . -l 3000
    ) else (
        echo Neither Python nor Node.js found.
        echo Please install Python or Node.js to run the development server.
        echo.
        echo Alternative: You can also use any other web server like:
        echo - Live Server extension in VS Code
        echo - XAMPP/WAMP for PHP
        echo - IIS for Windows
        echo.
        pause
    )
)
