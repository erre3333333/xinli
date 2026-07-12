$ErrorActionPreference = 'SilentlyContinue'
$cc = 'D:\OPENCODE\cc'

function Start-Server {
  $p = Start-Process -WindowStyle Hidden -FilePath "node" -ArgumentList "src/index.js" -WorkingDirectory "$cc\server" -PassThru
  Write-Output "server pid=$($p.Id)"
  return $p
}

function Start-Client {
  $p = Start-Process -WindowStyle Hidden -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$cc\client" -PassThru
  Write-Output "client pid=$($p.Id)"
  return $p
}

function Start-Tunnel {
  Remove-Item "$cc\tunnel-url.txt" -Force -ErrorAction SilentlyContinue
  $p = Start-Process -WindowStyle Hidden -FilePath "node" -ArgumentList "start-tunnel.mjs" -WorkingDirectory "$cc" -PassThru
  Write-Output "tunnel pid=$($p.Id)"
  Start-Sleep 10
  $url = Get-Content "$cc\tunnel-url.txt" -ErrorAction SilentlyContinue
  Write-Output "TUNNEL_URL=$url"
  return $p
}

$sp = Start-Server
$cp = Start-Client
Write-Output "等待服务启动..."
Start-Sleep 5
$tp = Start-Tunnel
Start-Sleep 3

Write-Output "`n=== 所有进程已启动 ==="
Write-Output "server: $($sp.Id)"
Write-Output "client: $($cp.Id)"
Write-Output "tunnel: $($tp.Id)"

# Watchdog loop
while ($true) {
  Start-Sleep 30
  $url = Get-Content "$cc\tunnel-url.txt" -ErrorAction SilentlyContinue
  if (-not $url) {
    Write-Output "[$(Get-Date -Format HH:mm:ss)] tunnel died, restarting..."
    $tp = Start-Tunnel
  }
  if (-not (Get-Process -Id $sp.Id -ErrorAction SilentlyContinue)) {
    Write-Output "[$(Get-Date -Format HH:mm:ss)] server died, restarting..."
    $sp = Start-Server
  }
  if (-not (Get-Process -Id $cp.Id -ErrorAction SilentlyContinue)) {
    Write-Output "[$(Get-Date -Format HH:mm:ss)] client died, restarting..."
    $cp = Start-Client
  }
}
