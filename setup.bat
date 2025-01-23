@echo off
echo Installing Node.js and setting up the project...

:: Download Node.js installer
curl -o nodejs_installer.msi https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi

:: Install Node.js silently
msiexec /i nodejs_installer.msi /qn

:: Wait for installation to complete
timeout /t 30

:: Install project dependencies
call npm install

:: Start the server
start cmd /k "npm start"

:: Open the application in default browser
timeout /t 5
start http://localhost:3000

echo Setup complete! The application should open in your browser shortly.
