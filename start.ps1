# 心灵花园 - 一键启动脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  \u5FC3\u7075\u82B1\u56ED - AI \u5FC3\u7406\u54A8\u8BE2\u7CFB\u7EDF" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path $MyInvocation.MyCommand.Path -Parent

# 1. \u542F\u52A8 Python FastAPI AI \u670D\u52A1
Write-Host "[1/3] \u6B63\u5728\u542F\u52A8 AI \u5FC3\u7406\u5F15\u64CE..." -ForegroundColor Yellow
$aiLog = Join-Path $root "ai-service\ai-service.log"
$aiErr = Join-Path $root "ai-service\ai-service-err.log"
Start-Process -NoNewWindow python "main.py" -RedirectStandardOutput $aiLog -RedirectStandardError $aiErr -WorkingDirectory (Join-Path $root "ai-service")
Start-Sleep 2

# 2. \u542F\u52A8 Node.js \u7F51\u5173
Write-Host "[2/3] \u6B63\u5728\u542F\u52A8 API \u7F51\u5173..." -ForegroundColor Yellow
$svLog = Join-Path $root "server\server.log"
$svErr = Join-Path $root "server\server-err.log"
Start-Process -NoNewWindow node "src/index.js" -RedirectStandardOutput $svLog -RedirectStandardError $svErr -WorkingDirectory (Join-Path $root "server")
Start-Sleep 1

# 3. \u542F\u52A8 Vue \u524D\u7AEF
Write-Host "[3/3] \u6B63\u5728\u542F\u52A8 \u524D\u7AEF\u9875\u9762..." -ForegroundColor Yellow
$uiLog = Join-Path $root "client\vite.log"
$uiErr = Join-Path $root "client\vite-err.log"
Start-Process -NoNewWindow powershell "-NoProfile -Command npx vite --host" -RedirectStandardOutput $uiLog -RedirectStandardError $uiErr -WorkingDirectory (Join-Path $root "client")
Start-Sleep 3

# \u68C0\u67E5\u670D\u52A1\u72B6\u6001
Write-Host ""
Write-Host "\u68C0\u67E5\u670D\u52A1\u72B6\u6001..." -ForegroundColor Yellow

$aiHealth = curl.exe -s http://localhost:8000/ai/health 2>$null
$svHealth = curl.exe -s http://localhost:3001/api/health 2>$null

if ($aiHealth -match "ok") {
    Write-Host "  [OK] AI \u5FC3\u7406\u5F15\u64CE: http://localhost:8000" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] AI \u5FC3\u7406\u5F15\u64CE\u542F\u52A8\u5931\u8D25" -ForegroundColor Red
}

if ($svHealth -match "ok") {
    Write-Host "  [OK] API \u7F51\u5173: http://localhost:3001" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] API \u7F51\u5173\u542F\u52A8\u5931\u8D25" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  \u2705 \u5168\u90E8\u670D\u52A1\u542F\u52A8\u5B8C\u6210!" -ForegroundColor Green
Write-Host "  \u{1F310} \u6253\u5F00\u6D4F\u89C8\u5668\u8BBF\u95EE:" -ForegroundColor White
Write-Host "  http://localhost:5175" -ForegroundColor Cyan
Write-Host ""
Write-Host "  \u{1F6D1} \u505C\u6B62\u670D\u52A1: \u8FD0\u884C Stop-Process -Name python,node -Force" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
