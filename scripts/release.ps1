# Release Script for Ink Highlighter
# Creates a local build and packages it as a zip file

Write-Host "Building Ink Highlighter..." -ForegroundColor Cyan

# Build the extension
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Get version from manifest
$manifest = Get-Content "dist/manifest.json" | ConvertFrom-Json
$version = $manifest.version

# Create zip filename
$zipName = "ink-highlighter-v$version.zip"

# Remove old zip if exists
if (Test-Path $zipName) {
    Remove-Item $zipName
    Write-Host "Removed old $zipName" -ForegroundColor Yellow
}

# Create zip archive
Write-Host "Creating $zipName..." -ForegroundColor Cyan
Compress-Archive -Path dist\* -DestinationPath $zipName

Write-Host "`n✅ Release package created: $zipName" -ForegroundColor Green
Write-Host "`nTo create a GitHub release:" -ForegroundColor Cyan
Write-Host "1. git tag v$version" -ForegroundColor White
Write-Host "2. git push origin v$version" -ForegroundColor White
Write-Host "`nOr manually upload $zipName to GitHub Releases" -ForegroundColor Cyan
