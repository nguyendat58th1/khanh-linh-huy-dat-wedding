# ============================================
# Wedding Gallery — Generate manifest.json
# ============================================
# Quet thu muc assets/images/ va sinh file manifest.json
# Chay lenh: pwsh ./generate-manifest.ps1   (hoac click chuot phai > Run with PowerShell)
# ============================================

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ImagesDir  = Join-Path $ScriptDir 'assets\images'
$Manifest   = Join-Path $ImagesDir 'manifest.json'

if (-not (Test-Path $ImagesDir)) {
    Write-Host "Khong tim thay thu muc: $ImagesDir" -ForegroundColor Red
    exit 1
}

$Exts = @('*.jpg','*.jpeg','*.png','*.webp','*.JPG','*.JPEG','*.PNG')
$Files = Get-ChildItem -Path $ImagesDir -Include $Exts -File |
         Sort-Object Name |
         Select-Object -ExpandProperty Name

if ($Files.Count -eq 0) {
    Write-Host "Khong co anh nao trong $ImagesDir" -ForegroundColor Yellow
    '[]' | Set-Content -Path $Manifest -Encoding UTF8
    exit 0
}

$Files | ConvertTo-Json -Compress | Set-Content -Path $Manifest -Encoding UTF8
Write-Host "Da tao manifest.json voi $($Files.Count) anh:" -ForegroundColor Green
$Files | ForEach-Object { Write-Host "  - $_" }
