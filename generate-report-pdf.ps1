# Generate PDF from Markdown Report
# This script converts COMPLETE_PROJECT_REPORT.md to PDF

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PDF Report Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$mdFile = "COMPLETE_PROJECT_REPORT.md"
$pdfFile = "Sewanagala_Sugar_Factory_Tour_Report.pdf"

# Check if markdown file exists
if (-not (Test-Path $mdFile)) {
    Write-Host "❌ Error: $mdFile not found" -ForegroundColor Red
    exit 1
}

Write-Host "Found report file: $mdFile" -ForegroundColor Green
Write-Host ""

# Option 1: Using pandoc (if installed)
Write-Host "Option 1: Using Pandoc (Professional)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Install: choco install pandoc" -ForegroundColor White
Write-Host "Install: choco install miktex" -ForegroundColor White
Write-Host "Command: pandoc $mdFile -o $pdfFile --pdf-engine=xelatex" -ForegroundColor White
Write-Host ""

# Option 2: Using markdown-pdf (npm package)
Write-Host "Option 2: Using markdown-pdf (NPM)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Install: npm install -g markdown-pdf" -ForegroundColor White
Write-Host "Command: markdown-pdf $mdFile" -ForegroundColor White
Write-Host ""

# Option 3: Using online converter
Write-Host "Option 3: Online Converter (Easy)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "1. Open: https://www.markdowntopdf.com/" -ForegroundColor White
Write-Host "2. Upload: $mdFile" -ForegroundColor White
Write-Host "3. Download PDF" -ForegroundColor White
Write-Host ""

# Option 4: Using VS Code extension
Write-Host "Option 4: VS Code Extension" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "1. Install: 'Markdown PDF' extension in VS Code" -ForegroundColor White
Write-Host "2. Open: $mdFile in VS Code" -ForegroundColor White
Write-Host "3. Right-click → 'Markdown PDF: Export (pdf)'" -ForegroundColor White
Write-Host ""

# Option 5: Using Chrome/Edge print to PDF
Write-Host "Option 5: Browser Print (Simple)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "1. Install Chrome extension: 'Markdown Viewer'" -ForegroundColor White
Write-Host "2. Open: $mdFile in Chrome" -ForegroundColor White
Write-Host "3. Press Ctrl+P → Save as PDF" -ForegroundColor White
Write-Host ""

# Check if pandoc is available
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue
if ($pandocInstalled) {
    Write-Host "✅ Pandoc is installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Generate PDF now? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host ""
        Write-Host "Generating PDF..." -ForegroundColor Yellow
        
        try {
            pandoc $mdFile -o $pdfFile --pdf-engine=xelatex -V geometry:margin=1in
            
            if (Test-Path $pdfFile) {
                Write-Host "✅ PDF generated successfully: $pdfFile" -ForegroundColor Green
                Write-Host ""
                Write-Host "Opening PDF..." -ForegroundColor Yellow
                Start-Process $pdfFile
            } else {
                Write-Host "❌ PDF generation failed" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
            Write-Host "Try installing MiKTeX: choco install miktex" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  Pandoc is not installed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Recommended: Install Pandoc for best results" -ForegroundColor Cyan
    Write-Host "Run: choco install pandoc" -ForegroundColor White
    Write-Host "Run: choco install miktex" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use one of the other options above" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
