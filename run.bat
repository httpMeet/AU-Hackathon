@echo off
echo BudgetWise Identity - JavaScript Version
echo.
echo Cleaning cache...
echo.
npm cache clean --force
echo.
echo Fixing Vite configuration...
node fix-vite-jsx.js
echo.
echo Fixing JSX files (optional step - only use if needed)...
REM Uncomment the next line if you want to convert .js files to .jsx
REM node fix-jsx.js
echo.
echo Starting the development server...
echo.
npm run dev 