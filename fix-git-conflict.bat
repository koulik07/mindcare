@echo off
echo Fixing Git conflict and deploying to GitHub...
echo.

echo Step 1: Pulling remote changes...
git pull origin main --allow-unrelated-histories

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Committing changes...
git commit -m "Deploy MindCare PWA with all features"

echo.
echo Step 4: Pushing to GitHub...
git push -u origin main

echo.
echo Deployment complete! Your app should be available at:
echo https://koulik07.github.io/mindcare
echo.
echo Wait 5-10 minutes for GitHub Pages to build and deploy.
echo.
pause
